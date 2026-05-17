// ASG Tech shared learning data for quizzes, coding practice, and admin reports.

const ASG_LEARNING_KEYS = {
    quizCatalog: "asgQuizCatalog",
    quizQuestions: "asgQuizQuestions",
    quizAttempts: "asgQuizAttempts",
    codingChallenges: "asgCodingChallenges",
    codingSubmissions: "asgCodingSubmissions",
    examAttempts: "asgExamAttempts",
    examRetakePermissions: "asgExamRetakePermissions",
    courses: "asgCourses",
    roadmapItems: "asgRoadmapItems",
    videoLibrary: "asgVideoLibrary",
    resourceLibrary: "asgResourceLibrary",
    certificatePermissions: "asgCertificatePermissions",
    studentAnnouncement: "studentAnnouncement",
    dataVersion: "asgLearningDataVersion"
};

const ASG_LEARNING_DATA_VERSION = 7;

const ASG_QUIZ_CATALOG = [
    {
        id: "python",
        title: "Quiz 1: Python",
        topic: "Python",
        description: "Core Python syntax, functions, and language behavior.",
        order: 1
    },
    {
        id: "machine-learning",
        title: "Quiz 2: Machine Learning",
        topic: "Machine Learning",
        description: "Models, training workflow, and evaluation fundamentals.",
        order: 2
    },
    {
        id: "pandas",
        title: "Quiz 3: Pandas",
        topic: "Pandas",
        description: "DataFrame operations, cleaning, and analysis basics.",
        order: 3
    },
    {
        id: "numpy",
        title: "Quiz 4: NumPy",
        topic: "NumPy",
        description: "Arrays, shapes, vectorization, and numerical operations.",
        order: 4
    },
    {
        id: "deep-learning",
        title: "Quiz 5: Deep Learning",
        topic: "Deep Learning",
        description: "Neural networks, layers, activation, and training concepts.",
        order: 5
    },
    {
        id: "sql",
        title: "Quiz 6: SQL",
        topic: "SQL",
        description: "Queries, filters, joins, grouping, and database basics.",
        order: 6
    }
];

const ASG_DEFAULT_ROADMAP_ITEMS = [
    {
        id: "roadmap-python-foundations",
        stage: "Foundation",
        title: "Python Foundations",
        duration: "Weeks 1-4",
        focus: "Build fluency with syntax, functions, data structures, files, and clean problem solving.",
        outcomes: [
            "Write reusable Python functions",
            "Work confidently with lists, dictionaries, and files",
            "Solve beginner coding challenges with clean indentation"
        ],
        videoUrl: "videos.html",
        resourceUrl: "resources.html",
        status: "active",
        order: 1
    },
    {
        id: "roadmap-data-analysis",
        stage: "Analytics",
        title: "Data Analysis with Pandas",
        duration: "Weeks 5-8",
        focus: "Turn raw datasets into readable insights using Pandas, NumPy, charts, and exploratory analysis.",
        outcomes: [
            "Clean messy tabular data",
            "Create charts for patterns and comparisons",
            "Prepare datasets for machine learning"
        ],
        videoUrl: "videos.html",
        resourceUrl: "resources.html",
        status: "active",
        order: 2
    },
    {
        id: "roadmap-machine-learning",
        stage: "Modeling",
        title: "Machine Learning Workflow",
        duration: "Weeks 9-14",
        focus: "Learn supervised learning, validation, feature thinking, and model evaluation through practical projects.",
        outcomes: [
            "Train classification and regression models",
            "Compare models using meaningful metrics",
            "Avoid common overfitting mistakes"
        ],
        videoUrl: "videos.html",
        resourceUrl: "quiz.html",
        status: "active",
        order: 3
    },
    {
        id: "roadmap-deep-learning",
        stage: "Advanced",
        title: "Deep Learning Foundations",
        duration: "Weeks 15-20",
        focus: "Understand neural networks, training loops, transfer learning, and how to reason about model behavior.",
        outcomes: [
            "Explain how neural networks learn",
            "Use pretrained models responsibly",
            "Connect deep learning concepts to portfolio projects"
        ],
        videoUrl: "videos.html",
        resourceUrl: "resources.html",
        status: "active",
        order: 4
    },
    {
        id: "roadmap-portfolio",
        stage: "Career",
        title: "Portfolio and Interview Readiness",
        duration: "Weeks 21-24",
        focus: "Package projects, practice interviews, publish work, and prepare a credible student portfolio.",
        outcomes: [
            "Build and document portfolio projects",
            "Prepare for technical interviews",
            "Publish a professional learning record"
        ],
        videoUrl: "videos.html",
        resourceUrl: "certificate.html",
        status: "active",
        order: 5
    }
];

const ASG_DEFAULT_VIDEO_LIBRARY = [
    {
        id: "video-python-start",
        title: "Python Starter Session",
        category: "Python",
        level: "Beginner",
        duration: "28 min",
        description: "A practical orientation for variables, functions, loops, and how to study coding consistently.",
        url: "https://www.youtube.com/embed/kqtD5dpn9C8",
        status: "active",
        order: 1
    },
    {
        id: "video-pandas-workflow",
        title: "Pandas Data Cleaning Workflow",
        category: "Data Analysis",
        level: "Beginner",
        duration: "34 min",
        description: "A guided workflow for reading data, checking quality, cleaning columns, and summarizing insights.",
        url: "https://www.youtube.com/embed/vmEHCJofslg",
        status: "active",
        order: 2
    },
    {
        id: "video-ml-models",
        title: "Machine Learning Model Mindset",
        category: "Machine Learning",
        level: "Intermediate",
        duration: "42 min",
        description: "How to think about features, training data, validation, and model evaluation without getting lost.",
        url: "https://www.youtube.com/embed/GwIo3gDZCVQ",
        status: "active",
        order: 3
    },
    {
        id: "video-project-build",
        title: "Portfolio Project Walkthrough",
        category: "Projects",
        level: "Intermediate",
        duration: "45 min",
        description: "How to turn a lesson into a portfolio project with a clean README, screenshots, and next steps.",
        url: "projects.html",
        status: "active",
        order: 4
    }
];

const ASG_DEFAULT_RESOURCE_LIBRARY = [
    {
        id: "resource-python-cheatsheet",
        title: "Python Syntax Cheat Sheet",
        category: "Python",
        format: "PDF / Notes",
        description: "A compact reference for syntax, functions, loops, collections, and common beginner mistakes.",
        url: "course-detail.html?course=python-for-beginners",
        actionLabel: "Open Python Course",
        status: "active",
        order: 1
    },
    {
        id: "resource-pandas-guide",
        title: "Pandas Cleaning Checklist",
        category: "Data Analysis",
        format: "Checklist",
        description: "A student-friendly checklist for missing values, data types, duplicates, and feature preparation.",
        url: "course-detail.html?course=data-analysis-with-pandas",
        actionLabel: "View Checklist",
        status: "active",
        order: 2
    },
    {
        id: "resource-ml-interview",
        title: "Machine Learning Interview Q&A",
        category: "Machine Learning",
        format: "Interview Prep",
        description: "Core questions on supervised learning, metrics, overfitting, validation, and model selection.",
        url: "quiz.html",
        actionLabel: "Practice Quiz",
        status: "active",
        order: 3
    },
    {
        id: "resource-project-template",
        title: "Portfolio Project Template",
        category: "Career",
        format: "Template",
        description: "A structure for project README files, problem statements, result summaries, and screenshots.",
        url: "projects.html",
        actionLabel: "Open Projects",
        status: "active",
        order: 4
    }
];

