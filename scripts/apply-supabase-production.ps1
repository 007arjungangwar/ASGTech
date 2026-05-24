param(
    [Parameter(Mandatory = $true)]
    [string]$DatabasePassword,

    [Parameter(Mandatory = $true)]
    [string]$AdminPassword
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$tempDir = Join-Path $root ".supabase-temp"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

$encodedDbPassword = [System.Uri]::EscapeDataString($DatabasePassword)
$dbUrl = "postgresql://postgres:$encodedDbPassword@db.prktqmhssywmwdmtekpj.supabase.co:5432/postgres"

$escapedAdminPassword = $AdminPassword.Replace("'", "''")
$adminSql = @"
create extension if not exists pgcrypto;

update auth.users
set
    encrypted_password = crypt('$escapedAdminPassword', gen_salt('bf')),
    email_confirmed_at = coalesce(email_confirmed_at, now()),
    confirmation_sent_at = null,
    recovery_sent_at = null,
    updated_at = now(),
    aud = 'authenticated',
    role = 'authenticated'
where lower(email) = 'arjungangwariitpkd@gmail.com';

update public.profiles
set
    role = case when lower(email) = 'arjungangwariitpkd@gmail.com' then 'admin' else 'student' end,
    updated_at = now()
where role = 'admin'
   or lower(email) = 'arjungangwariitpkd@gmail.com';

select email, role, updated_at
from public.profiles
order by updated_at desc;
"@

$adminSqlPath = Join-Path $tempDir "force-admin-password.sql"
Set-Content -Path $adminSqlPath -Value $adminSql -Encoding UTF8

Push-Location $root
try {
    npx supabase db query --db-url $dbUrl --file supabase-setup.sql
    npx supabase db query --db-url $dbUrl --file supabase-seed-content.sql
    npx supabase db query --db-url $dbUrl --file $adminSqlPath
    npx supabase db query --db-url $dbUrl "select key from public.site_data order by key;"
}
finally {
    Pop-Location
    Remove-Item -LiteralPath $adminSqlPath -Force -ErrorAction SilentlyContinue
}
