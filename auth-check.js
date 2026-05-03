// ASG Tech shared authentication, navigation, and access control.

const ASG_AUTH = {
    brand: "ASG Tech",
    loginPage: "login.html",
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
        "forum.html",
        "videos.html",
        "chat.html",
        "exam.html",
        "exam-result.html"
    ],
    adminPages: [
        "admin.html",
        "exam-admin.html"
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
    const loggedIn = Boolean(user);
    const admin = user && user.role === "admin";

    const publicLink = (label, page) => ({ label, page, public: true });
    const studentLink = (label, page) => ({ label, page, student: true });
    const adminLink = (label, page) => ({ label, page, admin: true });

    const groups = [
        {
            title: "Institute",
            items: [
                publicLink("Home", "index.html"),
                publicLink("Blog", "blog.html"),
                publicLink("Projects", "projects.html"),
                publicLink("About", "about.html")
            ]
        },
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
                studentLink("Live Chat", "chat.html"),
                studentLink("Profile", "profile.html")
            ]
        }
    ];

    if (admin) {
        groups.push({
            title: "Admin",
            items: [
                adminLink("Dashboard", "admin.html"),
                adminLink("Exam Admin", "exam-admin.html")
            ]
        });
    }

    return groups.map((group) => ({
        ...group,
        items: group.items.filter((item) => item.public || loggedIn || admin)
    })).filter((group) => group.items.length);
}

function quickActions(user) {
    if (user && user.role === "admin") {
        return [
            { label: "Dashboard", page: "admin.html" },
            { label: "Exam Admin", page: "exam-admin.html" },
            { label: "Student View", page: "roadmap.html" }
        ];
    }

    if (user) {
        return [
            { label: "Continue", page: "roadmap.html" },
            { label: "Progress", page: "tracker.html" },
            { label: "Ask Doubt", page: "questions.html" }
        ];
    }

    return [
        { label: "Programs", page: "courses.html", locked: true },
        { label: "Register", page: "login.html" },
        { label: "Projects", page: "projects.html", public: true }
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
    const visibleTopLinks = loggedIn
        ? [
            { label: "Courses", page: "courses.html" },
            { label: "Roadmap", page: "roadmap.html" },
            { label: "Progress", page: "tracker.html" },
            { label: "Community", page: "forum.html" }
        ]
        : [
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

            <div class="nav-links asg-top-links">
                ${visibleTopLinks.map((item) => `
                    <a href="${itemHref(item, user)}" class="${isActive(item.page) ? "active" : ""}">
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
                                <div class="dropdown-name">${user.name}</div>
                                <div class="dropdown-email">${user.email}</div>
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
            <span>${user ? `Welcome, ${user.name.split(" ")[0]}` : "Student Portal"}</span>
            <small>${user ? (user.role === "admin" ? "Admin workspace" : "Learning workspace") : "Public preview"}</small>
        </div>

        <div class="asg-quick-actions" aria-label="Primary actions">
            ${actions.map((action) => `
                <a href="${itemHref(action, user)}" class="asg-quick-button">
                    ${action.label}
                    ${action.locked && !user ? `<span class="asg-lock">Login</span>` : ""}
                </a>
            `).join("")}
        </div>

        <div class="asg-menu-groups">
            ${groups.map((group) => `
                <section class="asg-menu-group">
                    <h2>${group.title}</h2>
                    ${group.items.map((item) => `
                        <a href="${itemHref(item, user)}" class="${isActive(item.page) ? "active" : ""}">
                            <span>${item.label}</span>
                            ${!item.public && !user ? `<span class="asg-lock">Login</span>` : ""}
                        </a>
                    `).join("")}
                </section>
            `).join("")}
        </div>
    `;

    const nav = document.querySelector("nav");
    if (nav && nav.nextSibling) {
        nav.parentNode.insertBefore(sidebar, nav.nextSibling);
    } else {
        body.insertBefore(sidebar, body.firstChild);
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
    showAuthNotice();
}

document.addEventListener("click", function(event) {
    const account = document.querySelector(".asg-account");
    const dropdown = document.getElementById("userDropdown");
    if (account && dropdown && !account.contains(event.target)) {
        dropdown.classList.remove("show");
    }
});

function initializeASGPortal() {
    if (!checkPageAccess()) return;
    updateUIForUser();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeASGPortal);
} else {
    initializeASGPortal();
}

console.log("ASG Tech auth loaded", getCurrentUser());