const ASG_DEFAULT_QUIZ_QUESTIONS = [
    {
        id: "quiz_python_function_keyword",
        quizId: "python",
        title: "Python Functions",
        topic: "Python",
        difficulty: "Beginner",
        prompt: "Which keyword is used to define a reusable function in Python?",
        options: [
            { id: "a", text: "func" },
            { id: "b", text: "def" },
            { id: "c", text: "function" },
            { id: "d", text: "lambda only" }
        ],
        correctOption: "b",
        explanation: "Python uses def to define a named function.",
        status: "active",
        order: 1
    },
    {
        id: "quiz_python_mutable_type",
        quizId: "python",
        title: "Mutable Data Types",
        topic: "Python",
        difficulty: "Beginner",
        prompt: "Which Python data type is mutable?",
        options: [
            { id: "a", text: "tuple" },
            { id: "b", text: "string" },
            { id: "c", text: "list" },
            { id: "d", text: "integer" }
        ],
        correctOption: "c",
        explanation: "Lists can be changed after creation, while tuples and strings cannot.",
        status: "active",
        order: 2
    },
    {
        id: "quiz_python_exception",
        quizId: "python",
        title: "Exception Handling",
        topic: "Python",
        difficulty: "Beginner",
        prompt: "Which block handles an error raised inside a try block?",
        options: [
            { id: "a", text: "except" },
            { id: "b", text: "catch" },
            { id: "c", text: "error" },
            { id: "d", text: "rescue" }
        ],
        correctOption: "a",
        explanation: "Python uses except blocks to handle exceptions.",
        status: "active",
        order: 3
    },
    {
        id: "quiz_classification_model",
        quizId: "machine-learning",
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
        order: 1
    },
    {
        id: "quiz_ml_supervised_learning",
        quizId: "machine-learning",
        title: "Supervised Learning",
        topic: "Machine Learning",
        difficulty: "Beginner",
        prompt: "What is required for supervised learning?",
        options: [
            { id: "a", text: "Only unlabeled raw data" },
            { id: "b", text: "Labeled input-output examples" },
            { id: "c", text: "No training data" },
            { id: "d", text: "Only images" }
        ],
        correctOption: "b",
        explanation: "Supervised learning trains from examples that include the expected answer.",
        status: "active",
        order: 2
    },
    {
        id: "quiz_overfitting",
        quizId: "machine-learning",
        title: "Model Quality",
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
        order: 3
    },
    {
        id: "quiz_python_import",
        quizId: "pandas",
        title: "Pandas Import Alias",
        topic: "Pandas",
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
        id: "quiz_pandas_dataframe_shape",
        quizId: "pandas",
        title: "DataFrame Shape",
        topic: "Pandas",
        difficulty: "Beginner",
        prompt: "What does df.shape return in Pandas?",
        options: [
            { id: "a", text: "Column names only" },
            { id: "b", text: "A tuple with rows and columns" },
            { id: "c", text: "Only missing values" },
            { id: "d", text: "A sorted DataFrame" }
        ],
        correctOption: "b",
        explanation: "df.shape returns a tuple such as (rows, columns).",
        status: "active",
        order: 2
    },
    {
        id: "quiz_pandas_missing_values",
        quizId: "pandas",
        title: "Missing Values",
        topic: "Pandas",
        difficulty: "Intermediate",
        prompt: "Which Pandas method is commonly used to detect missing values?",
        options: [
            { id: "a", text: "isnull()" },
            { id: "b", text: "missing()" },
            { id: "c", text: "empty_only()" },
            { id: "d", text: "find_blank()" }
        ],
        correctOption: "a",
        explanation: "isnull() identifies missing values in Series and DataFrames.",
        status: "active",
        order: 3
    },
    {
        id: "quiz_numpy_array_object",
        quizId: "numpy",
        title: "NumPy Arrays",
        topic: "NumPy",
        difficulty: "Beginner",
        prompt: "Which object is the core container for numerical data in NumPy?",
        options: [
            { id: "a", text: "DataFrame" },
            { id: "b", text: "ndarray" },
            { id: "c", text: "Workbook" },
            { id: "d", text: "SeriesGroup" }
        ],
        correctOption: "b",
        explanation: "NumPy's ndarray stores fast multidimensional numerical arrays.",
        status: "active",
        order: 1
    },
    {
        id: "quiz_numpy_vectorized_ops",
        quizId: "numpy",
        title: "Vectorization",
        topic: "NumPy",
        difficulty: "Intermediate",
        prompt: "Why are vectorized NumPy operations usually preferred over Python loops?",
        options: [
            { id: "a", text: "They are often faster and more concise." },
            { id: "b", text: "They disable arrays." },
            { id: "c", text: "They work only with strings." },
            { id: "d", text: "They require no memory." }
        ],
        correctOption: "a",
        explanation: "Vectorized operations use optimized array routines and reduce manual loop code.",
        status: "active",
        order: 2
    },
    {
        id: "quiz_numpy_shape",
        quizId: "numpy",
        title: "Array Shape",
        topic: "NumPy",
        difficulty: "Beginner",
        prompt: "What does the shape attribute describe?",
        options: [
            { id: "a", text: "The size of each dimension" },
            { id: "b", text: "Only the data type" },
            { id: "c", text: "Only the first value" },
            { id: "d", text: "The file path" }
        ],
        correctOption: "a",
        explanation: "shape tells you how many elements exist along each array dimension.",
        status: "active",
        order: 3
    },
    {
        id: "quiz_cnn_name",
        quizId: "deep-learning",
        title: "CNN Basics",
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
        order: 1
    },
    {
        id: "quiz_deep_learning_activation",
        quizId: "deep-learning",
        title: "Activation Functions",
        topic: "Deep Learning",
        difficulty: "Beginner",
        prompt: "What is the role of an activation function in a neural network?",
        options: [
            { id: "a", text: "It adds non-linearity to the model." },
            { id: "b", text: "It deletes all weights." },
            { id: "c", text: "It stores CSV files." },
            { id: "d", text: "It replaces training data." }
        ],
        correctOption: "a",
        explanation: "Activation functions help neural networks learn non-linear patterns.",
        status: "active",
        order: 2
    },
    {
        id: "quiz_deep_learning_backprop",
        quizId: "deep-learning",
        title: "Backpropagation",
        topic: "Deep Learning",
        difficulty: "Intermediate",
        prompt: "What does backpropagation help calculate during training?",
        options: [
            { id: "a", text: "Gradients for updating weights" },
            { id: "b", text: "The website URL" },
            { id: "c", text: "Random column names" },
            { id: "d", text: "Only the final prediction label" }
        ],
        correctOption: "a",
        explanation: "Backpropagation calculates gradients so optimizers can update model weights.",
        status: "active",
        order: 3
    },
    {
        id: "quiz_sql_select",
        quizId: "sql",
        title: "Select Rows",
        topic: "SQL",
        difficulty: "Beginner",
        prompt: "Which SQL statement reads all columns from a table named students?",
        options: [
            { id: "a", text: "SELECT * FROM students;" },
            { id: "b", text: "READ students ALL;" },
            { id: "c", text: "GET * students;" },
            { id: "d", text: "OPEN TABLE students;" }
        ],
        correctOption: "a",
        explanation: "SELECT * FROM table_name reads every column from that table.",
        status: "active",
        order: 1
    },
    {
        id: "quiz_sql_where",
        quizId: "sql",
        title: "Filtering Rows",
        topic: "SQL",
        difficulty: "Beginner",
        prompt: "Which clause filters rows in a SQL query?",
        options: [
            { id: "a", text: "WHERE" },
            { id: "b", text: "FILTER BY" },
            { id: "c", text: "ONLY" },
            { id: "d", text: "PICK" }
        ],
        correctOption: "a",
        explanation: "WHERE is used to return only rows matching a condition.",
        status: "active",
        order: 2
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
    },
    {
        id: "practice_count_vowels",
        title: "Count Vowels in a String",
        difficulty: "Beginner",
        topic: "Strings",
        prompt: "Create a function named solution that returns the number of vowels in a string. Count both uppercase and lowercase vowels.",
        starterCode: "def solution(text):\n    vowels = \"aeiouAEIOU\"\n    count = 0\n    # count every vowel in text\n    pass\n",
        tests: [
            { args: ["hello"], expected: 2 },
            { args: ["PYTHON"], expected: 1 },
            { args: ["Education"], expected: 5 }
        ],
        status: "active",
        order: 4
    },
    {
        id: "practice_tuple_second_largest",
        title: "Second Largest in a Tuple",
        difficulty: "Beginner",
        topic: "Tuples",
        prompt: "Create a function named solution that returns the second largest unique number from a tuple.",
        starterCode: "def solution(numbers):\n    numbers = tuple(numbers)\n    # return the second largest unique value\n    pass\n",
        tests: [
            { args: [[4, 9, 1, 9, 7]], expected: 7 },
            { args: [[10, 5, 8, 3]], expected: 8 },
            { args: [[-2, -5, -1, -3]], expected: -2 }
        ],
        status: "active",
        order: 5
    },
    {
        id: "practice_dictionary_top_score",
        title: "Top Student from a Dictionary",
        difficulty: "Beginner",
        topic: "Dictionaries",
        prompt: "Create a function named solution that receives a dictionary of student scores and returns the name with the highest score.",
        starterCode: "def solution(scores):\n    # scores is a dictionary like {\"Asha\": 91, \"Ravi\": 87}\n    pass\n",
        tests: [
            { args: [{ "Asha": 91, "Ravi": 87, "Meera": 94 }], expected: "Meera" },
            { args: [{ "A": 10, "B": 25, "C": 15 }], expected: "B" },
            { args: [{ "Nina": -1, "Omar": -3 }], expected: "Nina" }
        ],
        status: "active",
        order: 6
    },
    {
        id: "practice_class_bank_account",
        title: "Bank Account Class",
        difficulty: "Intermediate",
        topic: "Classes",
        prompt: "Create a function named solution that creates a BankAccount class with deposit and get_balance methods, then returns the balance after depositing the given amount.",
        starterCode: "def solution(starting_balance, deposit_amount):\n    class BankAccount:\n        def __init__(self, balance):\n            self.balance = balance\n\n        # add deposit and get_balance methods\n\n    account = BankAccount(starting_balance)\n    # deposit the amount and return the balance\n    pass\n",
        tests: [
            { args: [100, 50], expected: 150 },
            { args: [0, 25], expected: 25 },
            { args: [250, 125], expected: 375 }
        ],
        status: "active",
        order: 7
    },
    {
        id: "practice_inheritance_vehicle",
        title: "Class Inheritance",
        difficulty: "Intermediate",
        topic: "Class Inheritance",
        prompt: "Create a function named solution that defines a Vehicle parent class and a Car child class. Return the string produced by the child class for the given brand.",
        starterCode: "def solution(brand):\n    class Vehicle:\n        def __init__(self, brand):\n            self.brand = brand\n\n        def info(self):\n            return self.brand\n\n    class Car(Vehicle):\n        # inherit from Vehicle and return '<brand> car'\n        pass\n\n    vehicle = Car(brand)\n    return vehicle.info()\n",
        tests: [
            { args: ["Toyota"], expected: "Toyota car" },
            { args: ["Honda"], expected: "Honda car" },
            { args: ["Tata"], expected: "Tata car" }
        ],
        status: "active",
        order: 8
    },
    {
        id: "practice_polymorphism_shapes",
        title: "Polymorphism with Shapes",
        difficulty: "Intermediate",
        topic: "Polymorphism",
        prompt: "Create a function named solution that builds Circle and Square objects with a common area method, then returns their areas in a list.",
        starterCode: "def solution(radius, side):\n    class Circle:\n        def __init__(self, radius):\n            self.radius = radius\n\n        def area(self):\n            return 3.14 * self.radius * self.radius\n\n    class Square:\n        def __init__(self, side):\n            self.side = side\n\n        # add an area method\n\n    shapes = [Circle(radius), Square(side)]\n    # return a list of each shape area\n    pass\n",
        tests: [
            { args: [2, 3], expected: [12.56, 9] },
            { args: [1, 4], expected: [3.14, 16] },
            { args: [3, 5], expected: [28.26, 25] }
        ],
        status: "active",
        order: 9
    },
    {
        id: "practice_method_overriding_employee",
        title: "Method Overriding",
        difficulty: "Intermediate",
        topic: "Method Overriding",
        prompt: "Create a function named solution that defines an Employee class and a Manager class that overrides the role method. Return the manager role text.",
        starterCode: "def solution(name):\n    class Employee:\n        def __init__(self, name):\n            self.name = name\n\n        def role(self):\n            return self.name + \" is an employee\"\n\n    class Manager(Employee):\n        # override role to return '<name> is a manager'\n        pass\n\n    person = Manager(name)\n    return person.role()\n",
        tests: [
            { args: ["Asha"], expected: "Asha is a manager" },
            { args: ["Ravi"], expected: "Ravi is a manager" },
            { args: ["Meera"], expected: "Meera is a manager" }
        ],
        status: "active",
        order: 10
    },
    {
        id: "exam_python_palindrome",
        title: "Palindrome Check",
        difficulty: "Beginner",
        topic: "Python",
        prompt: "Create a function named solution that returns True when a word reads the same forward and backward.",
        starterCode: "def solution(text):\n    # return True if text is a palindrome\n    pass\n",
        tests: [
            { args: ["madam"], expected: true },
            { args: ["python"], expected: false },
            { args: ["level"], expected: true }
        ],
        status: "active",
        order: 11
    },
    {
        id: "exam_python_unique_values",
        title: "Unique Values",
        difficulty: "Beginner",
        topic: "Python",
        prompt: "Create a function named solution that returns the sorted unique values from a list.",
        starterCode: "def solution(values):\n    # return sorted unique values\n    pass\n",
        tests: [
            { args: [[3, 1, 3, 2]], expected: [1, 2, 3] },
            { args: [["b", "a", "b"]], expected: ["a", "b"] },
            { args: [[5, 5, 5]], expected: [5] }
        ],
        status: "active",
        order: 12
    },
    {
        id: "exam_ml_accuracy",
        title: "Classification Accuracy",
        difficulty: "Intermediate",
        topic: "Machine Learning",
        prompt: "Create a function named solution that receives two lists, y_true and y_pred, and returns accuracy rounded to two decimals.",
        starterCode: "def solution(y_true, y_pred):\n    # return correct predictions / total predictions, rounded to 2 decimals\n    pass\n",
        tests: [
            { args: [[1, 0, 1], [1, 1, 1]], expected: 0.67 },
            { args: [["cat", "dog"], ["cat", "dog"]], expected: 1.0 },
            { args: [[0, 0, 1, 1], [1, 0, 0, 1]], expected: 0.5 }
        ],
        status: "active",
        order: 13
    },
    {
        id: "exam_ml_train_test_split",
        title: "Train Test Count",
        difficulty: "Beginner",
        topic: "Machine Learning",
        prompt: "Create a function named solution that returns the number of training rows after reserving test_percent percent for testing.",
        starterCode: "def solution(total_rows, test_percent):\n    # return rows left for training after the test split\n    pass\n",
        tests: [
            { args: [100, 20], expected: 80 },
            { args: [250, 30], expected: 175 },
            { args: [10, 50], expected: 5 }
        ],
        status: "active",
        order: 14
    },
    {
        id: "exam_pandas_column_total",
        title: "Column Total",
        difficulty: "Beginner",
        topic: "Pandas",
        prompt: "Create a function named solution that receives table rows as dictionaries and returns the sum of one column.",
        starterCode: "def solution(rows, column):\n    # rows is a list of dictionaries\n    pass\n",
        tests: [
            { args: [[{ "sales": 10 }, { "sales": 15 }], "sales"], expected: 25 },
            { args: [[{ "age": 20 }, { "age": 30 }, { "age": 25 }], "age"], expected: 75 },
            { args: [[{ "qty": 2 }, { "qty": 8 }], "qty"], expected: 10 }
        ],
        status: "active",
        order: 15
    },
    {
        id: "exam_pandas_filter_rows",
        title: "Filter Rows",
        difficulty: "Intermediate",
        topic: "Pandas",
        prompt: "Create a function named solution that returns rows where the given column is greater than the threshold.",
        starterCode: "def solution(rows, column, threshold):\n    # return matching dictionaries in their original order\n    pass\n",
        tests: [
            { args: [[{ "score": 80 }, { "score": 45 }], "score", 50], expected: [{ "score": 80 }] },
            { args: [[{ "x": 1 }, { "x": 3 }, { "x": 2 }], "x", 1], expected: [{ "x": 3 }, { "x": 2 }] },
            { args: [[{ "price": 99 }, { "price": 120 }], "price", 100], expected: [{ "price": 120 }] }
        ],
        status: "active",
        order: 16
    }
];

