// ASG Tech shared learning data for quizzes, coding practice, and admin reports.

const ASG_LEARNING_KEYS = {
    quizQuestions: "asgQuizQuestions",
    quizAttempts: "asgQuizAttempts",
    codingChallenges: "asgCodingChallenges",
    codingSubmissions: "asgCodingSubmissions",
    studentAnnouncement: "studentAnnouncement"
};

const ASG_DEFAULT_QUIZ_QUESTIONS = [
    {
        id: "quiz_python_import",
        title: "Python imports",
        topic: "Python",
        difficulty: "Beginner",
        prompt: "What is the professional shortcut commonly used to import Pandas?",
        options: [
            { id: "a", text: "import pandas" },
            { id: "b", text: "import pandas as pd" },
            { id: "c", text: "include pandas" },
            { id: "d", text: "using pandas" }
        ],
        correctOption: "b",
        explanation: "Most Python data projects import Pandas with the pd alias.",
        status: "active",
        order: 1
    },
    {
        id: "quiz_classification_model",
        title: "Classification",
        topic: "Machine Learning",
        difficulty: "Beginner",
        prompt: "Which model family is commonly used for classification problems?",
        options: [
            { id: "a", text: "Linear Regression" },
            { id: "b", text: "Random Forest" },
            { id: "c", text: "K-Means Clustering" },
            { id: "d", text: "Moving Average" }
        ],
        correctOption: "b",
        explanation: "Random Forest can be used for classification and regression tasks.",
        status: "active",
        order: 2
    },
    {
        id: "quiz_cnn_name",
        title: "Deep learning basics",
        topic: "Deep Learning",
        difficulty: "Intermediate",
        prompt: "What does CNN stand for in deep learning?",
        options: [
            { id: "a", text: "Convolutional Neural Network" },
            { id: "b", text: "Computer Neural Network" },
            { id: "c", text: "Complex Numeric Network" },
            { id: "d", text: "Central Network Node" }
        ],
        correctOption: "a",
        explanation: "A CNN is a Convolutional Neural Network, often used for image tasks.",
        status: "active",
        order: 3
    },
    {
        id: "quiz_visualization_library",
        title: "Visualization",
        topic: "Data Science",
        difficulty: "Beginner",
        prompt: "Which Python library is widely used for plotting charts?",
        options: [
            { id: "a", text: "NumPy" },
            { id: "b", text: "Scikit-learn" },
            { id: "c", text: "Matplotlib" },
            { id: "d", text: "Requests" }
        ],
        correctOption: "c",
        explanation: "Matplotlib is a core Python library for plotting and visualization.",
        status: "active",
        order: 4
    },
    {
        id: "quiz_overfitting",
        title: "Model quality",
        topic: "Machine Learning",
        difficulty: "Intermediate",
        prompt: "What does overfitting usually mean?",
        options: [
            { id: "a", text: "The model performs well on training data but poorly on new data." },
            { id: "b", text: "The model performs poorly on every dataset." },
            { id: "c", text: "The model is too small to learn patterns." },
            { id: "d", text: "The model has no features." }
        ],
        correctOption: "a",
        explanation: "Overfitting means the model memorized training data and generalizes poorly.",
        status: "active",
        order: 5
    }
];

const ASG_DEFAULT_CODING_CHALLENGES = [
    {
        id: "practice_sum_two",
        title: "Sum of Two Numbers",
        difficulty: "Beginner",
        topic: "Python Basics",
        prompt: "Create a function named solution that returns the sum of two numbers.",
        starterCode: "def solution(a, b):\n    # return the sum of a and b\n    pass\n",
        tests: [
            { args: [3, 5], expected: 8 },
            { args: [10, 20], expected: 30 },
            { args: [-5, 7], expected: 2 }
        ],
        status: "active",
        order: 1
    },
    {
        id: "practice_even_odd",
        title: "Even or Odd",
        difficulty: "Beginner",
        topic: "Conditionals",
        prompt: "Create a function named solution that returns 'Even' for even numbers and 'Odd' for odd numbers.",
        starterCode: "def solution(number):\n    # use indentation under the if and else blocks\n    pass\n",
        tests: [
            { args: [4], expected: "Even" },
            { args: [7], expected: "Odd" },
            { args: [0], expected: "Even" }
        ],
        status: "active",
        order: 2
    },
    {
        id: "practice_maximum_list",
        title: "Maximum in a List",
        difficulty: "Beginner",
        topic: "Lists",
        prompt: "Create a function named solution that returns the largest number from a list.",
        starterCode: "def solution(numbers):\n    biggest = numbers[0]\n    for number in numbers:\n        # update biggest when needed\n        pass\n    return biggest\n",
        tests: [
            { args: [[5, 10, 3]], expected: 10 },
            { args: [[100, 50, 75]], expected: 100 },
            { args: [[-1, -5, -3]], expected: -1 }
        ],
        status: "active",
        order: 3
    }
];

