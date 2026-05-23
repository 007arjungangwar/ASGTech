// ASG Tech Firebase backend bridge.
(function() {
    "use strict";

    const ASG_FIREBASE_CONFIG = {
        apiKey: "AIzaSyASs9bBLqrh6TH0WvWkVULtosnVUajXyqY",
        authDomain: "arjun-gangwar.firebaseapp.com",
        projectId: "arjun-gangwar",
        storageBucket: "arjun-gangwar.firebasestorage.app",
        messagingSenderId: "330381169934",
        appId: "1:330381169934:web:e62fc33b6ae2df52b7335f",
        measurementId: "G-5483QSP0VB"
    };

    const ASG_FIREBASE_SDK_VERSION = "12.7.0";
    const ASG_FIREBASE_ADMIN_EMAILS = ["arjungangwariitpkd@gmail.com"];

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
        "certificates",
        "asgCertificateRequests",
        "studentQuestions"
    ];

    const ASG_ADMIN_KEYS = [
        "asgExamRetakePermissions",
        "asgCertificatePermissions"
    ];

    const ASG_SYNC_KEYS = [...ASG_CONTENT_KEYS, ...ASG_ACTIVITY_KEYS, ...ASG_ADMIN_KEYS];
    const ASG_SYNC_KEY_SET = new Set(ASG_SYNC_KEYS);
    const ASG_CONTENT_KEY_SET = new Set(ASG_CONTENT_KEYS);
    const ASG_ACTIVITY_KEY_SET = new Set(ASG_ACTIVITY_KEYS);
    const ASG_ADMIN_KEY_SET = new Set(ASG_ADMIN_KEYS);

    let servicesPromise = null;
    let authReadyPromise = null;
    let currentFirebaseUser = null;
    let currentProfile = null;
    let learningSyncStarted = false;
    let userSyncStarted = false;
    const unsubscribeFns = [];
    const pendingWrites = new Map();
    const missingRemoteKeys = new Set();
    const LOCAL_CONTENT_BACKUP_KEY = "asgCloudMigrationBackup";

    function firebaseModule(serviceName) {
        return `https://www.gstatic.com/firebasejs/${ASG_FIREBASE_SDK_VERSION}/firebase-${serviceName}.js`;
    }

    function dispatchBackendStatus(status, detail = {}) {
        window.dispatchEvent(new CustomEvent("asg:backend-status", {
            detail: { status, ...detail }
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

    function writeLocalJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent(new CustomEvent("asg:data-updated", { detail: { key, value, source: "firebase" } }));
    }

    function getStoredSessionUser() {
        return parseJSON(sessionStorage.getItem("currentUser"), null);
    }

    function normalizeEmail(email) {
        return String(email || "").trim().toLowerCase();
    }

    function isAdminEmail(email) {
        return ASG_FIREBASE_ADMIN_EMAILS.includes(normalizeEmail(email));
    }

    function isProfileAdmin(profile) {
        return Boolean(profile && (profile.role === "admin" || isAdminEmail(profile.email)));
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
            joinDate: profile.joinDate
        });
        localStorage.setItem("users", JSON.stringify(nextUsers));
        window.dispatchEvent(new CustomEvent("asg:data-updated", {
            detail: { key: "users", value: nextUsers, source: "firebase" }
        }));
    }

    async function loadServices() {
        if (servicesPromise) return servicesPromise;

        servicesPromise = Promise.all([
            import(firebaseModule("app")),
            import(firebaseModule("auth")),
            import(firebaseModule("firestore"))
        ]).then(async ([appMod, authMod, firestoreMod]) => {
            const app = appMod.getApps().length
                ? appMod.getApp()
                : appMod.initializeApp(ASG_FIREBASE_CONFIG);
            const auth = authMod.getAuth(app);
            await authMod.setPersistence(auth, authMod.browserLocalPersistence).catch(() => undefined);
            return {
                app,
                auth,
                db: firestoreMod.getFirestore(app),
                appMod,
                authMod,
                firestoreMod
            };
        }).catch((error) => {
            console.warn("Firebase backend could not initialize.", error);
            dispatchBackendStatus("offline", { error: error.message || String(error) });
            throw error;
        });

        return servicesPromise;
    }

    async function profileFromFirebaseUser(firebaseUser, initialData = {}) {
        const services = await loadServices();
        const { db, firestoreMod } = services;
        const profileRef = firestoreMod.doc(db, "users", firebaseUser.uid);
        let existing = initialData || {};

        if (!Object.keys(existing).length) {
            const snapshot = await firestoreMod.getDoc(profileRef).catch(() => null);
            existing = snapshot && snapshot.exists() ? snapshot.data() : {};
        }

        const email = normalizeEmail(firebaseUser.email || existing.email);
        const role = existing.role === "admin" || isAdminEmail(email) ? "admin" : "student";
        const profile = {
            id: firebaseUser.uid,
            name: String(existing.name || firebaseUser.displayName || localNameFromEmail(email)).trim(),
            email,
            role,
            joinDate: toIsoDate(existing.joinDate) || new Date().toISOString(),
            provider: "firebase"
        };

        await firestoreMod.setDoc(profileRef, {
            ...profile,
            updatedAt: firestoreMod.serverTimestamp()
        }, { merge: true }).catch((error) => {
            console.warn("Could not update Firebase user profile.", error);
        });

        currentProfile = profile;
        sessionStorage.setItem("currentUser", JSON.stringify(profile));
        cacheProfileLocally(profile);
        return profile;
    }

    async function applyFirebaseUser(firebaseUser) {
        currentFirebaseUser = firebaseUser || null;
        if (!firebaseUser) {
            currentProfile = null;
            return null;
        }
        return profileFromFirebaseUser(firebaseUser);
    }

    async function restoreSession() {
        if (authReadyPromise) return authReadyPromise;

        authReadyPromise = loadServices().then((services) => new Promise((resolve) => {
            let unsubscribe = () => undefined;
            unsubscribe = services.authMod.onAuthStateChanged(services.auth, async (firebaseUser) => {
                unsubscribe();
                try {
                    const profile = await applyFirebaseUser(firebaseUser);
                    dispatchBackendStatus(profile ? "signed-in" : "signed-out", { profile });
                    resolve(profile);
                } catch (error) {
                    console.warn("Firebase session restore failed.", error);
                    dispatchBackendStatus("offline", { error: error.message || String(error) });
                    resolve(getStoredSessionUser());
                }
            }, (error) => {
                console.warn("Firebase auth listener failed.", error);
                dispatchBackendStatus("offline", { error: error.message || String(error) });
                resolve(getStoredSessionUser());
            });
        })).catch(() => getStoredSessionUser());

        return authReadyPromise;
    }

    async function signIn(email, password) {
        const services = await loadServices();
        const credential = await services.authMod.signInWithEmailAndPassword(
            services.auth,
            normalizeEmail(email),
            password
        );
        authReadyPromise = Promise.resolve(profileFromFirebaseUser(credential.user));
        return authReadyPromise;
    }

    async function register(account) {
        const services = await loadServices();
        const email = normalizeEmail(account.email);
        const credential = await services.authMod.createUserWithEmailAndPassword(
            services.auth,
            email,
            account.password
        );

        await services.authMod.updateProfile(credential.user, {
            displayName: String(account.name || localNameFromEmail(email)).trim()
        }).catch(() => undefined);

        const profile = {
            name: String(account.name || localNameFromEmail(email)).trim(),
            email,
            role: isAdminEmail(email) ? "admin" : "student",
            joinDate: new Date().toISOString()
        };

        authReadyPromise = Promise.resolve(profileFromFirebaseUser(credential.user, profile));
        return authReadyPromise;
    }

    async function migrateLocalUser(localUser, password) {
        if (!localUser || !localUser.email || !password) return null;
        const services = await loadServices();
        const email = normalizeEmail(localUser.email);
        const credential = await services.authMod.createUserWithEmailAndPassword(
            services.auth,
            email,
            password
        );
        await services.authMod.updateProfile(credential.user, {
            displayName: String(localUser.name || localNameFromEmail(email)).trim()
        }).catch(() => undefined);

        const profile = {
            name: String(localUser.name || localNameFromEmail(email)).trim(),
            email,
            role: isAdminEmail(email) ? "admin" : "student",
            joinDate: localUser.joinDate || new Date().toISOString()
        };
        authReadyPromise = Promise.resolve(profileFromFirebaseUser(credential.user, profile));
        return authReadyPromise;
    }

    async function signOut() {
        const services = await loadServices().catch(() => null);
        if (services) {
            await services.authMod.signOut(services.auth).catch(() => undefined);
        }
        currentFirebaseUser = null;
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
        if (key === "asgCourseProgress" && value && typeof value === "object") {
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
        if (key === "asgCourseProgress") {
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
        const { db, firestoreMod } = services;
        const cleanedValue = filterActivityForProfile(key, value, profile);
        const docRef = firestoreMod.doc(db, "users", profile.id, "activity", key);

        await firestoreMod.setDoc(docRef, {
            key,
            value: cleanedValue,
            updatedAt: firestoreMod.serverTimestamp(),
            updatedBy: {
                uid: profile.id || "",
                name: profile.name || "",
                email: profile.email || "",
                role: profile.role || ""
            }
        }, { merge: true });

        pendingWrites.delete(key);
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
        const { db, firestoreMod } = services;
        const docRef = firestoreMod.doc(db, "siteData", key);
        const cleanedValue = cleanClone(value);

        await firestoreMod.setDoc(docRef, {
            key,
            value: cleanedValue,
            updatedAt: firestoreMod.serverTimestamp(),
            updatedBy: {
                uid: profile.id || (currentFirebaseUser && currentFirebaseUser.uid) || "",
                name: profile.name || "",
                email: profile.email || "",
                role: profile.role || ""
            }
        }, { merge: true });

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
                console.warn(`Could not seed ${key} to Firebase.`, error);
            });
        });
    }

    async function startLearningSync() {
        if (learningSyncStarted) return;
        learningSyncStarted = true;

        const services = await loadServices().catch(() => null);
        if (!services) return;

        const { db, firestoreMod } = services;
        const profile = currentProfile || await restoreSession();
        const keysToSync = profile ? [...ASG_CONTENT_KEYS, ...ASG_ADMIN_KEYS] : ASG_CONTENT_KEYS;

        keysToSync.forEach((key) => {
            const docRef = firestoreMod.doc(db, "siteData", key);
            const unsubscribe = firestoreMod.onSnapshot(docRef, (snapshot) => {
                if (!snapshot.exists()) {
                    missingRemoteKeys.add(key);
                    seedMissingRemoteData();
                    return;
                }

                missingRemoteKeys.delete(key);
                const data = snapshot.data() || {};
                if (!Object.prototype.hasOwnProperty.call(data, "value")) return;
                writeLocalJSON(key, data.value);
                window.dispatchEvent(new CustomEvent("asg:backend-data-updated", {
                    detail: {
                        key,
                        value: data.value,
                        updatedAt: toIsoDate(data.updatedAt),
                        updatedBy: data.updatedBy || null
                    }
                }));
            }, (error) => {
                console.warn(`Firebase sync failed for ${key}.`, error);
                dispatchBackendStatus("sync-error", { key, error: error.message || String(error) });
            });
            unsubscribeFns.push(unsubscribe);
        });

        if (profile) {
            startActivitySync(profile, services);
        }

        dispatchBackendStatus("listening");
        flushPendingWrites();
    }

    function startActivitySync(profile, services) {
        const { db, firestoreMod } = services;

        if (isProfileAdmin(profile)) {
            const activityRef = firestoreMod.collectionGroup(db, "activity");
            const unsubscribe = firestoreMod.onSnapshot(activityRef, (snapshot) => {
                const aggregated = new Map();

                snapshot.docs.forEach((docSnapshot) => {
                    const key = docSnapshot.id;
                    if (!ASG_ACTIVITY_KEY_SET.has(key)) return;
                    const data = docSnapshot.data() || {};
                    if (!Object.prototype.hasOwnProperty.call(data, "value")) return;
                    const currentValue = aggregated.has(key) ? aggregated.get(key) : undefined;
                    aggregated.set(key, mergeActivityValue(key, currentValue, data.value));
                });

                ASG_ACTIVITY_KEYS.forEach((key) => {
                    if (!aggregated.has(key)) return;
                    writeLocalJSON(key, aggregated.get(key));
                    window.dispatchEvent(new CustomEvent("asg:backend-data-updated", {
                        detail: { key, value: aggregated.get(key), source: "firebase-activity" }
                    }));
                });
            }, (error) => {
                console.warn("Firebase activity sync failed.", error);
                dispatchBackendStatus("sync-error", { key: "activity", error: error.message || String(error) });
            });
            unsubscribeFns.push(unsubscribe);
            return;
        }

        ASG_ACTIVITY_KEYS.forEach((key) => {
            const docRef = firestoreMod.doc(db, "users", profile.id, "activity", key);
            const unsubscribe = firestoreMod.onSnapshot(docRef, (snapshot) => {
                if (!snapshot.exists()) {
                    const rawValue = localStorage.getItem(key);
                    if (rawValue !== null) {
                        const localValue = parseJSON(rawValue, null);
                        if (localValue !== null) {
                            saveUserActivityKey(key, localValue, profile).catch((error) => {
                                console.warn(`Could not seed user ${key} to Firebase.`, error);
                            });
                        }
                    }
                    return;
                }

                const data = snapshot.data() || {};
                if (!Object.prototype.hasOwnProperty.call(data, "value")) return;
                const value = filterActivityForProfile(key, data.value, profile);
                writeLocalJSON(key, value);
                window.dispatchEvent(new CustomEvent("asg:backend-data-updated", {
                    detail: { key, value, source: "firebase-activity" }
                }));
            }, (error) => {
                console.warn(`Firebase user activity sync failed for ${key}.`, error);
            });
            unsubscribeFns.push(unsubscribe);
        });
    }

    async function startUsersSync() {
        if (userSyncStarted) return;

        const profile = currentProfile || await restoreSession();
        if (!profile) return;
        if (!isProfileAdmin(profile)) return;
        userSyncStarted = true;

        const services = await loadServices().catch(() => null);
        if (!services) return;

        const { db, firestoreMod } = services;
        const usersRef = firestoreMod.collection(db, "users");
        const unsubscribe = firestoreMod.onSnapshot(usersRef, (snapshot) => {
            const users = snapshot.docs.map((docSnapshot) => {
                const data = docSnapshot.data() || {};
                return {
                    id: docSnapshot.id,
                    name: String(data.name || localNameFromEmail(data.email)).trim(),
                    email: normalizeEmail(data.email),
                    role: data.role === "admin" ? "admin" : "student",
                    joinDate: toIsoDate(data.joinDate) || "",
                    lastSeenAt: toIsoDate(data.updatedAt) || ""
                };
            }).filter((user) => user.email);

            localStorage.setItem("users", JSON.stringify(users));
            window.dispatchEvent(new CustomEvent("asg:data-updated", {
                detail: { key: "users", value: users, source: "firebase" }
            }));
        }, (error) => {
            console.warn("Firebase user sync failed.", error);
        });
        unsubscribeFns.push(unsubscribe);
    }

    function flushPendingWrites() {
        pendingWrites.forEach((value, key) => {
            saveDataKey(key, value).catch((error) => {
                console.warn(`Could not flush ${key} to Firebase.`, error);
            });
        });
    }

    createLocalContentBackup("startup");

    window.ASG_BACKEND = {
        config: ASG_FIREBASE_CONFIG,
        ready: loadServices,
        restoreSession,
        signIn,
        register,
        migrateLocalUser,
        signOut,
        saveDataKey,
        publishContentSnapshot,
        publishLocalContentBackup,
        createLocalContentBackup,
        getLocalContentBackup: () => readLocalJSON(LOCAL_CONTENT_BACKUP_KEY, null),
        startLearningSync,
        startUsersSync,
        getCurrentProfile: () => currentProfile || getStoredSessionUser(),
        isAdminEmail,
        syncKeys: ASG_SYNC_KEYS.slice()
    };
})();