const ASG_PYTHON_BEGINNER_TOPICS = [
    "Python Basics: Variables, Data Types, Operators, and Input/Output",
    "Control Flow: Conditional Statements (if, elif, else), Loops (for, while)",
    "Data Structures: Lists, Tuples, Sets, Dictionaries",
    "Functions: Definition, Parameters, Return Values, Scope, Lambda Functions",
    "File Handling: Reading from and Writing to Files",
    "Error and Exception Handling: Try, Except, Finally",
    "Modules and Packages: Importing, Creating, and Using Libraries",
    "Introduction to Object-Oriented Programming (OOP): Classes and Objects",
    "Basic Algorithms: Searching, Sorting, and Recursion",
    "Introduction to Python Libraries for Data: NumPy and Pandas (Overview)"
];

const ASG_DEFAULT_COURSES = [
    {
        id: "python-for-beginners",
        title: "Python for Beginners",
        summary: "Complete Python programming from zero to hero.",
        icon: "PY",
        price: "FREE",
        status: "active",
        welcome: "Welcome to Python for Beginners. Start with the cheat sheet, then open each topic from the left.",
        cheatSheet: "Variables store values. Use if/elif/else for choices, loops for repetition, functions for reusable logic, and lists/dicts for everyday data.",
        topics: ASG_PYTHON_BEGINNER_TOPICS.map((title, index) => ({
            id: `python-beginner-topic-${index + 1}`,
            title,
            content: `<h2>${title}</h2><p>This lesson page is ready for your full HTML content from the admin dashboard.</p><pre><code># Add examples, notes, and exercises here</code></pre>`,
            quizHtml: `<h2>${title} Quiz</h2><p>Add topic-specific quiz HTML from the admin dashboard.</p>`,
            videoUrl: "",
            order: index + 1,
            status: "active"
        }))
    },
    {
        id: "python-for-data-science",
        title: "Python for Data Science",
        summary: "Python workflows for data cleaning, analysis, NumPy, Pandas, and visualization.",
        icon: "DS",
        price: "FREE",
        status: "active",
        welcome: "Welcome to Python for Data Science. Use these lessons to move from Python basics into real analysis workflows.",
        cheatSheet: "Keep data in arrays, Series, and DataFrames. Inspect shape, clean missing values, group data, summarize, and visualize patterns.",
        topics: [
            "NumPy Arrays and Vectorized Operations",
            "Pandas Series and DataFrames",
            "Reading CSV, Excel, and JSON Files",
            "Cleaning Missing and Duplicate Data",
            "Filtering, Sorting, and Grouping Data",
            "Merging and Joining DataFrames",
            "Basic Data Visualization",
            "Mini Data Analysis Project"
        ].map((title, index) => ({
            id: `python-data-science-topic-${index + 1}`,
            title,
            content: `<h2>${title}</h2><p>Add the complete lesson content from the admin dashboard.</p>`,
            quizHtml: `<h2>${title} Quiz</h2><p>Add quiz HTML here.</p>`,
            videoUrl: "",
            order: index + 1,
            status: "active"
        }))
    },
    {
        id: "machine-learning-mastery",
        title: "Machine Learning Mastery",
        summary: "From basics to advanced ML algorithms with real projects.",
        icon: "ML",
        price: "Rs. 999",
        status: "active",
        welcome: "Welcome to Machine Learning Mastery. Follow each topic in order and keep notes from experiments.",
        cheatSheet: "ML workflow: define the target, prepare features, split data, train, validate, tune, and monitor model quality.",
        topics: [
            "Machine Learning Workflow",
            "Supervised vs Unsupervised Learning",
            "Regression Models",
            "Classification Models",
            "Model Evaluation Metrics",
            "Feature Engineering",
            "Overfitting and Regularization",
            "End-to-End ML Project"
        ].map((title, index) => ({
            id: `machine-learning-topic-${index + 1}`,
            title,
            content: `<h2>${title}</h2><p>Add the complete machine learning lesson from the admin dashboard.</p>`,
            quizHtml: `<h2>${title} Quiz</h2><p>Add quiz HTML here.</p>`,
            videoUrl: "",
            order: index + 1,
            status: "active"
        }))
    },
    {
        id: "deep-learning-pinns",
        title: "Deep Learning & PINNs",
        summary: "Neural networks, CNNs, and Physics-Informed Neural Networks.",
        icon: "DL",
        price: "Rs. 1499",
        status: "active",
        welcome: "Welcome to Deep Learning & PINNs. Build a strong neural-network base before moving into physics-informed models.",
        cheatSheet: "Neural networks learn weights with backpropagation. PINNs add physics equations to the loss function.",
        topics: [
            "Neural Network Foundations",
            "Activation Functions and Loss",
            "Backpropagation and Optimizers",
            "CNN Basics",
            "Regularization and Dropout",
            "Introduction to PINNs",
            "Physics Loss Functions",
            "PINN Mini Project"
        ].map((title, index) => ({
            id: `deep-learning-topic-${index + 1}`,
            title,
            content: `<h2>${title}</h2><p>Add the full deep learning lesson from the admin dashboard.</p>`,
            quizHtml: `<h2>${title} Quiz</h2><p>Add quiz HTML here.</p>`,
            videoUrl: "",
            order: index + 1,
            status: "active"
        }))
    },
    {
        id: "data-analysis-with-pandas",
        title: "Data Analysis with Pandas",
        summary: "Master data manipulation, cleaning, and analysis.",
        icon: "PD",
        price: "FREE",
        status: "active",
        welcome: "Welcome to Data Analysis with Pandas. Practice each topic with small datasets.",
        cheatSheet: "Use read_csv, head, info, describe, isnull, dropna, fillna, groupby, merge, pivot_table, and plot.",
        topics: [
            "Pandas Setup and DataFrames",
            "Importing and Inspecting Data",
            "Selecting Rows and Columns",
            "Cleaning Missing Data",
            "GroupBy and Aggregation",
            "Merging DataFrames",
            "Time Series Basics",
            "Analysis Project"
        ].map((title, index) => ({
            id: `pandas-topic-${index + 1}`,
            title,
            content: `<h2>${title}</h2><p>Add the full Pandas lesson from the admin dashboard.</p>`,
            quizHtml: `<h2>${title} Quiz</h2><p>Add quiz HTML here.</p>`,
            videoUrl: "",
            order: index + 1,
            status: "active"
        }))
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

function asgSlugify(value, fallback = "item") {
    const slug = String(value || "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    return slug || `${fallback}-${Date.now()}`;
}

function asgGetQuizCatalog() {
    return asgSortByOrder(asgReadJSON(ASG_LEARNING_KEYS.quizCatalog, ASG_QUIZ_CATALOG).map(asgNormalizeQuizCatalogItem));
}

function asgNormalizeQuizCatalogItem(item, index) {
    const title = String(item.title || item.topic || `Quiz ${index + 1}`).trim();
    const topic = String(item.topic || title.replace(/^quiz\s+\d+:\s*/i, "")).trim();
    return {
        id: asgSlugify(item.id || topic || title, "quiz"),
        title,
        topic,
        description: String(item.description || `${topic} assessment questions.`).trim(),
        order: Number.isFinite(Number(item.order)) ? Number(item.order) : index + 1,
        status: item.status === "draft" ? "draft" : "active"
    };
}

function asgSaveQuizCatalog(catalog) {
    const normalized = catalog.map(asgNormalizeQuizCatalogItem);
    asgWriteJSON(ASG_LEARNING_KEYS.quizCatalog, asgSortByOrder(normalized));
}

function asgResolveQuizId(value) {
    const rawValue = String(value || "").toLowerCase().trim();
    const compactValue = rawValue.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const matchedQuiz = asgGetQuizCatalog().find((quiz) => {
        const aliases = [
            quiz.id,
            quiz.title,
            quiz.topic,
            quiz.title.replace(/^quiz\s+\d+:\s*/i, "")
        ].map((item) => String(item).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));

        return aliases.includes(compactValue);
    });

    return matchedQuiz ? matchedQuiz.id : "python";
}

function asgGetQuizById(quizId) {
    const resolvedQuizId = asgResolveQuizId(quizId);
    return asgGetQuizCatalog().find((quiz) => quiz.id === resolvedQuizId) || asgGetQuizCatalog()[0];
}

function asgInferQuizId(question) {
    const searchable = [
        question.quizId,
        question.quiz,
        question.category,
        question.topic,
        question.title,
        question.prompt
    ].join(" ").toLowerCase();

    if (searchable.includes("deep")) return "deep-learning";
    if (searchable.includes("sql") || searchable.includes("query") || searchable.includes("database")) return "sql";
    if (searchable.includes("numpy") || searchable.includes("num py")) return "numpy";
    if (searchable.includes("pandas") || searchable.includes("dataframe")) return "pandas";
    if (searchable.includes("machine") || searchable.includes("classification") || searchable.includes("model")) {
        return "machine-learning";
    }

    return "python";
}

function asgMergeDefaultItems(existingItems, defaultItems, normalizeItem) {
    const currentItems = Array.isArray(existingItems) ? existingItems : [];
    const currentIds = new Set(currentItems.map((item) => item && item.id).filter(Boolean));
    const missingDefaults = defaultItems
        .filter((item) => !currentIds.has(item.id))
        .map((item) => asgClone(item));

    return [...currentItems, ...missingDefaults].map(normalizeItem);
}

function asgEnsureLearningData() {
    const storedVersion = Number(localStorage.getItem(ASG_LEARNING_KEYS.dataVersion) || 0);
    const shouldUpgradeDefaults = storedVersion < ASG_LEARNING_DATA_VERSION;
    const quizCatalog = asgReadJSON(ASG_LEARNING_KEYS.quizCatalog, null);
    if (!Array.isArray(quizCatalog) || (quizCatalog.length === 0 && shouldUpgradeDefaults)) {
        asgWriteJSON(ASG_LEARNING_KEYS.quizCatalog, asgClone(ASG_QUIZ_CATALOG));
    } else if (shouldUpgradeDefaults) {
        const mergedCatalog = asgMergeDefaultItems(quizCatalog, ASG_QUIZ_CATALOG, asgNormalizeQuizCatalogItem);
        if (mergedCatalog.length !== quizCatalog.length) {
            asgWriteJSON(ASG_LEARNING_KEYS.quizCatalog, asgSortByOrder(mergedCatalog));
        }
    }

    const quizQuestions = asgReadJSON(ASG_LEARNING_KEYS.quizQuestions, null);
    if (!Array.isArray(quizQuestions) || (quizQuestions.length === 0 && shouldUpgradeDefaults)) {
        asgWriteJSON(ASG_LEARNING_KEYS.quizQuestions, asgClone(ASG_DEFAULT_QUIZ_QUESTIONS));
    } else if (shouldUpgradeDefaults || quizQuestions.some((question) => !question.quizId)) {
        const mergedQuestions = shouldUpgradeDefaults
            ? asgMergeDefaultItems(quizQuestions, ASG_DEFAULT_QUIZ_QUESTIONS, asgNormalizeQuizQuestion)
            : quizQuestions.map(asgNormalizeQuizQuestion);
        if (mergedQuestions.length !== quizQuestions.length || quizQuestions.some((question) => !question.quizId)) {
            asgWriteJSON(ASG_LEARNING_KEYS.quizQuestions, asgSortByOrder(mergedQuestions));
        }
    }

    const quizAttempts = asgReadJSON(ASG_LEARNING_KEYS.quizAttempts, null);
    if (!Array.isArray(quizAttempts)) {
        asgWriteJSON(ASG_LEARNING_KEYS.quizAttempts, []);
    }

    const codingChallenges = asgReadJSON(ASG_LEARNING_KEYS.codingChallenges, null);
    if (!Array.isArray(codingChallenges) || (codingChallenges.length === 0 && shouldUpgradeDefaults)) {
        asgWriteJSON(ASG_LEARNING_KEYS.codingChallenges, asgClone(ASG_DEFAULT_CODING_CHALLENGES));
    } else if (shouldUpgradeDefaults) {
        const mergedChallenges = asgMergeDefaultItems(codingChallenges, ASG_DEFAULT_CODING_CHALLENGES, asgNormalizeCodingChallenge);
        if (mergedChallenges.length !== codingChallenges.length) {
            asgWriteJSON(ASG_LEARNING_KEYS.codingChallenges, asgSortByOrder(mergedChallenges));
        }
    }

    const codingSubmissions = asgReadJSON(ASG_LEARNING_KEYS.codingSubmissions, null);
    if (!Array.isArray(codingSubmissions)) {
        asgWriteJSON(ASG_LEARNING_KEYS.codingSubmissions, []);
    }

    const examAttempts = asgReadJSON(ASG_LEARNING_KEYS.examAttempts, null);
    if (!Array.isArray(examAttempts)) {
        asgWriteJSON(ASG_LEARNING_KEYS.examAttempts, []);
    }

    const examRetakePermissions = asgReadJSON(ASG_LEARNING_KEYS.examRetakePermissions, null);
    if (!examRetakePermissions || typeof examRetakePermissions !== "object" || Array.isArray(examRetakePermissions)) {
        asgWriteJSON(ASG_LEARNING_KEYS.examRetakePermissions, {});
    }

    const certificatePermissions = asgReadJSON(ASG_LEARNING_KEYS.certificatePermissions, null);
    if (!certificatePermissions || typeof certificatePermissions !== "object" || Array.isArray(certificatePermissions)) {
        asgWriteJSON(ASG_LEARNING_KEYS.certificatePermissions, {});
    }

    const courses = asgReadJSON(ASG_LEARNING_KEYS.courses, null);
    if (!Array.isArray(courses) || (courses.length === 0 && shouldUpgradeDefaults)) {
        asgWriteJSON(ASG_LEARNING_KEYS.courses, asgClone(ASG_DEFAULT_COURSES));
    } else if (shouldUpgradeDefaults) {
        const mergedCourses = asgMergeDefaultItems(courses, ASG_DEFAULT_COURSES, asgNormalizeCourse);
        if (mergedCourses.length !== courses.length) {
            asgWriteJSON(ASG_LEARNING_KEYS.courses, asgSortByOrder(mergedCourses));
        }
    }

    const roadmapItems = asgReadJSON(ASG_LEARNING_KEYS.roadmapItems, null);
    if (!Array.isArray(roadmapItems) || (roadmapItems.length === 0 && shouldUpgradeDefaults)) {
        asgWriteJSON(ASG_LEARNING_KEYS.roadmapItems, asgClone(ASG_DEFAULT_ROADMAP_ITEMS));
    } else if (shouldUpgradeDefaults) {
        const mergedRoadmap = asgMergeDefaultItems(roadmapItems, ASG_DEFAULT_ROADMAP_ITEMS, asgNormalizeRoadmapItem);
        if (mergedRoadmap.length !== roadmapItems.length) {
            asgWriteJSON(ASG_LEARNING_KEYS.roadmapItems, asgSortByOrder(mergedRoadmap));
        }
    }

    const videoLibrary = asgReadJSON(ASG_LEARNING_KEYS.videoLibrary, null);
    if (!Array.isArray(videoLibrary) || (videoLibrary.length === 0 && shouldUpgradeDefaults)) {
        asgWriteJSON(ASG_LEARNING_KEYS.videoLibrary, asgClone(ASG_DEFAULT_VIDEO_LIBRARY));
    } else if (shouldUpgradeDefaults) {
        const mergedVideos = asgMergeDefaultItems(videoLibrary, ASG_DEFAULT_VIDEO_LIBRARY, asgNormalizeVideoItem);
        if (mergedVideos.length !== videoLibrary.length) {
            asgWriteJSON(ASG_LEARNING_KEYS.videoLibrary, asgSortByOrder(mergedVideos));
        }
    }

    const resourceLibrary = asgReadJSON(ASG_LEARNING_KEYS.resourceLibrary, null);
    if (!Array.isArray(resourceLibrary) || (resourceLibrary.length === 0 && shouldUpgradeDefaults)) {
        asgWriteJSON(ASG_LEARNING_KEYS.resourceLibrary, asgClone(ASG_DEFAULT_RESOURCE_LIBRARY));
    } else if (shouldUpgradeDefaults) {
        const mergedResources = asgMergeDefaultItems(resourceLibrary, ASG_DEFAULT_RESOURCE_LIBRARY, asgNormalizeResourceItem);
        if (mergedResources.length !== resourceLibrary.length) {
            asgWriteJSON(ASG_LEARNING_KEYS.resourceLibrary, asgSortByOrder(mergedResources));
        }
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

    localStorage.setItem(ASG_LEARNING_KEYS.dataVersion, String(ASG_LEARNING_DATA_VERSION));
}

function asgSortByOrder(items) {
    return [...items].sort((left, right) => {
        const leftQuizOrder = left.quizId
            ? (asgReadJSON(ASG_LEARNING_KEYS.quizCatalog, ASG_QUIZ_CATALOG).find((quiz) => quiz.id === left.quizId) || {}).order || 9999
            : 9999;
        const rightQuizOrder = right.quizId
            ? (asgReadJSON(ASG_LEARNING_KEYS.quizCatalog, ASG_QUIZ_CATALOG).find((quiz) => quiz.id === right.quizId) || {}).order || 9999
            : 9999;
        if (leftQuizOrder !== rightQuizOrder) return leftQuizOrder - rightQuizOrder;

        const leftOrder = Number.isFinite(Number(left.order)) ? Number(left.order) : 9999;
        const rightOrder = Number.isFinite(Number(right.order)) ? Number(right.order) : 9999;
        if (leftOrder !== rightOrder) return leftOrder - rightOrder;
        return String(left.title || "").localeCompare(String(right.title || ""));
    });
}

function asgNormalizeQuizQuestion(question, index) {
    const options = Array.isArray(question.options) ? question.options : [];
    const quiz = asgGetQuizById(question.quizId || asgInferQuizId(question));

    return {
        id: question.id || asgCreateId("quiz"),
        quizId: quiz.id,
        title: String(question.title || `Question ${index + 1}`).trim(),
        topic: String(question.topic || quiz.topic).trim(),
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

function asgGetQuizQuestions(includeDrafts = false, quizId = "") {
    asgEnsureLearningData();
    const questions = asgReadJSON(ASG_LEARNING_KEYS.quizQuestions, []);
    const normalized = questions.map(asgNormalizeQuizQuestion);
    const statusFiltered = includeDrafts ? normalized : normalized.filter((question) => question.status === "active");
    const resolvedQuizId = quizId ? asgResolveQuizId(quizId) : "";
    const quizFiltered = resolvedQuizId
        ? statusFiltered.filter((question) => question.quizId === resolvedQuizId)
        : statusFiltered;

    return asgSortByOrder(quizFiltered);
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
    const quiz = asgGetQuizById(attempt.quizId || attempt.quizTitle || "python");
    const savedAttempt = {
        id: asgCreateId("attempt"),
        quizId: quiz.id,
        quizTitle: quiz.title,
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
        quizId: savedAttempt.quizId,
        quizTitle: savedAttempt.quizTitle,
        date: savedAttempt.submittedAt,
        userId: savedAttempt.userId,
        email: savedAttempt.email
    });
    asgWriteJSON("quizScores", legacyScores);

    return savedAttempt;
}

function asgGetQuizAttempts(user = null, quizId = "") {
    asgEnsureLearningData();
    const attempts = asgReadJSON(ASG_LEARNING_KEYS.quizAttempts, []);
    const resolvedQuizId = quizId ? asgResolveQuizId(quizId) : "";
    return attempts.filter((attempt) => {
        const matchesUser = !user || (
            String(attempt.userId || "") === String(user.id || "") ||
            String(attempt.email || "").toLowerCase() === String(user.email || "").toLowerCase()
        );
        const attemptQuizId = attempt.quizId || "python";
        const matchesQuiz = !resolvedQuizId || attemptQuizId === resolvedQuizId;
        return matchesUser && matchesQuiz;
    });
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
        prompt: String(challenge.prompt || ""),
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
        examType: String(submission.examType || ""),
        examId: String(submission.examId || ""),
        sessionId: String(submission.sessionId || ""),
        submissionReason: String(submission.submissionReason || "manual-run"),
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

function asgGetLearningUserKey(user) {
    if (!user) return "guest";
    return String(user.id || user.email || user.name || "guest").toLowerCase();
}

function asgNormalizeExamType(examType) {
    const value = String(examType || "").toLowerCase().trim();
    if (value.includes("coding")) return "coding-exam";
    return "quiz";
}

function asgNormalizeExamId(examId, fallback = "exam") {
    return asgSlugify(examId || fallback, fallback);
}

function asgGetExamAccessKey(user, examType, examId) {
    return [
        asgGetLearningUserKey(user),
        asgNormalizeExamType(examType),
        asgNormalizeExamId(examId, "exam")
    ].join("::").toLowerCase();
}

function asgGetExamAttempts(user = null, examType = "", examId = "") {
    asgEnsureLearningData();
    const attempts = asgReadJSON(ASG_LEARNING_KEYS.examAttempts, []);
    const normalizedType = examType ? asgNormalizeExamType(examType) : "";
    const normalizedId = examId ? asgNormalizeExamId(examId, "exam") : "";

    return attempts.filter((attempt) => {
        const matchesUser = !user || (
            String(attempt.userId || "") === String(user.id || "") ||
            String(attempt.email || "").toLowerCase() === String(user.email || "").toLowerCase()
        );
        const matchesType = !normalizedType || attempt.examType === normalizedType;
        const matchesExam = !normalizedId || attempt.examId === normalizedId;
        return matchesUser && matchesType && matchesExam;
    });
}

function asgGetExamRetakePermissions() {
    asgEnsureLearningData();
    return asgReadJSON(ASG_LEARNING_KEYS.examRetakePermissions, {});
}

function asgGetExamRetakePermission(user, examType, examId) {
    const permissions = asgGetExamRetakePermissions();
    const key = asgGetExamAccessKey(user, examType, examId);
    return permissions[key] || null;
}

function asgHasExamRetakeAccess(user, examType, examId) {
    const permission = asgGetExamRetakePermission(user, examType, examId);
    return Boolean(permission && permission.allowed && !permission.usedAt);
}

function asgCanStartExam(user, examType, examId) {
    if (!user || user.role === "admin") return true;
    return !asgGetExamAttempts(user, examType, examId).length || asgHasExamRetakeAccess(user, examType, examId);
}

function asgSaveExamRetakePermission(user, examType, examId, examTitle, allowed, note = "", admin = null) {
    asgEnsureLearningData();
    const permissions = asgReadJSON(ASG_LEARNING_KEYS.examRetakePermissions, {});
    const normalizedType = asgNormalizeExamType(examType);
    const normalizedId = asgNormalizeExamId(examId, "exam");
    const key = asgGetExamAccessKey(user, normalizedType, normalizedId);

    permissions[key] = {
        userId: user ? user.id || "" : "",
        email: user ? user.email || "" : "",
        name: user ? user.name || "" : "",
        examType: normalizedType,
        examId: normalizedId,
        examTitle: String(examTitle || normalizedId).trim(),
        allowed: Boolean(allowed),
        note: String(note || "").trim(),
        allowedAt: Boolean(allowed) ? new Date().toISOString() : "",
        usedAt: "",
        updatedAt: new Date().toISOString(),
        updatedBy: admin ? admin.email || admin.name || "Admin" : "Admin"
    };

    asgWriteJSON(ASG_LEARNING_KEYS.examRetakePermissions, permissions);
    return permissions[key];
}

function asgConsumeExamRetakePermission(user, examType, examId) {
    const permission = asgGetExamRetakePermission(user, examType, examId);
    if (!permission || !permission.allowed || permission.usedAt) return null;

    const permissions = asgReadJSON(ASG_LEARNING_KEYS.examRetakePermissions, {});
    const key = asgGetExamAccessKey(user, examType, examId);
    permissions[key] = {
        ...permission,
        allowed: false,
        usedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    asgWriteJSON(ASG_LEARNING_KEYS.examRetakePermissions, permissions);
    return permissions[key];
}

function asgSaveExamAttempt(attempt) {
    asgEnsureLearningData();
    const user = asgGetCurrentLearningUser();
    const normalizedType = asgNormalizeExamType(attempt.examType);
    const normalizedId = asgNormalizeExamId(attempt.examId, normalizedType);
    const attempts = asgReadJSON(ASG_LEARNING_KEYS.examAttempts, []);
    const savedAttempt = {
        id: asgCreateId("exam_attempt"),
        examType: normalizedType,
        examId: normalizedId,
        examTitle: String(attempt.examTitle || normalizedId).trim(),
        userId: user ? user.id : attempt.userId || null,
        studentName: user ? user.name : attempt.studentName || "Guest Student",
        email: user ? user.email : attempt.email || "",
        score: Number(attempt.score || 0),
        total: Number(attempt.total || 0),
        percentage: Number(attempt.percentage || 0),
        status: String(attempt.status || "submitted"),
        reason: String(attempt.reason || "manual-submit"),
        sessionId: String(attempt.sessionId || ""),
        details: attempt.details || {},
        submittedAt: attempt.submittedAt || new Date().toISOString()
    };

    attempts.push(savedAttempt);
    asgWriteJSON(ASG_LEARNING_KEYS.examAttempts, attempts);
    asgConsumeExamRetakePermission(user || attempt, normalizedType, normalizedId);
    return savedAttempt;
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

function asgGetCertificatePermissionKey(user) {
    if (!user) return "guest";
    return String(user.id || user.email || user.name || "guest").toLowerCase();
}

function asgGetCertificatePermissions() {
    asgEnsureLearningData();
    return asgReadJSON(ASG_LEARNING_KEYS.certificatePermissions, {});
}

function asgGetCertificatePermission(user) {
    const permissions = asgGetCertificatePermissions();
    if (!user) return null;

    const candidates = [
        user.id,
        user.email,
        asgGetCertificatePermissionKey(user)
    ].filter(Boolean).map((value) => String(value).toLowerCase());

    for (const key of candidates) {
        if (permissions[key]) return permissions[key];
    }

    return null;
}

function asgCanDownloadCertificate(user) {
    const permission = asgGetCertificatePermission(user);
    return Boolean(permission && permission.allowed);
}

function asgSaveCertificatePermission(user, allowed, note = "", admin = null) {
    asgEnsureLearningData();
    const permissions = asgReadJSON(ASG_LEARNING_KEYS.certificatePermissions, {});
    const key = asgGetCertificatePermissionKey(user);
    permissions[key] = {
        userId: user ? user.id || "" : "",
        email: user ? user.email || "" : "",
        name: user ? user.name || "" : "",
        allowed: Boolean(allowed),
        note: String(note || "").trim(),
        updatedAt: new Date().toISOString(),
        updatedBy: admin ? admin.email || admin.name || "Admin" : "Admin"
    };
    asgWriteJSON(ASG_LEARNING_KEYS.certificatePermissions, permissions);
    return permissions[key];
}

function asgSaveCertificateRecord(record) {
    const savedRecord = {
        id: record.id || asgCreateId("certificate"),
        name: String(record.name || "").trim(),
        email: String(record.email || "").trim(),
        userId: record.userId || "",
        certificateId: record.certificateId || `ASG-${Date.now()}`,
        course: record.course || "Data Science & Machine Learning",
        date: record.date || new Date().toISOString(),
        downloadAllowed: Boolean(record.downloadAllowed)
    };

    const certs = asgReadJSON("certificates", []);
    certs.push(savedRecord);
    asgWriteJSON("certificates", certs);

    if (savedRecord.userId) {
        const personalKey = `certificates_${savedRecord.userId}`;
        const personalCerts = asgReadJSON(personalKey, []);
        personalCerts.push(savedRecord);
        asgWriteJSON(personalKey, personalCerts);
    }

    return savedRecord;
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
    const examAttempts = asgGetExamAttempts(user);
    const completedChallengeIds = new Set(
        codingSubmissions
            .filter((submission) => submission.total > 0 && submission.passed === submission.total)
            .map((submission) => submission.challengeId)
    );
    const latestQuiz = asgGetLatestRecord(quizAttempts, "submittedAt");
    const latestCoding = asgGetLatestRecord(codingSubmissions, "submittedAt");
    const latestExam = asgGetLatestRecord(examAttempts, "submittedAt");
    const dates = [
        latestQuiz && latestQuiz.submittedAt,
        latestCoding && latestCoding.submittedAt,
        latestExam && latestExam.submittedAt,
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
        examAttempts: examAttempts.length,
        latestExam,
        bestExam: asgGetBestPercentage(examAttempts),
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

function asgNormalizeTopic(topic, index) {
    const title = String(topic.title || `Topic ${index + 1}`).trim();
    return {
        id: asgSlugify(topic.id || title, "topic"),
        title,
        content: String(topic.content || `<h2>${title}</h2><p>Add lesson content from the admin dashboard.</p>`),
        contentType: topic.contentType === "pdf" ? "pdf" : "html",
        contentFileName: String(topic.contentFileName || "").trim(),
        contentDataUrl: String(topic.contentDataUrl || ""),
        quizHtml: String(topic.quizHtml || `<h2>${title} Quiz</h2><p>Add quiz content from the admin dashboard.</p>`),
        quizFileName: String(topic.quizFileName || "").trim(),
        quizRenderMode: topic.quizRenderMode === "iframe" ? "iframe" : "auto",
        videoUrl: String(topic.videoUrl || "").trim(),
        order: Number.isFinite(Number(topic.order)) ? Number(topic.order) : index + 1,
        status: topic.status === "draft" ? "draft" : "active",
        updatedAt: topic.updatedAt || new Date().toISOString()
    };
}

function asgNormalizeCourse(course, index) {
    const title = String(course.title || `Course ${index + 1}`).trim();
    const topics = Array.isArray(course.topics) ? course.topics.map(asgNormalizeTopic) : [];
    return {
        id: asgSlugify(course.id || title, "course"),
        title,
        summary: String(course.summary || "Course lessons and practice.").trim(),
        icon: String(course.icon || title.slice(0, 2).toUpperCase()).slice(0, 4),
        price: String(course.price || "FREE").trim(),
        status: course.status === "draft" ? "draft" : "active",
        welcome: String(course.welcome || `Welcome to ${title}.`).trim(),
        cheatSheet: String(course.cheatSheet || "Add the course cheat sheet from the admin dashboard.").trim(),
        topics: asgSortByOrder(topics),
        order: Number.isFinite(Number(course.order)) ? Number(course.order) : index + 1,
        updatedAt: course.updatedAt || new Date().toISOString()
    };
}

function asgGetCourses(includeDrafts = false) {
    asgEnsureLearningData();
    const courses = asgReadJSON(ASG_LEARNING_KEYS.courses, []);
    const normalized = courses.map(asgNormalizeCourse);
    return asgSortByOrder(includeDrafts ? normalized : normalized.filter((course) => course.status === "active"));
}

function asgSaveCourses(courses) {
    const normalized = courses.map(asgNormalizeCourse);
    asgWriteJSON(ASG_LEARNING_KEYS.courses, asgSortByOrder(normalized));
}

function asgNormalizeList(value) {
    if (Array.isArray(value)) {
        return value.map((item) => String(item || "").trim()).filter(Boolean);
    }
    return String(value || "")
        .split(/\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function asgNormalizeRoadmapItem(item, index) {
    const title = String(item.title || `Roadmap Step ${index + 1}`).trim();
    return {
        id: asgSlugify(item.id || title, "roadmap"),
        stage: String(item.stage || "Learning Stage").trim(),
        title,
        duration: String(item.duration || "Flexible").trim(),
        focus: String(item.focus || item.description || "Add the learning focus from admin.").trim(),
        outcomes: asgNormalizeList(item.outcomes || item.skills),
        videoUrl: String(item.videoUrl || "").trim(),
        resourceUrl: String(item.resourceUrl || "").trim(),
        status: item.status === "draft" ? "draft" : "active",
        order: Number.isFinite(Number(item.order)) ? Number(item.order) : index + 1,
        updatedAt: item.updatedAt || new Date().toISOString()
    };
}

function asgGetRoadmapItems(includeDrafts = false) {
    asgEnsureLearningData();
    const items = asgReadJSON(ASG_LEARNING_KEYS.roadmapItems, []);
    const normalized = items.map(asgNormalizeRoadmapItem);
    return asgSortByOrder(includeDrafts ? normalized : normalized.filter((item) => item.status === "active"));
}

function asgSaveRoadmapItems(items) {
    const normalized = items.map(asgNormalizeRoadmapItem);
    asgWriteJSON(ASG_LEARNING_KEYS.roadmapItems, asgSortByOrder(normalized));
}

function asgNormalizeVideoItem(item, index) {
    const title = String(item.title || `Video ${index + 1}`).trim();
    return {
        id: asgSlugify(item.id || title, "video"),
        title,
        category: String(item.category || "Learning").trim(),
        level: String(item.level || "Beginner").trim(),
        duration: String(item.duration || "Self-paced").trim(),
        description: String(item.description || "Add the video description from admin.").trim(),
        url: String(item.url || "").trim(),
        status: item.status === "draft" ? "draft" : "active",
        order: Number.isFinite(Number(item.order)) ? Number(item.order) : index + 1,
        updatedAt: item.updatedAt || new Date().toISOString()
    };
}

function asgGetVideoLibrary(includeDrafts = false) {
    asgEnsureLearningData();
    const items = asgReadJSON(ASG_LEARNING_KEYS.videoLibrary, []);
    const normalized = items.map(asgNormalizeVideoItem);
    return asgSortByOrder(includeDrafts ? normalized : normalized.filter((item) => item.status === "active"));
}

function asgSaveVideoLibrary(items) {
    const normalized = items.map(asgNormalizeVideoItem);
    asgWriteJSON(ASG_LEARNING_KEYS.videoLibrary, asgSortByOrder(normalized));
}

function asgNormalizeResourceItem(item, index) {
    const title = String(item.title || `Resource ${index + 1}`).trim();
    return {
        id: asgSlugify(item.id || title, "resource"),
        title,
        category: String(item.category || "Learning").trim(),
        format: String(item.format || "Guide").trim(),
        description: String(item.description || "Add the resource description from admin.").trim(),
        url: String(item.url || "").trim(),
        actionLabel: String(item.actionLabel || "Open Resource").trim(),
        status: item.status === "draft" ? "draft" : "active",
        order: Number.isFinite(Number(item.order)) ? Number(item.order) : index + 1,
        updatedAt: item.updatedAt || new Date().toISOString()
    };
}

function asgGetResourceLibrary(includeDrafts = false) {
    asgEnsureLearningData();
    const items = asgReadJSON(ASG_LEARNING_KEYS.resourceLibrary, []);
    const normalized = items.map(asgNormalizeResourceItem);
    return asgSortByOrder(includeDrafts ? normalized : normalized.filter((item) => item.status === "active"));
}

function asgSaveResourceLibrary(items) {
    const normalized = items.map(asgNormalizeResourceItem);
    asgWriteJSON(ASG_LEARNING_KEYS.resourceLibrary, asgSortByOrder(normalized));
}

function asgGetCourseById(courseId, includeDrafts = false) {
    const courses = asgGetCourses(includeDrafts);
    const resolvedId = asgSlugify(courseId, "course");
    return courses.find((course) => course.id === resolvedId) || courses[0] || null;
}

function asgGetTopicById(courseId, topicId, includeDrafts = false) {
    const course = asgGetCourseById(courseId, includeDrafts);
    if (!course) return null;
    const resolvedTopicId = asgSlugify(topicId, "topic");
    const topics = includeDrafts ? course.topics : course.topics.filter((topic) => topic.status === "active");
    return topics.find((topic) => topic.id === resolvedTopicId) || topics[0] || null;
}

asgEnsureLearningData();