function asgParseJSON(rawValue, fallback) {
    if (rawValue === null || rawValue === undefined || rawValue === "") return fallback;

    try {
        const parsed = JSON.parse(rawValue);
        return parsed === undefined ? fallback : parsed;
    } catch (error) {
        return fallback;
    }
}

function asgReadJSON(key, fallback) {
    return asgParseJSON(localStorage.getItem(key), fallback);
}

function asgWriteJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("asg:data-updated", { detail: { key, value } }));
}

function asgClone(value) {
    return JSON.parse(JSON.stringify(value));
}

function asgCreateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function asgEnsureLearningData() {
    const quizQuestions = asgReadJSON(ASG_LEARNING_KEYS.quizQuestions, null);
    if (!Array.isArray(quizQuestions) || quizQuestions.length === 0) {
        asgWriteJSON(ASG_LEARNING_KEYS.quizQuestions, asgClone(ASG_DEFAULT_QUIZ_QUESTIONS));
    }

    const quizAttempts = asgReadJSON(ASG_LEARNING_KEYS.quizAttempts, null);
    if (!Array.isArray(quizAttempts)) {
        asgWriteJSON(ASG_LEARNING_KEYS.quizAttempts, []);
    }

    const codingChallenges = asgReadJSON(ASG_LEARNING_KEYS.codingChallenges, null);
    if (!Array.isArray(codingChallenges) || codingChallenges.length === 0) {
        asgWriteJSON(ASG_LEARNING_KEYS.codingChallenges, asgClone(ASG_DEFAULT_CODING_CHALLENGES));
    }

    const codingSubmissions = asgReadJSON(ASG_LEARNING_KEYS.codingSubmissions, null);
    if (!Array.isArray(codingSubmissions)) {
        asgWriteJSON(ASG_LEARNING_KEYS.codingSubmissions, []);
    }

    const announcement = asgReadJSON(ASG_LEARNING_KEYS.studentAnnouncement, null);
    if (!announcement) {
        asgWriteJSON(ASG_LEARNING_KEYS.studentAnnouncement, {
            active: false,
            title: "",
            body: "",
            updatedAt: new Date().toISOString()
        });
    }
}

function asgSortByOrder(items) {
    return [...items].sort((left, right) => {
        const leftOrder = Number.isFinite(Number(left.order)) ? Number(left.order) : 9999;
        const rightOrder = Number.isFinite(Number(right.order)) ? Number(right.order) : 9999;
        if (leftOrder !== rightOrder) return leftOrder - rightOrder;
        return String(left.title || "").localeCompare(String(right.title || ""));
    });
}

function asgNormalizeQuizQuestion(question, index) {
    const options = Array.isArray(question.options) ? question.options : [];

    return {
        id: question.id || asgCreateId("quiz"),
        title: String(question.title || `Question ${index + 1}`).trim(),
        topic: String(question.topic || "General").trim(),
        difficulty: String(question.difficulty || "Beginner").trim(),
        prompt: String(question.prompt || "").trim(),
        options: options.slice(0, 6).map((option, optionIndex) => ({
            id: option.id || String.fromCharCode(97 + optionIndex),
            text: String(option.text || "").trim()
        })).filter((option) => option.text),
        correctOption: String(question.correctOption || "a"),
        explanation: String(question.explanation || "").trim(),
        status: question.status === "draft" ? "draft" : "active",
        order: Number.isFinite(Number(question.order)) ? Number(question.order) : index + 1,
        updatedAt: new Date().toISOString()
    };
}

function asgGetQuizQuestions(includeDrafts = false) {
    asgEnsureLearningData();
    const questions = asgReadJSON(ASG_LEARNING_KEYS.quizQuestions, []);
    const normalized = questions.map(asgNormalizeQuizQuestion);
    return asgSortByOrder(includeDrafts ? normalized : normalized.filter((question) => question.status === "active"));
}

function asgSaveQuizQuestions(questions) {
    const normalized = questions.map(asgNormalizeQuizQuestion);
    asgWriteJSON(ASG_LEARNING_KEYS.quizQuestions, asgSortByOrder(normalized));
}

function asgGetCurrentLearningUser() {
    if (typeof getCurrentUser === "function") return getCurrentUser();
    return null;
}

