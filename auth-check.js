// ASG Tech shared authentication, navigation, and access control.

const ASG_AUTH = {
    brand: "ASG Tech",
    loginPage: "login.html",
    cacheName: "asg-tech-v67",
    publicPages: [
        "",
        "index.html",
        "login.html",
        "about.html",
        "blog.html",
        "projects.html",
        "exam-login.html",
        "certificate-verify.html"
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
        "admin.html",
        "admin-guide.html"
    ]
};

const ASG_SOCIAL_LINKS = [
    {
        key: "instagram",
        label: "Instagram",
        shortLabel: "IG",
        url: "https://instagram.com/007arjungangwar",
        description: "Visual updates"
    },
    {
        key: "linkedin",
        label: "LinkedIn",
        shortLabel: "in",
        url: "https://linkedin.com/in/arjun-singh-gangwar-54b264280",
        description: "Professional profile"
    },
    {
        key: "medium",
        label: "Medium",
        shortLabel: "M",
        url: "https://medium.com/@007arjungangwar",
        description: "Articles and notes"
    },
    {
        key: "x",
        label: "X",
        shortLabel: "X",
        url: "https://x.com/007arjungangwar",
        description: "Quick updates"
    },
    {
        key: "youtube",
        label: "YouTube",
        shortLabel: "YT",
        url: "https://youtube.com/@Epsilonacademyofficial",
        description: "Video lessons"
    },
    {
        key: "email",
        label: "Email",
        shortLabel: "@",
        url: "mailto:arjungangwariitpkd@gmail.com",
        description: "Direct contact"
    }
];

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

