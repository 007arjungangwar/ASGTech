// ASG Tech shared authentication, navigation, and access control.

const ASG_AUTH = {
    brand: "ASG Tech",
    loginPage: "login.html",
    cacheName: "asg-tech-v10",
    publicPages: [
        "",
        "index.html",
        "login.html",
        "about.html",
        "blog.html",
        "projects.html",
        "exam-login.html"
    ],
    studentPages: [
        "courses.html",
        "resources.html",
        "questions.html",
        "roadmap.html",
        "tracker.html",
        "profile.html",
        "certificate.html",
        "assistant.html",
        "quiz.html",
        "coding-practice.html",
        "exam-center.html",
        "forum.html",
        "videos.html",
        "chat.html",
        "exam.html",
        "coding-exam.html",
        "course-detail.html",
        "topic-detail.html",
        "exam-result.html"
    ],
    adminPages: [
        "admin.html"
    ]
};

function getCurrentPage() {
    return (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
}

function getBasePath() {
    return window.location.pathname.includes("/posts/") ? "../" : "";
}

function asgUrl(page) {
    if (page.startsWith("http")) return page;
    return `${getBasePath()}${page}`;
}

function getCurrentUser() {
    const user = sessionStorage.getItem("currentUser");
    if (!user) return null;

    try {
        return JSON.parse(user);
    } catch (error) {
        sessionStorage.removeItem("currentUser");
        return null;
    }
}

function isLoggedIn() {
    return Boolean(getCurrentUser());
}

function isAdmin() {
    const user = getCurrentUser();
    return Boolean(user && user.role === "admin");
}

function getUserEmail() {
    const user = getCurrentUser();
    return user ? user.email : null;
}

function getUserName() {
    const user = getCurrentUser();
    return user ? user.name : null;
}

function getUserInitials(user = getCurrentUser()) {
    if (!user || !user.name) return "GT";
    return user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
}

function getUserAvatar() {
    const user = getCurrentUser();
    if (!user) return "GT";
    const savedAvatar = localStorage.getItem(`avatar_${user.id}`);
    return savedAvatar || getUserInitials(user);
}

function asgEscapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function logout() {
    const confirmed = confirm("Do you want to sign out of ASG Tech?");
    if (!confirmed) return;

    sessionStorage.removeItem("currentUser");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userEmail");
    window.location.href = asgUrl("index.html");
}

function buildLoginUrl(targetPage) {
    const next = targetPage && targetPage !== "login.html" ? `?next=${encodeURIComponent(targetPage)}` : "";
    return asgUrl(`${ASG_AUTH.loginPage}${next}`);
}

function checkPageAccess() {
    const user = getCurrentUser();
    const page = getCurrentPage();

    if (ASG_AUTH.adminPages.includes(page)) {
        if (!user || user.role !== "admin") {
            sessionStorage.setItem("authNotice", "Admin access is required for that page.");
            window.location.href = buildLoginUrl(page);
            return false;
        }
        return true;
    }

    if (ASG_AUTH.studentPages.includes(page)) {
        if (!user) {
            sessionStorage.setItem("authNotice", "Please sign in or create a free student account to continue.");
            window.location.href = buildLoginUrl(page);
            return false;
        }
        return true;
    }

    return true;
}

function navigationGroups(user) {
    const admin = user && user.role === "admin";

    const studentLink = (label, page) => ({ label, page, student: true });
    const adminLink = (label, page) => ({ label, page, admin: true });

    const groups = [
        {
            title: "Learn",
            items: [
                studentLink("Courses", "courses.html"),
                studentLink("Roadmap", "roadmap.html"),
                studentLink("Videos", "videos.html"),
                studentLink("Resources", "resources.html")
            ]
        },
        {
            title: "Practice",
            items: [
                studentLink("Quiz", "quiz.html"),
                studentLink("Coding Practice", "coding-practice.html"),
                studentLink("Exam", "exam-center.html"),
                studentLink("Progress", "tracker.html"),
                studentLink("Certificate", "certificate.html"),
                studentLink("AI Assistant", "assistant.html")
            ]
        },
        {
            title: "Community",
            items: [
                studentLink("Q&A", "questions.html"),
                studentLink("Forum", "forum.html"),
                studentLink("Live Chat", "chat.html")
            ]
        }
    ];

    if (admin) {
        groups.push({
            title: "Admin",
            items: [
                adminLink("Dashboard", "admin.html")
            ]
        });
    }

    return groups.map((group) => ({
        ...group,
        items: group.title === "Admin"
            ? group.items.filter((item) => item.admin && admin)
            : group.items
    })).filter((group) => group.items.length);
}

function quickActions(user) {
    if (user && user.role === "admin") {
        return [
            { label: "Dashboard", page: "admin.html" },
            { label: "Practice", page: "coding-practice.html" },
            { label: "Exam", page: "exam-center.html" },
            { label: "Ask Doubt", page: "questions.html" }
        ];
    }

    if (user) {
        return [
            { label: "Practice", page: "coding-practice.html" },
            { label: "Exam", page: "exam-center.html" },
            { label: "Ask Doubt", page: "questions.html" }
        ];
    }

    return [
        { label: "Programs", page: "courses.html", locked: true },
        { label: "Register", page: "login.html" },
        { label: "Practice", page: "coding-practice.html", locked: true }
    ];
}

function itemHref(item, user) {
    if (item.public || user) return asgUrl(item.page);
    return buildLoginUrl(item.page);
}

function isActive(page) {
    return getCurrentPage() === page.toLowerCase();
}

function renderTopNavigation(user) {
    const nav = document.querySelector("nav");
    if (!nav) return;

    const loggedIn = Boolean(user);
    const publicTopLinks = [
        { label: "Home", page: "index.html", public: true },
        { label: "Blog", page: "blog.html", public: true },
        { label: "Projects", page: "projects.html", public: true },
        { label: "About", page: "about.html", public: true }
    ];

    nav.className = "asg-navbar";
    nav.innerHTML = `
        <div class="asg-topbar">
            <a href="${asgUrl("index.html")}" class="logo asg-logo" aria-label="ASG Tech home">
                <span class="asg-logo-mark">ASG</span>
                <span class="asg-logo-copy">
                    <strong>ASG Tech</strong>
                    <small>Institute</small>
                </span>
            </a>

            <div class="nav-links asg-top-links" aria-label="Main navigation">
                ${publicTopLinks.map((item) => `
                    <a href="${asgUrl(item.page)}" class="${isActive(item.page) ? "active" : ""}">
                        ${item.label}
                    </a>
                `).join("")}
            </div>

            <div class="asg-auth-area">
                ${loggedIn ? `
                    <div class="user-profile-circle asg-account">
                        <button class="profile-circle" onclick="toggleDropdown()" aria-label="Open profile menu">
                            ${getUserAvatar()}
                        </button>
                        <div class="user-dropdown" id="userDropdown">
                            <div class="dropdown-header">
                                <div class="dropdown-avatar">${getUserAvatar()}</div>
                                <div class="dropdown-name">${asgEscapeHtml(user.name)}</div>
                                <div class="dropdown-email">${asgEscapeHtml(user.email)}</div>
                            </div>
                            <a href="${asgUrl("profile.html")}" class="dropdown-item">My Profile</a>
                            <a href="${asgUrl("tracker.html")}" class="dropdown-item">My Progress</a>
                            <a href="${asgUrl("certificate.html")}" class="dropdown-item">Certificates</a>
                            ${user.role === "admin" ? `<a href="${asgUrl("admin.html")}" class="dropdown-item">Admin Dashboard</a>` : ""}
                            <button class="dropdown-item logout" onclick="logout()">Logout</button>
                        </div>
                    </div>
                ` : `
                    <a class="asg-login-link" href="${asgUrl("login.html")}">Sign in</a>
                    <a class="asg-register-link" href="${asgUrl("login.html?mode=register")}">Register</a>
                `}
            </div>
        </div>
    `;
}

function closeNavGroups(exceptMenuId = "") {
    document.querySelectorAll(".asg-nav-dropdown").forEach((menu) => {
        if (menu.id !== exceptMenuId) menu.classList.remove("show");
    });

    document.querySelectorAll(".asg-nav-button").forEach((button) => {
        if (button.getAttribute("aria-controls") !== exceptMenuId) {
            button.setAttribute("aria-expanded", "false");
        }
    });
}

function toggleNavGroup(menuId, button) {
    const menu = document.getElementById(menuId);
    if (!menu) return;

    const willOpen = !menu.classList.contains("show");
    closeNavGroups(menuId);
    menu.classList.toggle("show", willOpen);
    if (button) button.setAttribute("aria-expanded", String(willOpen));
}

function renderSidebar(user) {
    const body = document.body;
    if (!body) return;

    const existingSidebar = document.querySelector(".asg-sidebar");
    if (existingSidebar) existingSidebar.remove();

    const sidebar = document.createElement("aside");
    sidebar.className = "asg-sidebar";

    const actions = quickActions(user);
    const groups = navigationGroups(user);

    sidebar.innerHTML = `
        <div class="asg-sidebar-title">
            <span>${user ? `Welcome, ${asgEscapeHtml(user.name.split(" ")[0])}` : "Learning Menu"}</span>
            <small>${user ? (user.role === "admin" ? "Admin workspace" : "Student workspace") : "Sign in to unlock tools"}</small>
        </div>

        <div class="asg-quick-actions" aria-label="Primary actions">
            ${actions.map((action, index) => `
                <a href="${itemHref(action, user)}" class="asg-quick-button asg-quick-button-${index + 1}">
                    ${action.label}
                    ${action.locked && !user ? `<span class="asg-lock">Login</span>` : ""}
                </a>
            `).join("")}
        </div>

        <div class="asg-menu-groups">
            ${groups.map((group, index) => {
                const activeGroup = group.items.some((item) => isActive(item.page));
                return `
                <section class="asg-menu-group collapsed">
                    <button
                        class="asg-menu-heading ${activeGroup ? "active" : ""}"
                        type="button"
                        aria-expanded="false"
                        onclick="toggleSidebarGroup(this)"
                    >
                        <span>${group.title}</span>
                        <small>${group.items.length}</small>
                    </button>
                    <div class="asg-menu-items">
                        ${group.items.map((item) => `
                            <a href="${itemHref(item, user)}" class="${isActive(item.page) ? "active" : ""}">
                                <span>${item.label}</span>
                                ${!item.public && !user ? `<span class="asg-lock">Login</span>` : ""}
                            </a>
                        `).join("")}
                    </div>
                </section>
            `;}).join("")}
        </div>
    `;

    const nav = document.querySelector("nav");
    if (nav && nav.nextSibling) {
        nav.parentNode.insertBefore(sidebar, nav.nextSibling);
    } else {
        body.insertBefore(sidebar, body.firstChild);
    }
}

function toggleSidebarGroup(button) {
    const group = button.closest(".asg-menu-group");
    if (!group) return;

    const shouldOpen = group.classList.contains("collapsed");

    document.querySelectorAll(".asg-menu-group").forEach((menuGroup) => {
        menuGroup.classList.add("collapsed");
        const heading = menuGroup.querySelector(".asg-menu-heading");
        if (heading) heading.setAttribute("aria-expanded", "false");
    });

    if (shouldOpen) {
        group.classList.remove("collapsed");
        button.setAttribute("aria-expanded", "true");
    }
}

function createProfileCircle() {
    renderTopNavigation(getCurrentUser());
}

function toggleDropdown() {
    const dropdown = document.getElementById("userDropdown");
    if (dropdown) dropdown.classList.toggle("show");
}

function updateWelcomeMessage(user) {
    const guestMsg = document.getElementById("guestMessage");
    const userMsg = document.getElementById("userMessage");
    const userNameSpan = document.getElementById("userName");

    if (!guestMsg || !userMsg) return;

    if (user) {
        guestMsg.style.display = "none";
        userMsg.style.display = "block";
        if (userNameSpan) userNameSpan.textContent = user.name;
    } else {
        guestMsg.style.display = "block";
        userMsg.style.display = "none";
    }
}

function updateHomeDashboard(user) {
    const guestHome = document.getElementById("guestHome");
    const studentHome = document.getElementById("studentHome");
    const studentName = document.getElementById("studentName");

    if (!guestHome || !studentHome) return;

    if (user) {
        guestHome.hidden = true;
        studentHome.hidden = false;
        if (studentName) studentName.textContent = user.name;
    } else {
        guestHome.hidden = false;
        studentHome.hidden = true;
    }
}

function getStudentAnnouncement() {
    try {
        const notice = JSON.parse(localStorage.getItem("studentAnnouncement") || "null");
        if (!notice || !notice.active) return null;
        if (!notice.title && !notice.body) return null;
        return notice;
    } catch (error) {
        return null;
    }
}

function renderStudentAnnouncement(user) {
    const existing = document.querySelector(".asg-live-notice");
    if (existing) existing.remove();

    if (!user || user.role === "admin" || getCurrentPage() === "login.html") return;

    const notice = getStudentAnnouncement();
    if (!notice) return;

    const main = document.querySelector("main");
    if (!main) return;

    const noticeBox = document.createElement("section");
    noticeBox.className = "asg-live-notice";
    noticeBox.innerHTML = `
        <strong>${asgEscapeHtml(notice.title || "Institute update")}</strong>
        <span>${asgEscapeHtml(notice.body || "")}</span>
    `;
    main.insertBefore(noticeBox, main.firstChild);
}

function showAuthNotice() {
    const notice = sessionStorage.getItem("authNotice");
    if (!notice || getCurrentPage() !== "login.html") return;

    const target = document.querySelector(".auth-container, main");
    if (target && !document.querySelector(".auth-notice")) {
        const noticeBox = document.createElement("div");
        noticeBox.className = "auth-notice";
        noticeBox.textContent = notice;
        target.insertBefore(noticeBox, target.firstChild);
    }

    sessionStorage.removeItem("authNotice");
}

function keepServiceWorkerFresh() {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.getRegistration()
        .then((registration) => {
            if (!registration) return;

            registration.update().catch(() => {});

            if (registration.waiting) {
                registration.waiting.postMessage({ type: "SKIP_WAITING" });
            }

            registration.addEventListener("updatefound", () => {
                const worker = registration.installing;
                if (!worker) return;

                worker.addEventListener("statechange", () => {
                    if (worker.state === "installed" && navigator.serviceWorker.controller) {
                        worker.postMessage({ type: "SKIP_WAITING" });
                    }
                });
            });
        })
        .catch(() => {});

    if ("caches" in window) {
        caches.keys()
            .then((cacheNames) => Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName.startsWith("asg-tech-") && cacheName !== ASG_AUTH.cacheName)
                    .map((cacheName) => caches.delete(cacheName))
            ))
            .catch(() => {});
    }
}

function updateUIForUser() {
    const body = document.body;
    if (!body) return;

    const user = getCurrentUser();
    body.classList.add("has-asg-shell");
    body.dataset.userRole = user ? user.role : "guest";

    renderTopNavigation(user);
    renderSidebar(user);
    updateWelcomeMessage(user);
    updateHomeDashboard(user);
    renderStudentAnnouncement(user);
    showAuthNotice();
}

document.addEventListener("click", function(event) {
    const account = document.querySelector(".asg-account");
    const dropdown = document.getElementById("userDropdown");
    if (account && dropdown && !account.contains(event.target)) {
        dropdown.classList.remove("show");
    }

    const navGroup = event.target.closest ? event.target.closest(".asg-nav-group") : null;
    if (!navGroup) closeNavGroups();
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") closeNavGroups();
});

window.addEventListener("storage", function(event) {
    if (event.key === "studentAnnouncement") {
        renderStudentAnnouncement(getCurrentUser());
    }
});

function initializeASGPortal() {
    if (!checkPageAccess()) return;
    keepServiceWorkerFresh();
    updateUIForUser();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeASGPortal);
} else {
    initializeASGPortal();
}

console.log("ASG Tech auth loaded", getCurrentUser());