function asgSaveQuizAttempt(attempt) {
    asgEnsureLearningData();
    const user = asgGetCurrentLearningUser();
    const attempts = asgReadJSON(ASG_LEARNING_KEYS.quizAttempts, []);
    const savedAttempt = {
        id: asgCreateId("attempt"),
        userId: user ? user.id : attempt.userId || null,
        studentName: user ? user.name : attempt.studentName || "Guest Student",
        email: user ? user.email : attempt.email || "",
        score: Number(attempt.score || 0),
        total: Number(attempt.total || 0),
        percentage: Number(attempt.percentage || 0),
        answers: attempt.answers || [],
        submittedAt: attempt.submittedAt || new Date().toISOString()
    };

    attempts.push(savedAttempt);
    asgWriteJSON(ASG_LEARNING_KEYS.quizAttempts, attempts);

    const legacyScores = asgReadJSON("quizScores", []);
    legacyScores.push({
        score: savedAttempt.percentage,
        date: savedAttempt.submittedAt,
        userId: savedAttempt.userId,
        email: savedAttempt.email
    });
    asgWriteJSON("quizScores", legacyScores);

    return savedAttempt;
}

function asgGetQuizAttempts(user = null) {
    asgEnsureLearningData();
    const attempts = asgReadJSON(ASG_LEARNING_KEYS.quizAttempts, []);
    if (!user) return attempts;
    return attempts.filter((attempt) => (
        String(attempt.userId || "") === String(user.id || "") ||
        String(attempt.email || "").toLowerCase() === String(user.email || "").toLowerCase()
    ));
}

function asgGetLatestRecord(records, dateKey) {
    return [...records].sort((left, right) => {
        return new Date(right[dateKey] || 0) - new Date(left[dateKey] || 0);
    })[0] || null;
}

function asgNormalizeCodingChallenge(challenge, index) {
    const tests = Array.isArray(challenge.tests) ? challenge.tests : [];

    return {
        id: challenge.id || asgCreateId("practice"),
        title: String(challenge.title || `Coding Challenge ${index + 1}`).trim(),
        topic: String(challenge.topic || "Python").trim(),
        difficulty: String(challenge.difficulty || "Beginner").trim(),
        prompt: String(challenge.prompt || "").trim(),
        starterCode: String(challenge.starterCode || "def solution():\n    pass\n"),
        tests: tests.map((test) => ({
            args: Array.isArray(test.args) ? test.args : [],
            expected: test.expected
        })),
        status: challenge.status === "draft" ? "draft" : "active",
        order: Number.isFinite(Number(challenge.order)) ? Number(challenge.order) : index + 1,
        updatedAt: new Date().toISOString()
    };
}

function asgGetCodingChallenges(includeDrafts = false) {
    asgEnsureLearningData();
    const challenges = asgReadJSON(ASG_LEARNING_KEYS.codingChallenges, []);
    const normalized = challenges.map(asgNormalizeCodingChallenge);
    return asgSortByOrder(includeDrafts ? normalized : normalized.filter((challenge) => challenge.status === "active"));
}

function asgSaveCodingChallenges(challenges) {
    const normalized = challenges.map(asgNormalizeCodingChallenge);
    asgWriteJSON(ASG_LEARNING_KEYS.codingChallenges, asgSortByOrder(normalized));
}

function asgSaveCodingSubmission(submission) {
    asgEnsureLearningData();
    const user = asgGetCurrentLearningUser();
    const submissions = asgReadJSON(ASG_LEARNING_KEYS.codingSubmissions, []);
    const savedSubmission = {
        id: asgCreateId("coding_submission"),
        challengeId: submission.challengeId,
        challengeTitle: submission.challengeTitle,
        userId: user ? user.id : submission.userId || null,
        studentName: user ? user.name : submission.studentName || "Guest Student",
        email: user ? user.email : submission.email || "",
        passed: Number(submission.passed || 0),
        total: Number(submission.total || 0),
        percentage: Number(submission.percentage || 0),
        code: String(submission.code || ""),
        results: submission.results || [],
        stdout: String(submission.stdout || ""),
        submittedAt: submission.submittedAt || new Date().toISOString()
    };

    submissions.push(savedSubmission);
    asgWriteJSON(ASG_LEARNING_KEYS.codingSubmissions, submissions);
    return savedSubmission;
}