async function logout() {
    const confirmed = confirm("Do you want to sign out of ASG Tech?");
    if (!confirmed) return;

    if (window.ASG_BACKEND && typeof window.ASG_BACKEND.signOut === "function") {
        await window.ASG_BACKEND.signOut();
    }
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
            description: "Courses, roadmap, videos, and resources",
            items: [
                studentLink("Courses", "courses.html"),
                studentLink("Roadmap", "roadmap.html"),
                studentLink("Videos", "videos.html"),
                studentLink("Resources", "resources.html")
            ]
        },
        {
            title: "Practice",
            description: "Quiz, coding, exams, progress, and certificates",
            items: [
                studentLink("Quiz Exam", "quiz.html"),
                studentLink("Coding Practice", "coding-practice.html"),
                studentLink("Exam Center", "exam-center.html"),
                studentLink("Progress", "tracker.html"),
                studentLink("Certificates", "certificate.html"),
                studentLink("AI Tutor", "assistant.html")
            ]
        },
        {
            title: "Community",
            description: "Ask doubts, discuss, and chat live",
            items: [
                studentLink("Ask Doubt", "questions.html"),
                studentLink("Forum", "forum.html"),
                studentLink("Live Chat", "chat.html")
            ]
        }
    ];

    if (admin) {
        groups.push({
            title: "Admin",
            description: "Manage content and students",
            items: [
                adminLink("Dashboard", "admin.html"),
                adminLink("Content Guide", "admin-guide.html")
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

function getWorkspaceItems(user) {
    const publicItems = [
        { label: "Home", page: "index.html", section: "Public", public: true },
        { label: "Blog", page: "blog.html", section: "Public", public: true },
        { label: "Projects", page: "projects.html", section: "Public", public: true },
        { label: "About", page: "about.html", section: "Public", public: true },
        { label: "Verify Certificate", page: "certificate-verify.html", section: "Public", public: true }
    ];

    const workspaceItems = navigationGroups(user).flatMap((group) => (
        group.items.map((item) => ({
            ...item,
            section: group.title,
            sectionPage: group.items[0] ? group.items[0].page : item.page
        }))
    ));

    return [...publicItems, ...workspaceItems];
}

function findWorkspaceItem(page, user = getCurrentUser()) {
    const current = String(page || getCurrentPage()).toLowerCase();
    const direct = getWorkspaceItems(user).find((item) => item.page.toLowerCase() === current);
    if (direct) return direct;

    const fallback = {
        "course-detail.html": { label: "Course Workspace", page: "course-detail.html", section: "Learn", sectionPage: "courses.html" },
        "topic-detail.html": { label: "Lesson Viewer", page: "topic-detail.html", section: "Learn", sectionPage: "courses.html" },
        "coding-exam.html": { label: "Coding Exam", page: "coding-exam.html", section: "Practice", sectionPage: "exam-center.html" },
        "exam.html": { label: "Exam", page: "exam.html", section: "Practice", sectionPage: "exam-center.html" },
        "exam-result.html": { label: "Exam Result", page: "exam-result.html", section: "Practice", sectionPage: "exam-center.html" },
        "profile.html": { label: "Profile", page: "profile.html", section: "Account", sectionPage: "profile.html" },
        "admin.html": { label: "Dashboard", page: "admin.html", section: "Admin", sectionPage: "admin.html" },
        "admin-guide.html": { label: "Content Guide", page: "admin-guide.html", section: "Admin", sectionPage: "admin.html" }
    };

    return fallback[current] || null;
}

function runGlobalSearch(form) {
    const input = form ? form.querySelector("input[name='query']") : null;
    const query = input ? input.value.trim().toLowerCase() : "";
    if (!query) {
        if (input) input.focus();
        return;
    }

    const items = getWorkspaceItems(getCurrentUser());
    const match = items.find((item) => (
        item.label.toLowerCase() === query ||
        item.page.toLowerCase() === query ||
        `${item.section} ${item.label}`.toLowerCase().includes(query)
    )) || items.find((item) => item.label.toLowerCase().includes(query));

    if (match) {
        window.location.href = itemHref(match, getCurrentUser());
        return;
    }

    const smartRoutes = [
        { keywords: ["quiz", "test", "mcq"], page: "quiz.html" },
        { keywords: ["coding", "practice", "python"], page: "coding-practice.html" },
        { keywords: ["exam"], page: "exam-center.html" },
        { keywords: ["course", "lesson", "content", "pdf"], page: "courses.html" },
        { keywords: ["roadmap"], page: "roadmap.html" },
        { keywords: ["video"], page: "videos.html" },
        { keywords: ["certificate"], page: "certificate.html" },
        { keywords: ["doubt", "question", "qa"], page: "questions.html" },
        { keywords: ["chat"], page: "chat.html" }
    ];
    const route = smartRoutes.find((item) => item.keywords.some((keyword) => query.includes(keyword)));
    window.location.href = route ? asgUrl(route.page) : asgUrl("courses.html");
}

function applyThemePreference() {
    const theme = localStorage.getItem("asgTheme") || "light";
    document.body.classList.toggle("asg-theme-dark", theme === "dark");
    document.body.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    let themeMeta = document.querySelector("meta[name='theme-color']");
    if (!themeMeta) {
        themeMeta = document.createElement("meta");
        themeMeta.name = "theme-color";
        document.head.appendChild(themeMeta);
    }
    themeMeta.content = theme === "dark" ? "#0b1020" : "#f5edda";

    let schemeMeta = document.querySelector("meta[name='color-scheme']");
    if (!schemeMeta) {
        schemeMeta = document.createElement("meta");
        schemeMeta.name = "color-scheme";
        document.head.appendChild(schemeMeta);
    }
    schemeMeta.content = "light dark";
}

function toggleThemeMode() {
    const nextTheme = document.body.classList.contains("asg-theme-dark") ? "light" : "dark";
    localStorage.setItem("asgTheme", nextTheme);
    applyThemePreference();
}

function applySidebarPreference() {
    const saved = localStorage.getItem("asgSidebarCollapsed");
    const collapsed = saved === null && window.innerWidth <= 820
        ? true
        : saved === "true";
    document.body.classList.toggle("asg-sidebar-collapsed", collapsed);
}

function toggleSidebarCollapsed() {
    const collapsed = !document.body.classList.contains("asg-sidebar-collapsed");
    localStorage.setItem("asgSidebarCollapsed", String(collapsed));
    applySidebarPreference();
}

function toggleNotifications() {
    const panel = document.getElementById("asgNotificationPanel");
    if (!panel) return;
    panel.classList.toggle("show");
}

function renderBreadcrumbs(user) {
    const main = document.querySelector("main");
    if (!main) return;

    const existing = main.querySelector(".asg-breadcrumbs");
    if (existing) existing.remove();

    const page = getCurrentPage();
    if (["index.html", "login.html"].includes(page)) return;

    const item = findWorkspaceItem(page, user);
    if (!item) return;

    const sectionLink = item.sectionPage && item.section !== "Public"
        ? `<a href="${asgUrl(item.sectionPage)}">${asgEscapeHtml(item.section)}</a>`
        : `<span>${asgEscapeHtml(item.section)}</span>`;

    const breadcrumbs = document.createElement("nav");
    breadcrumbs.className = "asg-breadcrumbs";
    breadcrumbs.setAttribute("aria-label", "Breadcrumb");
    breadcrumbs.innerHTML = `
        <a href="${asgUrl("index.html")}">Home</a>
        <span>/</span>
        ${sectionLink}
        <span>/</span>
        <strong>${asgEscapeHtml(item.label)}</strong>
    `;
    main.insertBefore(breadcrumbs, main.firstChild);
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
        { label: "About", page: "about.html", public: true },
        { label: "Verify Certificate", page: "certificate-verify.html", public: true }
    ];
    const searchItems = getWorkspaceItems(user);
    const notice = loggedIn ? getStudentAnnouncement() : null;
    const hasNotice = Boolean(notice && user.role !== "admin");

    nav.className = "asg-navbar";
    nav.innerHTML = `
        <div class="asg-topbar">
            <div class="asg-topbar-left">
                <button class="asg-shell-toggle" type="button" onclick="toggleSidebarCollapsed()" aria-label="Toggle workspace menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <a href="${asgUrl("index.html")}" class="logo asg-logo" aria-label="ASG Tech home">
                    <span class="asg-logo-mark"><span>ASG</span></span>
                    <span class="asg-logo-copy">
                        <strong>ASG Tech</strong>
                        <small>Institute</small>
                    </span>
                </a>
            </div>

            <form class="asg-global-search" role="search" onsubmit="event.preventDefault(); runGlobalSearch(this);">
                <input name="query" type="search" list="asgSearchOptions" placeholder="Search courses, exams, doubts..." autocomplete="off">
                <datalist id="asgSearchOptions">
                    ${searchItems.map((item) => `<option value="${asgEscapeHtml(item.label)}">${asgEscapeHtml(item.section)}</option>`).join("")}
                </datalist>
                <button class="asg-search-submit" type="submit" aria-label="Search site">
                    <span aria-hidden="true"></span>
                    <strong>Search</strong>
                </button>
            </form>

            <div class="asg-topbar-right">
                <div class="nav-links asg-top-links" aria-label="Main navigation">
                    ${publicTopLinks.map((item) => `
                        <a href="${asgUrl(item.page)}" class="${isActive(item.page) ? "active" : ""}">
                            ${item.label}
                        </a>
                    `).join("")}
                </div>

                <div class="asg-utility-bar">
                    <div class="asg-notification-wrap">
                        <button class="asg-icon-button ${hasNotice ? "has-alert" : ""}" type="button" onclick="toggleNotifications()" aria-label="Open notifications">
                            <span>Alerts</span>
                        </button>
                        <div class="asg-notification-panel" id="asgNotificationPanel">
                            <strong>${hasNotice ? asgEscapeHtml(notice.title || "Institute update") : "No new alerts"}</strong>
                            <p>${hasNotice ? asgEscapeHtml(notice.body || "") : "You are all caught up."}</p>
                        </div>
                    </div>
                    <button class="asg-icon-button" type="button" onclick="toggleThemeMode()" aria-label="Toggle dark or light theme">
                        <span>Theme</span>
                    </button>
                </div>
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

    const groups = navigationGroups(user);
    const hasActiveGroup = groups.some((group) => group.items.some((item) => isActive(item.page)));

    sidebar.innerHTML = `
        <div class="asg-sidebar-title">
            <span>${user ? `Welcome, ${asgEscapeHtml(user.name.split(" ")[0])}` : "Learning Menu"}</span>
            <small>${user ? (user.role === "admin" ? "Admin workspace" : "Student workspace") : "Sign in to unlock tools"}</small>
        </div>

        <div class="asg-menu-groups" aria-label="Student workspace menu">
            ${groups.map((group, index) => {
                const activeGroup = group.items.some((item) => isActive(item.page));
                const groupOpen = activeGroup || (!hasActiveGroup && index === 0);
                return `
                <section class="asg-menu-group ${groupOpen ? "" : "collapsed"}">
                    <button
                        class="asg-menu-heading ${activeGroup ? "active" : ""}"
                        type="button"
                        aria-expanded="${String(groupOpen)}"
                        onclick="toggleSidebarGroup(this)"
                    >
                        <span>
                            <strong>${group.title}</strong>
                            <em>${group.description}</em>
                        </span>
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
    const breadcrumbs = main.querySelector(".asg-breadcrumbs");
    if (breadcrumbs && breadcrumbs.nextSibling) {
        main.insertBefore(noticeBox, breadcrumbs.nextSibling);
    } else {
        main.insertBefore(noticeBox, main.firstChild);
    }
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

function renderSocialLinkMarkup(mode = "compact") {
    return ASG_SOCIAL_LINKS.map((item) => {
        const external = !item.url.startsWith("mailto:");
        const externalAttrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
        const text = mode === "detailed"
            ? `<span><strong>${asgEscapeHtml(item.label)}</strong><small>${asgEscapeHtml(item.description)}</small></span>`
            : `<span>${asgEscapeHtml(item.label)}</span>`;

        return `
            <a class="asg-social-link asg-social-${asgEscapeHtml(item.key)} ${mode === "detailed" ? "detailed" : ""}"
               href="${asgEscapeHtml(item.url)}"${externalAttrs}
               aria-label="${asgEscapeHtml(`${item.label} - ${item.description}`)}">
                <span class="asg-social-mark" aria-hidden="true">${asgEscapeHtml(item.shortLabel)}</span>
                ${text}
            </a>
        `;
    }).join("");
}

function renderSiteFooter() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    footer.classList.add("asg-site-footer");
    footer.innerHTML = `
        <div class="asg-footer-main">
            <div class="asg-footer-brand">
                <a href="${asgUrl("index.html")}" class="asg-footer-logo" aria-label="ASG Tech home">
                    <span class="asg-logo-mark"><span>ASG</span></span>
                    <span>
                        <strong>ASG Tech Institute</strong>
                        <small>Practical technology learning for students.</small>
                    </span>
                </a>
                <p>
                    Follow Arjun Singh Gangwar for learning updates, coding demos, articles, video lessons,
                    and direct contact.
                </p>
            </div>

            <nav class="asg-footer-connect" aria-label="Arjun Singh Gangwar social links">
                <span>Connect with Arjun</span>
                <div class="asg-social-links">
                    ${renderSocialLinkMarkup()}
                </div>
            </nav>
        </div>

        <div class="asg-footer-bottom">
            <span>&copy; 2026 ASG Tech Institute.</span>
            <a href="mailto:arjungangwariitpkd@gmail.com">arjungangwariitpkd@gmail.com</a>
        </div>
    `;
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
    applyThemePreference();
    applySidebarPreference();

    renderTopNavigation(user);
    renderSidebar(user);
    renderBreadcrumbs(user);
    updateWelcomeMessage(user);
    updateHomeDashboard(user);
    renderStudentAnnouncement(user);
    showAuthNotice();
    renderSiteFooter();
}

document.addEventListener("click", function(event) {
    const account = document.querySelector(".asg-account");
    const dropdown = document.getElementById("userDropdown");
    if (account && dropdown && !account.contains(event.target)) {
        dropdown.classList.remove("show");
    }

    const navGroup = event.target.closest ? event.target.closest(".asg-nav-group") : null;
    if (!navGroup) closeNavGroups();

    const notificationWrap = event.target.closest ? event.target.closest(".asg-notification-wrap") : null;
    if (!notificationWrap) {
        const panel = document.getElementById("asgNotificationPanel");
        if (panel) panel.classList.remove("show");
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeNavGroups();
        const panel = document.getElementById("asgNotificationPanel");
        if (panel) panel.classList.remove("show");
    }
});

window.addEventListener("storage", function(event) {
    if (event.key === "studentAnnouncement") {
        renderStudentAnnouncement(getCurrentUser());
    }
});

async function initializeASGPortal() {
    const page = getCurrentPage();
    const hasCachedUser = Boolean(getCurrentUser());
    const isPublicPage = ASG_AUTH.publicPages.includes(page);

    if (isPublicPage || hasCachedUser) {
        keepServiceWorkerFresh();
        updateUIForUser();
    }

    if (window.ASG_BACKEND && typeof window.ASG_BACKEND.restoreSession === "function") {
        await window.ASG_BACKEND.restoreSession();
    }
    if (!checkPageAccess()) return;
    if (window.ASG_BACKEND && typeof window.ASG_BACKEND.startLearningSync === "function") {
        window.ASG_BACKEND.startLearningSync();
    }
    if (window.ASG_BACKEND && typeof window.ASG_BACKEND.startUsersSync === "function") {
        window.ASG_BACKEND.startUsersSync();
    }
    keepServiceWorkerFresh();
    updateUIForUser();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeASGPortal);
} else {
    initializeASGPortal();
}
