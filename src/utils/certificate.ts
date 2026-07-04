export function asgNormalizeCertificateId(value: string): string {
  const raw = String(value || '').trim().toUpperCase()
  if (!raw) return ''
  return raw.startsWith('ASG-') ? raw : `ASG-${raw}`
}

export interface CertificateRecord {
  certificateId: string
  name: string
  course: string
  issued: string
  signature?: string
  date?: string
}

export function asgCertificateSignature(record: {
  certificateId?: string
  id?: string
  name: string
  course?: string
  issued?: string
  date?: string
}): string {
  const issuedDate = String(record.issued || record.date || '').slice(0, 10)
  const courseName = String(record.course || 'Data Science & Machine Learning').trim()
  const value = [
    asgNormalizeCertificateId(record.certificateId || record.id || ''),
    String(record.name || '').trim().toLowerCase(),
    courseName.toLowerCase(),
    issuedDate,
    'asg-tech-online-credential-v1'
  ].join('|')
  
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    // FNV-1a bit operations matching original JS exactly
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)
  }
  return (hash >>> 0).toString(16).toUpperCase().padStart(8, '0')
}

export function asgVerifyCertificatePayload(payload: {
  certificateId: string
  name: string
  course: string
  issued: string
  signature: string
}): boolean {
  if (!payload) return false
  const calculatedSig = asgCertificateSignature({
    certificateId: payload.certificateId,
    name: payload.name,
    course: payload.course,
    issued: payload.issued
  })
  return payload.signature === calculatedSig
}

export function asgBuildCertificateVerificationUrl(record: {
  certificateId: string
  name: string
  course: string
  issued: string
}): string {
  const params = new URLSearchParams({
    id: asgNormalizeCertificateId(record.certificateId),
    name: record.name,
    course: record.course,
    issued: String(record.issued).slice(0, 10),
    sig: asgCertificateSignature(record)
  })
  return `${window.location.origin}/certificate-verify?${params.toString()}`
}
