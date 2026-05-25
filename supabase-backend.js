// ASG Tech Supabase backend bridge.
(function() {
    "use strict";

    const ASG_SUPABASE_CONFIG = {
        url: "https://prktqmhssywmwdmtekpj.supabase.co",
        anonKey: "sb_publishable_HJTIPzdh-f-6WdxLcmowIQ_mgpkF0RW",
        storageBucket: "asg-content",
        adminEmails: ["arjungangwariitpkd@gmail.com"]
    };

    const ASG_SUPABASE_SDK_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

    const ASG_CONTENT_KEYS = [
        "asgQuizCatalog",
        "asgQuizQuestions",
        "asgCodingChallenges",
        "asgCourses",
        "asgBlogPosts",
        "asgProjectShowcase",
        "asgVideoPlaylists",
        "asgRoadmapItems",
        "asgVideoLibrary",
        "asgResourceLibrary",
        "studentAnnouncement"
    ];

    const ASG_CONTENT_FIELD_MAP = [
        { field: "quizCatalog", storageKey: "asgQuizCatalog" },
        { field: "quizQuestions", storageKey: "asgQuizQuestions" },
        { field: "codingChallenges", storageKey: "asgCodingChallenges" },
        { field: "courses", storageKey: "asgCourses" },
        { field: "blogPosts", storageKey: "asgBlogPosts" },
        { field: "projectShowcase", storageKey: "asgProjectShowcase" },
        { field: "videoPlaylists", storageKey: "asgVideoPlaylists" },
        { field: "roadmapItems", storageKey: "asgRoadmapItems" },
        { field: "videoLibrary", storageKey: "asgVideoLibrary" },
        { field: "resourceLibrary", storageKey: "asgResourceLibrary" },
        { field: "studentAnnouncement", storageKey: "studentAnnouncement" }
    ];

    const ASG_ACTIVITY_KEYS = [
        "asgQuizAttempts",
        "quizScores",
        "asgCodingSubmissions",
        "asgExamAttempts",
        "asgCourseProgress",
        "asgCourseAccessRequests",
        "asgCourseAccessPermissions",
        "certificates",
        "asgCertificateRequests",
        "asgCertificateNameLocks",
        "studentQuestions"
    ];

    const ASG_ADMIN_KEYS = [
        "asgExamRetakePermissions",
        "asgCertificatePermissions",
        "asgLegacyUsers"
    ];

    const ASG_SYNC_KEYS = [...ASG_CONTENT_KEYS, ...ASG_ACTIVITY_KEYS, ...ASG_ADMIN_KEYS];
    const ASG_SYNC_KEY_SET = new Set(ASG_SYNC_KEYS);
    const ASG_CONTENT_KEY_SET = new Set(ASG_CONTENT_KEYS);
    const ASG_ACTIVITY_KEY_SET = new Set(ASG_ACTIVITY_KEYS);
    const ASG_ADMIN_KEY_SET = new Set(ASG_ADMIN_KEYS);
    const LOCAL_CONTENT_BACKUP_KEY = "asgCloudMigrationBackup";

    let servicesPromise = null;
    let authReadyPromise = null;
    let currentProfile = null;
    let authListenerStarted = false;
    let learningSyncStarted = false;
    let activitySyncStarted = false;
    let userSyncStarted = false;
    let activityReloadTimer = null;
    let usersReloadTimer = null;
    const pendingWrites = new Map();
    const missingRemoteKeys = new Set();
    const channelNames = new Set();

    function getConfig() {
        return {
            ...ASG_SUPABASE_CONFIG,
            ...(window.ASG_SUPABASE_CONFIG || {})
        };
    }

    function hasUsableConfig(config) {
        return Boolean(
            config &&
            /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(String(config.url || "").trim()) &&
            String(config.anonKey || "").trim() &&
            !String(config.url || "").includes("YOUR_SUPABASE") &&
            !String(config.anonKey || "").includes("YOUR_SUPABASE")
        );
    }

    function createConfigError() {
        const error = new Error("Supabase is not configured yet. Add your Supabase project URL and anon key in supabase-backend.js, then run supabase-setup.sql in the Supabase SQL editor.");
        error.code = "supabase/config-missing";
        return error;
    }

    function dispatchBackendStatus(status, detail = {}) {
        window.dispatchEvent(new CustomEvent("asg:backend-status", {
            detail: { status, provider: "supabase", ...detail }
        }));
    }

    function parseJSON(rawValue, fallback) {
        if (rawValue === null || rawValue === undefined || rawValue === "") return fallback;
        try {
            const parsed = JSON.parse(rawValue);
            return parsed === undefined ? fallback : parsed;
        } catch (error) {
            return fallback;
        }
    }

    function readLocalJSON(key, fallback) {
        return parseJSON(localStorage.getItem(key), fallback);
    }

    function localContentValueHasData(value) {
        if (Array.isArray(value)) return value.length > 0;
        if (!value || typeof value !== "object") return value !== null && value !== undefined && value !== "";
        return Object.keys(value).some((key) => {
            const item = value[key];
            if (Array.isArray(item)) return item.length > 0;
            if (item && typeof item === "object") return Object.keys(item).length > 0;
            return item !== null && item !== undefined && item !== "";
        });
    }

    function createLocalContentBackup(reason = "startup") {
        const existing = readLocalJSON(LOCAL_CONTENT_BACKUP_KEY, null);
        const data = {};

        ASG_CONTENT_KEYS.forEach((key) => {
            const rawValue = localStorage.getItem(key);
            if (rawValue === null) return;
            const value = parseJSON(rawValue, null);
            if (!localContentValueHasData(value)) return;
            data[key] = value;
        });

        if (!Object.keys(data).length) return existing;

        const backup = {
            version: Date.now(),
            reason,
            createdAt: new Date().toISOString(),
            data
        };
        const existingSize = existing && existing.data ? Object.keys(existing.data).length : 0;
        const nextSize = Object.keys(data).length;

        if (!existing || nextSize >= existingSize || reason === "manual") {
            localStorage.setItem(LOCAL_CONTENT_BACKUP_KEY, JSON.stringify(backup));
            return backup;
        }

        return existing;
    }

    function writeLocalJSON(key, value, source = "supabase") {
        const serialized = JSON.stringify(value);
        if (localStorage.getItem(key) === serialized) return false;
        localStorage.setItem(key, serialized);
        window.dispatchEvent(new CustomEvent("asg:data-updated", { detail: { key, value, source } }));
        return true;
    }

    function getStoredSessionUser() {
        return parseJSON(sessionStorage.getItem("currentUser"), null);
    }

    function normalizeEmail(email) {
        return String(email || "").trim().toLowerCase();
    }

    function getAdminEmails() {
        const config = getConfig();
        const emails = Array.isArray(config.adminEmails) ? config.adminEmails : [];
        return emails.map(normalizeEmail).filter(Boolean);
    }

    function isAdminEmail(email) {
        return getAdminEmails().includes(normalizeEmail(email));
    }

    function isProfileAdmin(profile) {
        return Boolean(profile && isAdminEmail(profile.email));
    }

    function cleanClone(value) {
        return JSON.parse(JSON.stringify(value ?? null));
    }

    function toIsoDate(value) {
        if (!value) return "";
        if (typeof value === "string") return value;
        if (typeof value.toDate === "function") return value.toDate().toISOString();
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? "" : date.toISOString();
    }

    function getProjectRef(config) {
        try {
            return new URL(config.url).hostname.split(".")[0] || "";
        } catch (error) {
            return "";
        }
    }

    function getStoredAccessToken(config) {
        const projectRef = getProjectRef(config);
        const preferredKey = projectRef ? `sb-${projectRef}-auth-token` : "";
        const possibleKeys = [
            preferredKey,
            ...Object.keys(localStorage).filter((key) => key.startsWith("sb-") && key.endsWith("-auth-token"))
        ].filter(Boolean);

        for (const key of possibleKeys) {
            const session = parseJSON(localStorage.getItem(key), null);
            const expiresAt = Number(session && (session.expires_at || (session.currentSession && session.currentSession.expires_at)) || 0);
            if (expiresAt && expiresAt < Math.floor(Date.now() / 1000) + 60) continue;
            const accessToken = session && (session.access_token || (session.currentSession && session.currentSession.access_token));
            if (accessToken) return accessToken;
        }

        return "";
    }

    function timeoutAfter(ms, message) {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error(message)), ms);
        });
    }

    async function getSessionAccessToken(services) {
        const storedToken = getStoredAccessToken(services.config);
        if (storedToken) return storedToken;

        try {
            const result = await Promise.race([
                services.client.auth.getSession(),
                timeoutAfter(6000, "Supabase session lookup timed out.")
            ]);
            return result && result.data && result.data.session ? result.data.session.access_token || "" : "";
        } catch (error) {
            return "";
        }
    }

    function parseRestResponse(text) {
        if (!text) return null;
        try {
            return JSON.parse(text);
        } catch (error) {
            return text;
        }
    }

    async function restRequest(path, options = {}) {
        const services = options.services || await loadServices();
        const { config } = services;
        const token = await getSessionAccessToken(services);
        const headers = {
            apikey: config.anonKey,
            Authorization: `Bearer ${token || config.anonKey}`,
            ...(options.headers || {})
        };

        const method = options.method || "GET";
        const init = { method, headers };
        if (Object.prototype.hasOwnProperty.call(options, "body")) {
            headers["Content-Type"] = "application/json";
            init.body = JSON.stringify(options.body);
        }
        if (options.prefer) {
            headers.Prefer = options.prefer;
        }

        const response = await Promise.race([
            fetch(`${config.url}/rest/v1/${path}`, init),
            timeoutAfter(options.timeout || 15000, `Supabase REST request timed out: ${path}`)
        ]);
        const body = parseRestResponse(await response.text());

        if (!response.ok) {
            const message = body && typeof body === "object" && body.message
                ? body.message
                : `Supabase request failed with status ${response.status}.`;
            const error = new Error(message);
            error.status = response.status;
            error.details = body;
            throw error;
        }

        return body;
    }

    function restInFilter(values) {
        return `in.(${values.map((value) => String(value).replace(/[(),]/g, "")).join(",")})`;
    }

    function localNameFromEmail(email) {
        const name = normalizeEmail(email).split("@")[0] || "Student";
        return name
            .split(/[._-]+/)
            .filter(Boolean)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ") || "Student";
    }

    function cacheProfileLocally(profile) {
        if (!profile || !profile.email) return;
        const users = readLocalJSON("users", []);
        const existingUser = Array.isArray(users)
            ? users.find((user) => (
                String(user.id || "") === String(profile.id || "") ||
                normalizeEmail(user.email) === normalizeEmail(profile.email)
            ))
            : null;
        const nextUsers = Array.isArray(users)
            ? users.filter((user) => (
                String(user.id || "") !== String(profile.id || "") &&
                normalizeEmail(user.email) !== normalizeEmail(profile.email)
            ))
            : [];
        nextUsers.push({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            joinDate: profile.joinDate,
            provider: profile.provider || (existingUser && existingUser.provider) || "supabase",
            ...(existingUser && existingUser.password ? { password: existingUser.password } : {})
        });
        localStorage.setItem("users", JSON.stringify(nextUsers));
        window.dispatchEvent(new CustomEvent("asg:data-updated", {
            detail: { key: "users", value: nextUsers, source: "supabase" }
        }));
    }

    function sanitizeLegacyUser(user) {
        const email = normalizeEmail(user && user.email);
        if (!email) return null;
        return {
            id: String(user.id || email),
            name: String(user.name || localNameFromEmail(email)).trim(),
            email,
            role: isAdminEmail(email) ? "admin" : "student",
            joinDate: toIsoDate(user.joinDate || user.createdAt) || "",
            lastSeenAt: toIsoDate(user.lastSeenAt || user.updatedAt) || "",
            provider: user.provider === "supabase" ? "supabase" : "legacy-local"
        };
    }

    function mergeUserLists(primaryUsers, secondaryUsers) {
        const byEmail = new Map();
        [...(secondaryUsers || []), ...(primaryUsers || [])].forEach((user) => {
            const sanitized = sanitizeLegacyUser(user);
            if (!sanitized) return;
            byEmail.set(sanitized.email, sanitized);
        });
        return [...byEmail.values()].sort((left, right) => {
            if (left.role !== right.role) return left.role === "admin" ? -1 : 1;
            return String(left.name || left.email).localeCompare(String(right.name || right.email));
        });
    }

    function cacheLegacyUsers(users, sync = false) {
        const legacyUsers = mergeUserLists(users, []);
        localStorage.setItem("asgLegacyUsers", JSON.stringify(legacyUsers));
        window.dispatchEvent(new CustomEvent("asg:data-updated", {
            detail: { key: "asgLegacyUsers", value: legacyUsers, source: "legacy-users" }
        }));
        if (sync && currentProfile && isProfileAdmin(currentProfile)) {
            saveDataKey("asgLegacyUsers", legacyUsers).catch((error) => {
                console.warn("Could not sync legacy users to Supabase.", error);
            });
        }
        return legacyUsers;
    }

    function captureLegacyUsers(remoteUsers = []) {
        const localUsers = readLocalJSON("users", []);
        const existingLegacyUsers = readLocalJSON("asgLegacyUsers", []);
        const remoteEmails = new Set((remoteUsers || []).map((user) => normalizeEmail(user.email)).filter(Boolean));
        const localOnlyUsers = Array.isArray(localUsers)
            ? localUsers.filter((user) => {
                const email = normalizeEmail(user && user.email);
                return email && !remoteEmails.has(email);
            })
            : [];
        const nextLegacyUsers = mergeUserLists(existingLegacyUsers, localOnlyUsers)
            .filter((user) => !remoteEmails.has(normalizeEmail(user.email)));
        const changed = JSON.stringify(nextLegacyUsers) !== JSON.stringify(mergeUserLists(existingLegacyUsers, []));
        if (changed) return cacheLegacyUsers(nextLegacyUsers, true);
        return nextLegacyUsers;
    }

    function slugSegment(value, fallback = "file") {
        const cleaned = String(value || fallback)
            .trim()
            .replace(/\\/g, "/")
            .split("/")
            .pop()
            .replace(/[^a-z0-9._-]+/gi, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 120);
        return cleaned || fallback;
    }

    function slugFolder(value, fallback = "resources") {
        const segments = String(value || fallback)
            .split(/[\\/]+/)
            .map((segment) => slugSegment(segment, ""))
            .filter(Boolean)
            .map((segment) => segment.replace(/\./g, "-"));
        return segments.join("/") || fallback;
    }

    function ensureChannelName(name) {
        if (!channelNames.has(name)) {
            channelNames.add(name);
            return name;
        }
        return `${name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    async function loadServices() {
        if (servicesPromise) return servicesPromise;

        const config = getConfig();
        if (!hasUsableConfig(config)) {
            dispatchBackendStatus("offline", { error: "Supabase configuration is missing." });
            servicesPromise = Promise.reject(createConfigError());
            servicesPromise.catch(() => undefined);
            return servicesPromise;
        }

        servicesPromise = import(ASG_SUPABASE_SDK_URL).then(({ createClient }) => {
            const client = createClient(config.url, config.anonKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true,
                    storage: window.localStorage
                }
            });
            dispatchBackendStatus("ready");
            return { client, config };
        }).catch((error) => {
            console.warn("Supabase backend could not initialize.", error);
            dispatchBackendStatus("offline", { error: error.message || String(error) });
            throw error;
        });

        return servicesPromise;
    }

    async function profileFromSupabaseUser(supabaseUser, initialData = {}) {
        const services = await loadServices();
        const metadata = supabaseUser.user_metadata || {};
        const email = normalizeEmail(supabaseUser.email || initialData.email);
        let existing = {};

        try {
            const rows = await restRequest(
                `profiles?select=id,name,email,role,join_date,updated_at&id=eq.${encodeURIComponent(supabaseUser.id)}`,
                { services }
            );
            if (Array.isArray(rows) && rows[0]) existing = rows[0];
        } catch (error) {
            console.warn("Could not read Supabase user profile.", error);
        }

        const role = isAdminEmail(email) ? "admin" : "student";
        const profile = {
            id: supabaseUser.id,
            name: String(initialData.name || existing.name || metadata.name || metadata.full_name || localNameFromEmail(email)).trim(),
            email,
            role,
            joinDate: toIsoDate(existing.join_date || initialData.joinDate || supabaseUser.created_at) || new Date().toISOString(),
            provider: "supabase"
        };

        try {
            await restRequest("profiles?on_conflict=id", {
                services,
                method: "POST",
                prefer: "resolution=merge-duplicates",
                body: {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    role: profile.role,
                    join_date: profile.joinDate,
                    updated_at: new Date().toISOString()
                }
            });
        } catch (error) {
            console.warn("Could not update Supabase user profile.", error);
        }

        currentProfile = profile;
        sessionStorage.setItem("currentUser", JSON.stringify(profile));
        cacheProfileLocally(profile);
        return profile;
    }

    async function applySupabaseSession(session) {
        const supabaseUser = session && session.user ? session.user : null;
        if (!supabaseUser) {
            currentProfile = null;
            return null;
        }
        return profileFromSupabaseUser(supabaseUser);
    }

    async function restoreSession() {
        if (authReadyPromise) return authReadyPromise;

        authReadyPromise = loadServices().then(async (services) => {
            const { client } = services;

            if (!authListenerStarted) {
                authListenerStarted = true;
                client.auth.onAuthStateChange(async (_event, session) => {
                    try {
                        const profile = await applySupabaseSession(session);
                        dispatchBackendStatus(profile ? "signed-in" : "signed-out", { profile });
                    } catch (error) {
                        console.warn("Supabase auth state update failed.", error);
                    }
                });
            }

            const { data, error } = await client.auth.getSession();
            if (error) throw error;
            const profile = await applySupabaseSession(data.session);
            dispatchBackendStatus(profile ? "signed-in" : "signed-out", { profile });
            return profile;
        }).catch((error) => {
            if (error && error.code !== "supabase/config-missing") {
                console.warn("Supabase session restore failed.", error);
            }
            dispatchBackendStatus("offline", { error: error.message || String(error) });
            return getStoredSessionUser();
        });

        return authReadyPromise;
    }

    async function signIn(email, password) {
        const services = await loadServices();
        const { data, error } = await services.client.auth.signInWithPassword({
            email: normalizeEmail(email),
            password
        });
        if (error) throw error;
        authReadyPromise = Promise.resolve(profileFromSupabaseUser(data.user));
        return authReadyPromise;
    }

    async function requestPasswordReset(email) {
        const services = await loadServices();
        const currentPath = `${window.location.origin}${window.location.pathname}`;
        const redirectTo = `${currentPath}?mode=reset-password`;
        const { error } = await services.client.auth.resetPasswordForEmail(normalizeEmail(email), {
            redirectTo
        });
        if (error) throw error;
        return true;
    }

    async function updatePassword(password) {
        const services = await loadServices();
        const { data, error } = await services.client.auth.updateUser({ password });
        if (error) throw error;
        const user = data && data.user ? data.user : null;
        authReadyPromise = Promise.resolve(user ? profileFromSupabaseUser(user) : restoreSession());
        return authReadyPromise;
    }

    async function register(account) {
        const services = await loadServices();
        const email = normalizeEmail(account.email);
        const name = String(account.name || localNameFromEmail(email)).trim();
        const { data, error } = await services.client.auth.signUp({
            email,
            password: account.password,
            options: {
                data: { name }
            }
        });
        if (error) throw error;

        const profile = {
            id: data.user ? data.user.id : email,
            name,
            email,
            role: isAdminEmail(email) ? "admin" : "student",
            joinDate: new Date().toISOString(),
            provider: data.session ? "supabase" : "supabase-pending"
        };
        if (!data.session) {
            currentProfile = profile;
            authReadyPromise = Promise.resolve(profile);
            sessionStorage.setItem("currentUser", JSON.stringify(profile));
            cacheProfileLocally(profile);
            dispatchBackendStatus("signed-in", { profile });
            return profile;
        }

        authReadyPromise = Promise.resolve(profileFromSupabaseUser(data.user, profile));
        return authReadyPromise;
    }

    async function migrateLocalUser(localUser, password) {
        if (!localUser || !localUser.email || !password) return null;
        return register({
            name: localUser.name || localNameFromEmail(localUser.email),
            email: localUser.email,
            password,
            joinDate: localUser.joinDate || new Date().toISOString()
        });
    }

    async function signOut() {
        const services = await loadServices().catch(() => null);
        if (services) {
            await services.client.auth.signOut().catch(() => undefined);
        }
        currentProfile = null;
        authReadyPromise = Promise.resolve(null);
    }

    function canWriteKey(key, profile) {
        if (!ASG_SYNC_KEY_SET.has(key)) return false;
        if (ASG_CONTENT_KEY_SET.has(key) || ASG_ADMIN_KEY_SET.has(key)) return isProfileAdmin(profile);
        return Boolean(profile);
    }

    function recordMatchesProfile(record, profile) {
        if (!record || typeof record !== "object" || !profile) return false;
        const recordUserId = String(record.userId || record.uid || "").toLowerCase();
        const recordEmail = normalizeEmail(record.email || record.studentEmail);
        const profileId = String(profile.id || "").toLowerCase();
        const profileEmail = normalizeEmail(profile.email);

        if (recordUserId && profileId && recordUserId === profileId) return true;
        if (recordEmail && profileEmail && recordEmail === profileEmail) return true;
        return !recordUserId && !recordEmail;
    }

    function filterActivityForProfile(key, value, profile) {
        if (isProfileAdmin(profile)) return cleanClone(value);
        if (Array.isArray(value)) {
            return value.filter((record) => recordMatchesProfile(record, profile));
        }
        if ([
            "asgCourseProgress",
            "asgCertificateNameLocks",
            "asgCourseAccessPermissions"
        ].includes(key) && value && typeof value === "object") {
            const profileId = String(profile.id || "").toLowerCase();
            const profileEmail = normalizeEmail(profile.email);
            return Object.keys(value).reduce((records, progressKey) => {
                const normalizedKey = String(progressKey).toLowerCase();
                const record = value[progressKey] || {};
                if (
                    normalizedKey.startsWith(`${profileId}:`) ||
                    normalizedKey.startsWith(`${profileEmail}:`) ||
                    recordMatchesProfile(record, profile)
                ) {
                    records[progressKey] = record;
                }
                return records;
            }, {});
        }
        return cleanClone(value);
    }

    function mergeActivityValue(key, currentValue, nextValue) {
        if ([
            "asgCourseProgress",
            "asgCertificateNameLocks",
            "asgCourseAccessPermissions"
        ].includes(key)) {
            return {
                ...(currentValue && typeof currentValue === "object" && !Array.isArray(currentValue) ? currentValue : {}),
                ...(nextValue && typeof nextValue === "object" && !Array.isArray(nextValue) ? nextValue : {})
            };
        }

        if (Array.isArray(nextValue)) {
            const current = Array.isArray(currentValue) ? currentValue : [];
            const seen = new Set();
            return [...current, ...nextValue].filter((record) => {
                const id = record && typeof record === "object"
                    ? String(record.id || record.certificateId || `${record.email || ""}:${record.submittedAt || record.requestedAt || record.date || ""}`)
                    : JSON.stringify(record);
                if (seen.has(id)) return false;
                seen.add(id);
                return true;
            });
        }

        return nextValue;
    }

    async function saveUserActivityKey(key, value, profile) {
        const services = await loadServices();
        const cleanedValue = filterActivityForProfile(key, value, profile);
        await restRequest("user_activity?on_conflict=user_id,key", {
            services,
            method: "POST",
            prefer: "resolution=merge-duplicates",
            body: {
                user_id: profile.id,
                key,
                value: cleanedValue,
                updated_at: new Date().toISOString(),
                updated_by: {
                    uid: profile.id || "",
                    name: profile.name || "",
                    email: profile.email || "",
                    role: profile.role || ""
                }
            }
        });
        pendingWrites.delete(key);
        dispatchBackendStatus("synced", { key });
        return true;
    }

    async function saveUserActivityForUser(key, value, targetUser) {
        if (!ASG_ACTIVITY_KEY_SET.has(key) || !targetUser || !targetUser.id) return false;

        const profile = currentProfile || await restoreSession();
        if (!isProfileAdmin(profile)) return false;

        const services = await loadServices();
        await restRequest("user_activity?on_conflict=user_id,key", {
            services,
            method: "POST",
            prefer: "resolution=merge-duplicates",
            body: {
                user_id: targetUser.id,
                key,
                value: cleanClone(value),
                updated_at: new Date().toISOString(),
                updated_by: {
                    uid: profile.id || "",
                    name: profile.name || "",
                    email: profile.email || "",
                    role: profile.role || ""
                }
            }
        });
        dispatchBackendStatus("synced", { key });
        return true;
    }

    async function saveDataKey(key, value) {
        if (!ASG_SYNC_KEY_SET.has(key)) return false;

        pendingWrites.set(key, cleanClone(value));
        const profile = currentProfile || await restoreSession();
        if (!canWriteKey(key, profile)) return false;

        if (ASG_ACTIVITY_KEY_SET.has(key)) {
            return saveUserActivityKey(key, value, profile);
        }

        const services = await loadServices();
        const cleanedValue = cleanClone(value);
        await restRequest("site_data?on_conflict=key", {
            services,
            method: "POST",
            prefer: "resolution=merge-duplicates",
            body: {
                key,
                value: cleanedValue,
                updated_at: new Date().toISOString(),
                updated_by: {
                    uid: profile.id || "",
                    name: profile.name || "",
                    email: profile.email || "",
                    role: profile.role || ""
                }
            }
        });
        pendingWrites.delete(key);
        dispatchBackendStatus("synced", { key });
        return true;
    }

    async function publishContentSnapshot(data, options = {}) {
        const sourceData = data && typeof data === "object" ? data : {};
        const results = [];

        for (const entry of ASG_CONTENT_FIELD_MAP) {
            const hasStorageKey = Object.prototype.hasOwnProperty.call(sourceData, entry.storageKey);
            const hasField = Object.prototype.hasOwnProperty.call(sourceData, entry.field);
            if (!hasStorageKey && !hasField) continue;

            const value = hasStorageKey ? sourceData[entry.storageKey] : sourceData[entry.field];
            if (value === undefined || value === null) continue;

            await saveDataKey(entry.storageKey, value);
            if (options.updateLocal !== false) {
                localStorage.setItem(entry.storageKey, JSON.stringify(value));
                window.dispatchEvent(new CustomEvent("asg:data-updated", {
                    detail: { key: entry.storageKey, value, source: "manual-cloud-publish" }
                }));
            }
            results.push(entry.storageKey);
        }

        if (results.length) {
            localStorage.setItem("asgLastCloudPublishAt", new Date().toISOString());
            createLocalContentBackup("manual");
        }

        return results;
    }

    async function publishLocalContentBackup() {
        const backup = readLocalJSON(LOCAL_CONTENT_BACKUP_KEY, null);
        if (!backup || !backup.data || typeof backup.data !== "object") {
            throw new Error("No local admin content backup is available in this browser.");
        }
        return publishContentSnapshot(backup.data);
    }

    async function seedMissingRemoteData() {
        const profile = currentProfile || await restoreSession();
        if (!isProfileAdmin(profile)) return;

        missingRemoteKeys.forEach((key) => {
            if (!ASG_CONTENT_KEY_SET.has(key) && !ASG_ADMIN_KEY_SET.has(key)) return;
            const rawValue = localStorage.getItem(key);
            if (rawValue === null) return;
            const localValue = parseJSON(rawValue, null);
            if (localValue === null) return;
            saveDataKey(key, localValue).catch((error) => {
                console.warn(`Could not seed ${key} to Supabase.`, error);
            });
        });
    }

    async function loadSiteDataRows(keysToSync) {
        const services = await loadServices();
        const data = await restRequest(
            `site_data?select=key,value,updated_at,updated_by&key=${restInFilter(keysToSync)}`,
            { services }
        );

        const seen = new Set();
        (data || []).forEach((row) => {
            if (!row || !keysToSync.includes(row.key)) return;
            seen.add(row.key);
            writeLocalJSON(row.key, row.value);
            window.dispatchEvent(new CustomEvent("asg:backend-data-updated", {
                detail: {
                    key: row.key,
                    value: row.value,
                    updatedAt: toIsoDate(row.updated_at),
                    updatedBy: row.updated_by || null
                }
            }));
        });

        keysToSync.forEach((key) => {
            if (seen.has(key)) {
                missingRemoteKeys.delete(key);
            } else {
                missingRemoteKeys.add(key);
            }
        });
        seedMissingRemoteData();
    }

    async function getCloudContentStatus() {
        const services = await loadServices();
        const data = await restRequest(
            `site_data?select=key,updated_at,updated_by&key=${restInFilter(ASG_CONTENT_KEYS)}`,
            { services }
        );

        const rows = Array.isArray(data) ? data : [];
        const publishedKeys = rows.map((row) => row.key).filter(Boolean);
        return {
            provider: "supabase",
            totalKeys: ASG_CONTENT_KEYS.length,
            publishedKeys,
            missingKeys: ASG_CONTENT_KEYS.filter((key) => !publishedKeys.includes(key)),
            latestUpdatedAt: rows
                .map((row) => toIsoDate(row.updated_at))
                .filter(Boolean)
                .sort()
                .pop() || ""
        };
    }

    async function startLearningSync() {
        if (learningSyncStarted) return;
        learningSyncStarted = true;

        const services = await loadServices().catch(() => null);
        if (!services) return;

        const profile = currentProfile || await restoreSession();
        const keysToSync = profile ? [...ASG_CONTENT_KEYS, ...ASG_ADMIN_KEYS] : ASG_CONTENT_KEYS;

        await loadSiteDataRows(keysToSync).catch((error) => {
            console.warn("Supabase learning data sync failed.", error);
            dispatchBackendStatus("sync-error", { key: "site_data", error: error.message || String(error) });
        });

        const channel = services.client
            .channel(ensureChannelName("asg-site-data"))
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "site_data"
            }, (payload) => {
                const row = payload.new || payload.old || {};
                if (!row.key || !keysToSync.includes(row.key)) return;
                if (payload.eventType === "DELETE") {
                    localStorage.removeItem(row.key);
                    window.dispatchEvent(new CustomEvent("asg:data-updated", {
                        detail: { key: row.key, value: null, source: "supabase" }
                    }));
                    return;
                }
                if (!Object.prototype.hasOwnProperty.call(row, "value")) return;
                writeLocalJSON(row.key, row.value);
                window.dispatchEvent(new CustomEvent("asg:backend-data-updated", {
                    detail: {
                        key: row.key,
                        value: row.value,
                        updatedAt: toIsoDate(row.updated_at),
                        updatedBy: row.updated_by || null
                    }
                }));
            })
            .subscribe((status) => {
                if (status === "SUBSCRIBED") {
                    dispatchBackendStatus("listening");
                    flushPendingWrites();
                }
            });

        if (profile) {
            startActivitySync(profile, services);
        }

        return channel;
    }

    function aggregateActivityRows(rows, profile) {
        const aggregated = new Map();
        (rows || []).forEach((row) => {
            if (!row || !ASG_ACTIVITY_KEY_SET.has(row.key)) return;
            const value = isProfileAdmin(profile)
                ? row.value
                : filterActivityForProfile(row.key, row.value, profile);
            const currentValue = aggregated.has(row.key) ? aggregated.get(row.key) : undefined;
            aggregated.set(row.key, mergeActivityValue(row.key, currentValue, value));
        });

        ASG_ACTIVITY_KEYS.forEach((key) => {
            if (!aggregated.has(key)) return;
            writeLocalJSON(key, aggregated.get(key), "supabase-activity");
            window.dispatchEvent(new CustomEvent("asg:backend-data-updated", {
                detail: { key, value: aggregated.get(key), source: "supabase-activity" }
            }));
        });
    }

    async function reloadActivityRows(profile, services) {
        const filter = isProfileAdmin(profile) ? "" : `&user_id=eq.${encodeURIComponent(profile.id)}`;
        const rows = await restRequest(
            `user_activity?select=user_id,key,value,updated_at,updated_by${filter}`,
            { services }
        );
        aggregateActivityRows(rows || [], profile);
    }

    function scheduleActivityReload(profile, services) {
        clearTimeout(activityReloadTimer);
        activityReloadTimer = setTimeout(() => {
            reloadActivityRows(profile, services).catch((error) => {
                console.warn("Supabase activity refresh failed.", error);
            });
        }, 100);
    }

    function startActivitySync(profile, services) {
        if (activitySyncStarted) return;
        activitySyncStarted = true;

        reloadActivityRows(profile, services).catch((error) => {
            console.warn("Supabase activity sync failed.", error);
            dispatchBackendStatus("sync-error", { key: "activity", error: error.message || String(error) });
        });

        const options = {
            event: "*",
            schema: "public",
            table: "user_activity"
        };
        if (!isProfileAdmin(profile)) {
            options.filter = `user_id=eq.${profile.id}`;
        }

        services.client
            .channel(ensureChannelName("asg-user-activity"))
            .on("postgres_changes", options, () => scheduleActivityReload(profile, services))
            .subscribe();
    }

    async function reloadUsers(services) {
        const data = await restRequest(
            "profiles?select=id,name,email,role,join_date,updated_at&order=updated_at.desc",
            { services }
        );

        const users = (data || []).map((row) => ({
            id: row.id,
            name: String(row.name || localNameFromEmail(row.email)).trim(),
            email: normalizeEmail(row.email),
            role: row.role === "admin" ? "admin" : "student",
            joinDate: toIsoDate(row.join_date) || "",
            lastSeenAt: toIsoDate(row.updated_at) || ""
        })).filter((user) => user.email);
        const legacyUsers = captureLegacyUsers(users);
        const visibleUsers = mergeUserLists(users, legacyUsers);

        localStorage.setItem("users", JSON.stringify(visibleUsers));
        window.dispatchEvent(new CustomEvent("asg:data-updated", {
            detail: { key: "users", value: visibleUsers, source: "supabase" }
        }));
    }

    function scheduleUsersReload(services) {
        clearTimeout(usersReloadTimer);
        usersReloadTimer = setTimeout(() => {
            reloadUsers(services).catch((error) => {
                console.warn("Supabase user refresh failed.", error);
            });
        }, 100);
    }

    async function startUsersSync() {
        if (userSyncStarted) return;

        const profile = currentProfile || await restoreSession();
        if (!profile || !isProfileAdmin(profile)) return;
        userSyncStarted = true;

        const services = await loadServices().catch(() => null);
        if (!services) return;

        await reloadUsers(services).catch((error) => {
            console.warn("Supabase user sync failed.", error);
        });

        services.client
            .channel(ensureChannelName("asg-profiles"))
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "profiles"
            }, () => scheduleUsersReload(services))
            .subscribe();
    }

    async function uploadFile(file, options = {}) {
        if (!file) throw new Error("Choose a file to upload.");

        const profile = currentProfile || await restoreSession();
        if (!isProfileAdmin(profile)) {
            throw new Error("Only admin users can upload files to Supabase Storage.");
        }

        const services = await loadServices();
        const bucket = String(options.bucket || services.config.storageBucket || "asg-content").trim();
        const folder = slugFolder(options.folder || "resources", "resources");
        const fileName = slugSegment(options.fileName || file.name, "upload");
        const path = `${folder}/${Date.now()}-${fileName}`;
        const { data, error } = await services.client.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: "3600",
                contentType: file.type || options.contentType || "application/octet-stream",
                upsert: Boolean(options.upsert)
            });

        if (error) throw error;

        const publicResult = services.client.storage.from(bucket).getPublicUrl(data.path || path);
        return {
            bucket,
            path: data.path || path,
            url: publicResult && publicResult.data ? publicResult.data.publicUrl : "",
            fileName: file.name || fileName,
            contentType: file.type || options.contentType || "",
            size: file.size || 0
        };
    }

    function flushPendingWrites() {
        pendingWrites.forEach((value, key) => {
            saveDataKey(key, value).catch((error) => {
                console.warn(`Could not flush ${key} to Supabase.`, error);
            });
        });
    }

    createLocalContentBackup("startup");

    window.ASG_BACKEND = {
        config: getConfig(),
        provider: "supabase",
        configured: hasUsableConfig(getConfig()),
        ready: loadServices,
        restoreSession,
        signIn,
        requestPasswordReset,
        updatePassword,
        register,
        migrateLocalUser,
        signOut,
        saveDataKey,
        saveUserActivityForUser,
        publishContentSnapshot,
        publishLocalContentBackup,
        getCloudContentStatus,
        createLocalContentBackup,
        getLocalContentBackup: () => readLocalJSON(LOCAL_CONTENT_BACKUP_KEY, null),
        startLearningSync,
        startUsersSync,
        uploadFile,
        getCurrentProfile: () => currentProfile || getStoredSessionUser(),
        isAdminEmail,
        syncKeys: ASG_SYNC_KEYS.slice()
    };
})();