function asgGetCodingSubmissions(user = null) {
    asgEnsureLearningData();
    const submissions = asgReadJSON(ASG_LEARNING_KEYS.codingSubmissions, []);
    if (!user) return submissions;
    return submissions.filter((submission) => (
        String(submission.userId || "") === String(user.id || "") ||
        String(submission.email || "").toLowerCase() === String(user.email || "").toLowerCase()
    ));
}

function asgGetTrackerProgressPercent(user) {
    if (!user) return 0;

    const userProgress = asgReadJSON(`progress_${user.id}`, null);
    if (userProgress && typeof userProgress === "object" && !Array.isArray(userProgress)) {
        const values = Object.values(userProgress);
        if (values.length) {
            const checked = values.filter((value) => value === true).length;
            return Math.round((checked / values.length) * 100);
        }
    }

    const legacyValues = [];
    for (let index = 0; index < 12; index += 1) {
        const value = localStorage.getItem(`progress_${index}`);
        if (value !== null) legacyValues.push(value === "true");
    }

    if (legacyValues.length) {
        const checked = legacyValues.filter(Boolean).length;
        return Math.round((checked / legacyValues.length) * 100);
    }

    return 0;
}

function asgGetStudentCertificates(user) {
    if (!user) return [];

    const personal = asgReadJSON(`certificates_${user.id}`, []);
    const globalCertificates = asgReadJSON("certificates", []);
    const matchingGlobal = globalCertificates.filter((certificate) => (
        String(certificate.email || "").toLowerCase() === String(user.email || "").toLowerCase() ||
        String(certificate.name || "").toLowerCase() === String(user.name || "").toLowerCase()
    ));

    return asgUniqueLearningRecords([...personal, ...matchingGlobal]);
}

function asgGetStudentEnrollments(user) {
    if (!user) return [];

    const personal = asgReadJSON(`enrollments_${user.id}`, []);
    const globalEnrollments = asgReadJSON("enrollments", []);
    const matchingGlobal = globalEnrollments.filter((enrollment) => (
        String(enrollment.email || "").toLowerCase() === String(user.email || "").toLowerCase() ||
        String(enrollment.userId || "") === String(user.id || "")
    ));

    return asgUniqueLearningRecords([...personal, ...matchingGlobal]);
}

function asgGetBestPercentage(records) {
    if (!records.length) return 0;
    return Math.round(Math.max(...records.map((record) => Number(record.percentage || 0))));
}

function asgUniqueLearningRecords(records) {
    const seen = new Set();
    return records.filter((record) => {
        const signature = [
            record.id || "",
            record.course || "",
            record.name || "",
            record.email || "",
            record.date || ""
        ].join("|");

        if (seen.has(signature)) return false;
        seen.add(signature);
        return true;
    });
}

function asgGetStudentProgress(user) {
    const quizAttempts = asgGetQuizAttempts(user);
    const codingSubmissions = asgGetCodingSubmissions(user);
    const completedChallengeIds = new Set(
        codingSubmissions
            .filter((submission) => submission.total > 0 && submission.passed === submission.total)
            .map((submission) => submission.challengeId)
    );
    const latestQuiz = asgGetLatestRecord(quizAttempts, "submittedAt");
    const latestCoding = asgGetLatestRecord(codingSubmissions, "submittedAt");
    const dates = [
        latestQuiz && latestQuiz.submittedAt,
        latestCoding && latestCoding.submittedAt,
        user && user.joinDate
    ].filter(Boolean);

    return {
        progressPercent: asgGetTrackerProgressPercent(user),
        quizAttempts: quizAttempts.length,
        latestQuiz,
        bestQuiz: asgGetBestPercentage(quizAttempts),
        codingAttempts: codingSubmissions.length,
        codingSolved: completedChallengeIds.size,
        latestCoding,
        bestCoding: asgGetBestPercentage(codingSubmissions),
        certificates: asgGetStudentCertificates(user).length,
        enrollments: asgGetStudentEnrollments(user).length,
        lastActivity: dates.length ? asgGetLatestRecord(dates.map((date) => ({ date })), "date").date : ""
    };
}

function asgGetStudentAnnouncement() {
    asgEnsureLearningData();
    return asgReadJSON(ASG_LEARNING_KEYS.studentAnnouncement, {
        active: false,
        title: "",
        body: "",
        updatedAt: new Date().toISOString()
    });
}

function asgSaveStudentAnnouncement(notice) {
    asgWriteJSON(ASG_LEARNING_KEYS.studentAnnouncement, {
        active: Boolean(notice.active),
        title: String(notice.title || "").trim(),
        body: String(notice.body || "").trim(),
        updatedAt: new Date().toISOString()
    });
}

asgEnsureLearningData();
