// Public ASG Tech learning-data fallback snapshot.
// Supabase is the primary shared backend. This snapshot keeps GitHub Pages useful when the cloud table is empty.
export const ASG_PUBLISHED_LEARNING_DATA: any = {
    "version": 1779615614165,
    "publishedAt": "2026-05-24T09:40:14.165Z",
    "data": {
        "quizCatalog": [
            {
                "id": "python",
                "title": "Quiz 1: Python",
                "topic": "Python",
                "description": "Core Python syntax, functions, and language behavior.",
                "order": 1,
                "status": "active"
            },
            {
                "id": "machine-learning",
                "title": "Quiz 2: Machine Learning",
                "topic": "Machine Learning",
                "description": "Models, training workflow, and evaluation fundamentals.",
                "order": 2,
                "status": "active"
            },
            {
                "id": "pandas",
                "title": "Quiz 3: Pandas",
                "topic": "Pandas",
                "description": "DataFrame operations, cleaning, and analysis basics.",
                "order": 3,
                "status": "active"
            },
            {
                "id": "numpy",
                "title": "Quiz 4: NumPy",
                "topic": "NumPy",
                "description": "Arrays, shapes, vectorization, and numerical operations.",
                "order": 4,
                "status": "active"
            },
            {
                "id": "deep-learning",
                "title": "Quiz 5: Deep Learning",
                "topic": "Deep Learning",
                "description": "Neural networks, layers, activation, and training concepts.",
                "order": 5,
                "status": "active"
            },
            {
                "id": "sql",
                "title": "Quiz 6: SQL",
                "topic": "SQL",
                "description": "Queries, filters, joins, grouping, and database basics.",
                "order": 6,
                "status": "active"
            }
        ],
        "quizQuestions": [
            {
                "id": "quiz_python_function_keyword",
                "quizId": "python",
                "title": "Python Functions",
                "topic": "Python",
                "difficulty": "Beginner",
                "prompt": "Which keyword is used to define a reusable function in Python?",
                "options": [
                    {
                        "id": "a",
                        "text": "func"
                    },
                    {
                        "id": "b",
                        "text": "def"
                    },
                    {
                        "id": "c",
                        "text": "function"
                    },
                    {
                        "id": "d",
                        "text": "lambda only"
                    }
                ],
                "correctOption": "b",
                "explanation": "Python uses def to define a named function.",
                "status": "active",
                "order": 1,
                "updatedAt": "2026-05-24T09:40:14.158Z"
            },
            {
                "id": "quiz_python_mutable_type",
                "quizId": "python",
                "title": "Mutable Data Types",
                "topic": "Python",
                "difficulty": "Beginner",
                "prompt": "Which Python data type is mutable?",
                "options": [
                    {
                        "id": "a",
                        "text": "tuple"
                    },
                    {
                        "id": "b",
                        "text": "string"
                    },
                    {
                        "id": "c",
                        "text": "list"
                    },
                    {
                        "id": "d",
                        "text": "integer"
                    }
                ],
                "correctOption": "c",
                "explanation": "Lists can be changed after creation, while tuples and strings cannot.",
                "status": "active",
                "order": 2,
                "updatedAt": "2026-05-24T09:40:14.158Z"
            },
            {
                "id": "quiz_python_exception",
                "quizId": "python",
                "title": "Exception Handling",
                "topic": "Python",
                "difficulty": "Beginner",
                "prompt": "Which block handles an error raised inside a try block?",
                "options": [
                    {
                        "id": "a",
                        "text": "except"
                    },
                    {
                        "id": "b",
                        "text": "catch"
                    },
                    {
                        "id": "c",
                        "text": "error"
                    },
                    {
                        "id": "d",
                        "text": "rescue"
                    }
                ],
                "correctOption": "a",
                "explanation": "Python uses except blocks to handle exceptions.",
                "status": "active",
                "order": 3,
                "updatedAt": "2026-05-24T09:40:14.158Z"
            },
            {
                "id": "quiz_classification_model",
                "quizId": "machine-learning",
                "title": "Classification",
                "topic": "Machine Learning",
                "difficulty": "Beginner",
                "prompt": "Which model family is commonly used for classification problems?",
                "options": [
                    {
                        "id": "a",
                        "text": "Linear Regression"
                    },
                    {
                        "id": "b",
                        "text": "Random Forest"
                    },
                    {
                        "id": "c",
                        "text": "K-Means Clustering"
                    },
                    {
                        "id": "d",
                        "text": "Moving Average"
                    }
                ],
                "correctOption": "b",
                "explanation": "Random Forest can be used for classification and regression tasks.",
                "status": "active",
                "order": 1,
                "updatedAt": "2026-05-24T09:40:14.158Z"
            },
            {
                "id": "quiz_ml_supervised_learning",
                "quizId": "machine-learning",
                "title": "Supervised Learning",
                "topic": "Machine Learning",
                "difficulty": "Beginner",
                "prompt": "What is required for supervised learning?",
                "options": [
                    {
                        "id": "a",
                        "text": "Only unlabeled raw data"
                    },
                    {
                        "id": "b",
                        "text": "Labeled input-output examples"
                    },
                    {
                        "id": "c",
                        "text": "No training data"
                    },
                    {
                        "id": "d",
                        "text": "Only images"
                    }
                ],
                "correctOption": "b",
                "explanation": "Supervised learning trains from examples that include the expected answer.",
                "status": "active",
                "order": 2,
                "updatedAt": "2026-05-24T09:40:14.158Z"
            },
            {
                "id": "quiz_overfitting",
                "quizId": "machine-learning",
                "title": "Model Quality",
                "topic": "Machine Learning",
                "difficulty": "Intermediate",
                "prompt": "What does overfitting usually mean?",
                "options": [
                    {
                        "id": "a",
                        "text": "The model performs well on training data but poorly on new data."
                    },
                    {
                        "id": "b",
                        "text": "The model performs poorly on every dataset."
                    },
                    {
                        "id": "c",
                        "text": "The model is too small to learn patterns."
                    },
                    {
                        "id": "d",
                        "text": "The model has no features."
                    }
                ],
                "correctOption": "a",
                "explanation": "Overfitting means the model memorized training data and generalizes poorly.",
                "status": "active",
                "order": 3,
                "updatedAt": "2026-05-24T09:40:14.158Z"
            },
            {
                "id": "quiz_python_import",
                "quizId": "pandas",
                "title": "Pandas Import Alias",
                "topic": "Pandas",
                "difficulty": "Beginner",
                "prompt": "What is the professional shortcut commonly used to import Pandas?",
                "options": [
                    {
                        "id": "a",
                        "text": "import pandas"
                    },
                    {
                        "id": "b",
                        "text": "import pandas as pd"
                    },
                    {
                        "id": "c",
                        "text": "include pandas"
                    },
                    {
                        "id": "d",
                        "text": "using pandas"
                    }
                ],
                "correctOption": "b",
                "explanation": "Most Python data projects import Pandas with the pd alias.",
                "status": "active",
                "order": 1,
                "updatedAt": "2026-05-24T09:40:14.158Z"
            },
            {
                "id": "quiz_pandas_dataframe_shape",
                "quizId": "pandas",
                "title": "DataFrame Shape",
                "topic": "Pandas",
                "difficulty": "Beginner",
                "prompt": "What does df.shape return in Pandas?",
                "options": [
                    {
                        "id": "a",
                        "text": "Column names only"
                    },
                    {
                        "id": "b",
                        "text": "A tuple with rows and columns"
                    },
                    {
                        "id": "c",
                        "text": "Only missing values"
                    },
                    {
                        "id": "d",
                        "text": "A sorted DataFrame"
                    }
                ],
                "correctOption": "b",
                "explanation": "df.shape returns a tuple such as (rows, columns).",
                "status": "active",
                "order": 2,
                "updatedAt": "2026-05-24T09:40:14.158Z"
            },
            {
                "id": "quiz_pandas_missing_values",
                "quizId": "pandas",
                "title": "Missing Values",
                "topic": "Pandas",
                "difficulty": "Intermediate",
                "prompt": "Which Pandas method is commonly used to detect missing values?",
                "options": [
                    {
                        "id": "a",
                        "text": "isnull()"
                    },
                    {
                        "id": "b",
                        "text": "missing()"
                    },
                    {
                        "id": "c",
                        "text": "empty_only()"
                    },
                    {
                        "id": "d",
                        "text": "find_blank()"
                    }
                ],
                "correctOption": "a",
                "explanation": "isnull() identifies missing values in Series and DataFrames.",
                "status": "active",
                "order": 3,
                "updatedAt": "2026-05-24T09:40:14.158Z"
            },
            {
                "id": "quiz_numpy_array_object",
                "quizId": "numpy",
                "title": "NumPy Arrays",
                "topic": "NumPy",
                "difficulty": "Beginner",
                "prompt": "Which object is the core container for numerical data in NumPy?",
                "options": [
                    {
                        "id": "a",
                        "text": "DataFrame"
                    },
                    {
                        "id": "b",
                        "text": "ndarray"
                    },
                    {
                        "id": "c",
                        "text": "Workbook"
                    },
                    {
                        "id": "d",
                        "text": "SeriesGroup"
                    }
                ],
                "correctOption": "b",
                "explanation": "NumPy's ndarray stores fast multidimensional numerical arrays.",
                "status": "active",
                "order": 1,
                "updatedAt": "2026-05-24T09:40:14.158Z"
            },
            {
                "id": "quiz_numpy_vectorized_ops",
                "quizId": "numpy",
                "title": "Vectorization",
                "topic": "NumPy",
                "difficulty": "Intermediate",
                "prompt": "Why are vectorized NumPy operations usually preferred over Python loops?",
                "options": [
                    {
                        "id": "a",
                        "text": "They are often faster and more concise."
                    },
                    {
                        "id": "b",
                        "text": "They disable arrays."
                    },
                    {
                        "id": "c",
                        "text": "They work only with strings."
                    },
                    {
                        "id": "d",
                        "text": "They require no memory."
                    }
                ],
                "correctOption": "a",
                "explanation": "Vectorized operations use optimized array routines and reduce manual loop code.",
                "status": "active",
                "order": 2,
                "updatedAt": "2026-05-24T09:40:14.158Z"
            },
            {
                "id": "quiz_numpy_shape",
                "quizId": "numpy",
                "title": "Array Shape",
                "topic": "NumPy",
                "difficulty": "Beginner",
                "prompt": "What does the shape attribute describe?",
                "options": [
                    {
                        "id": "a",
                        "text": "The size of each dimension"
                    },
                    {
                        "id": "b",
                        "text": "Only the data type"
                    },
                    {
                        "id": "c",
                        "text": "Only the first value"
                    },
                    {
                        "id": "d",
                        "text": "The file path"
                    }
                ],
                "correctOption": "a",
                "explanation": "shape tells you how many elements exist along each array dimension.",
                "status": "active",
                "order": 3,
                "updatedAt": "2026-05-24T09:40:14.158Z"
            },
            {
                "id": "quiz_cnn_name",
                "quizId": "deep-learning",
                "title": "CNN Basics",
                "topic": "Deep Learning",
                "difficulty": "Intermediate",
                "prompt": "What does CNN stand for in deep learning?",
                "options": [
                    {
                        "id": "a",
                        "text": "Convolutional Neural Network"
                    },
                    {
                        "id": "b",
                        "text": "Computer Neural Network"
                    },
                    {
                        "id": "c",
                        "text": "Complex Numeric Network"
                    },
                    {
                        "id": "d",
                        "text": "Central Network Node"
                    }
                ],
                "correctOption": "a",
                "explanation": "A CNN is a Convolutional Neural Network, often used for image tasks.",
                "status": "active",
                "order": 1,
                "updatedAt": "2026-05-24T09:40:14.158Z"
            },
            {
                "id": "quiz_deep_learning_activation",
                "quizId": "deep-learning",
                "title": "Activation Functions",
                "topic": "Deep Learning",
                "difficulty": "Beginner",
                "prompt": "What is the role of an activation function in a neural network?",
                "options": [
                    {
                        "id": "a",
                        "text": "It adds non-linearity to the model."
                    },
                    {
                        "id": "b",
                        "text": "It deletes all weights."
                    },
                    {
                        "id": "c",
                        "text": "It stores CSV files."
                    },
                    {
                        "id": "d",
                        "text": "It replaces training data."
                    }
                ],
                "correctOption": "a",
                "explanation": "Activation functions help neural networks learn non-linear patterns.",
                "status": "active",
                "order": 2,
                "updatedAt": "2026-05-24T09:40:14.158Z"
            },
            {
                "id": "quiz_deep_learning_backprop",
                "quizId": "deep-learning",
                "title": "Backpropagation",
                "topic": "Deep Learning",
                "difficulty": "Intermediate",
                "prompt": "What does backpropagation help calculate during training?",
                "options": [
                    {
                        "id": "a",
                        "text": "Gradients for updating weights"
                    },
                    {
                        "id": "b",
                        "text": "The website URL"
                    },
                    {
                        "id": "c",
                        "text": "Random column names"
                    },
                    {
                        "id": "d",
                        "text": "Only the final prediction label"
                    }
                ],
                "correctOption": "a",
                "explanation": "Backpropagation calculates gradients so optimizers can update model weights.",
                "status": "active",
                "order": 3,
                "updatedAt": "2026-05-24T09:40:14.159Z"
            },
            {
                "id": "quiz_sql_select",
                "quizId": "sql",
                "title": "Select Rows",
                "topic": "SQL",
                "difficulty": "Beginner",
                "prompt": "Which SQL statement reads all columns from a table named students?",
                "options": [
                    {
                        "id": "a",
                        "text": "SELECT * FROM students;"
                    },
                    {
                        "id": "b",
                        "text": "READ students ALL;"
                    },
                    {
                        "id": "c",
                        "text": "GET * students;"
                    },
                    {
                        "id": "d",
                        "text": "OPEN TABLE students;"
                    }
                ],
                "correctOption": "a",
                "explanation": "SELECT * FROM table_name reads every column from that table.",
                "status": "active",
                "order": 1,
                "updatedAt": "2026-05-24T09:40:14.159Z"
            },
            {
                "id": "quiz_sql_where",
                "quizId": "sql",
                "title": "Filtering Rows",
                "topic": "SQL",
                "difficulty": "Beginner",
                "prompt": "Which clause filters rows in a SQL query?",
                "options": [
                    {
                        "id": "a",
                        "text": "WHERE"
                    },
                    {
                        "id": "b",
                        "text": "FILTER BY"
                    },
                    {
                        "id": "c",
                        "text": "ONLY"
                    },
                    {
                        "id": "d",
                        "text": "PICK"
                    }
                ],
                "correctOption": "a",
                "explanation": "WHERE is used to return only rows matching a condition.",
                "status": "active",
                "order": 2,
                "updatedAt": "2026-05-24T09:40:14.159Z"
            }
        ],
        "codingChallenges": [
            {
                "id": "practice_sum_two",
                "title": "Sum of Two Numbers",
                "topic": "Python Basics",
                "scope": "global",
                "courseId": "",
                "courseTitle": "",
                "topicId": "",
                "topicTitle": "",
                "difficulty": "Beginner",
                "prompt": "Create a function named solution that returns the sum of two numbers.",
                "starterCode": "def solution(a, b):\n    # return the sum of a and b\n    pass\n",
                "tests": [
                    {
                        "args": [
                            3,
                            5
                        ],
                        "expected": 8
                    },
                    {
                        "args": [
                            10,
                            20
                        ],
                        "expected": 30
                    },
                    {
                        "args": [
                            -5,
                            7
                        ],
                        "expected": 2
                    }
                ],
                "status": "active",
                "order": 1,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "practice_even_odd",
                "title": "Even or Odd",
                "topic": "Conditionals",
                "scope": "global",
                "courseId": "",
                "courseTitle": "",
                "topicId": "",
                "topicTitle": "",
                "difficulty": "Beginner",
                "prompt": "Create a function named solution that returns 'Even' for even numbers and 'Odd' for odd numbers.",
                "starterCode": "def solution(number):\n    # use indentation under the if and else blocks\n    pass\n",
                "tests": [
                    {
                        "args": [
                            4
                        ],
                        "expected": "Even"
                    },
                    {
                        "args": [
                            7
                        ],
                        "expected": "Odd"
                    },
                    {
                        "args": [
                            0
                        ],
                        "expected": "Even"
                    }
                ],
                "status": "active",
                "order": 2,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "practice_maximum_list",
                "title": "Maximum in a List",
                "topic": "Lists",
                "scope": "global",
                "courseId": "",
                "courseTitle": "",
                "topicId": "",
                "topicTitle": "",
                "difficulty": "Beginner",
                "prompt": "Create a function named solution that returns the largest number from a list.",
                "starterCode": "def solution(numbers):\n    biggest = numbers[0]\n    for number in numbers:\n        # update biggest when needed\n        pass\n    return biggest\n",
                "tests": [
                    {
                        "args": [
                            [
                                5,
                                10,
                                3
                            ]
                        ],
                        "expected": 10
                    },
                    {
                        "args": [
                            [
                                100,
                                50,
                                75
                            ]
                        ],
                        "expected": 100
                    },
                    {
                        "args": [
                            [
                                -1,
                                -5,
                                -3
                            ]
                        ],
                        "expected": -1
                    }
                ],
                "status": "active",
                "order": 3,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "practice_count_vowels",
                "title": "Count Vowels in a String",
                "topic": "Strings",
                "scope": "global",
                "courseId": "",
                "courseTitle": "",
                "topicId": "",
                "topicTitle": "",
                "difficulty": "Beginner",
                "prompt": "Create a function named solution that returns the number of vowels in a string. Count both uppercase and lowercase vowels.",
                "starterCode": "def solution(text):\n    vowels = \"aeiouAEIOU\"\n    count = 0\n    # count every vowel in text\n    pass\n",
                "tests": [
                    {
                        "args": [
                            "hello"
                        ],
                        "expected": 2
                    },
                    {
                        "args": [
                            "PYTHON"
                        ],
                        "expected": 1
                    },
                    {
                        "args": [
                            "Education"
                        ],
                        "expected": 5
                    }
                ],
                "status": "active",
                "order": 4,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "practice_tuple_second_largest",
                "title": "Second Largest in a Tuple",
                "topic": "Tuples",
                "scope": "global",
                "courseId": "",
                "courseTitle": "",
                "topicId": "",
                "topicTitle": "",
                "difficulty": "Beginner",
                "prompt": "Create a function named solution that returns the second largest unique number from a tuple.",
                "starterCode": "def solution(numbers):\n    numbers = tuple(numbers)\n    # return the second largest unique value\n    pass\n",
                "tests": [
                    {
                        "args": [
                            [
                                4,
                                9,
                                1,
                                9,
                                7
                            ]
                        ],
                        "expected": 7
                    },
                    {
                        "args": [
                            [
                                10,
                                5,
                                8,
                                3
                            ]
                        ],
                        "expected": 8
                    },
                    {
                        "args": [
                            [
                                -2,
                                -5,
                                -1,
                                -3
                            ]
                        ],
                        "expected": -2
                    }
                ],
                "status": "active",
                "order": 5,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "practice_dictionary_top_score",
                "title": "Top Student from a Dictionary",
                "topic": "Dictionaries",
                "scope": "global",
                "courseId": "",
                "courseTitle": "",
                "topicId": "",
                "topicTitle": "",
                "difficulty": "Beginner",
                "prompt": "Create a function named solution that receives a dictionary of student scores and returns the name with the highest score.",
                "starterCode": "def solution(scores):\n    # scores is a dictionary like {\"Asha\": 91, \"Ravi\": 87}\n    pass\n",
                "tests": [
                    {
                        "args": [
                            {
                                "Asha": 91,
                                "Ravi": 87,
                                "Meera": 94
                            }
                        ],
                        "expected": "Meera"
                    },
                    {
                        "args": [
                            {
                                "A": 10,
                                "B": 25,
                                "C": 15
                            }
                        ],
                        "expected": "B"
                    },
                    {
                        "args": [
                            {
                                "Nina": -1,
                                "Omar": -3
                            }
                        ],
                        "expected": "Nina"
                    }
                ],
                "status": "active",
                "order": 6,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "practice_class_bank_account",
                "title": "Bank Account Class",
                "topic": "Classes",
                "scope": "global",
                "courseId": "",
                "courseTitle": "",
                "topicId": "",
                "topicTitle": "",
                "difficulty": "Intermediate",
                "prompt": "Create a function named solution that creates a BankAccount class with deposit and get_balance methods, then returns the balance after depositing the given amount.",
                "starterCode": "def solution(starting_balance, deposit_amount):\n    class BankAccount:\n        def __init__(self, balance):\n            self.balance = balance\n\n        # add deposit and get_balance methods\n\n    account = BankAccount(starting_balance)\n    # deposit the amount and return the balance\n    pass\n",
                "tests": [
                    {
                        "args": [
                            100,
                            50
                        ],
                        "expected": 150
                    },
                    {
                        "args": [
                            0,
                            25
                        ],
                        "expected": 25
                    },
                    {
                        "args": [
                            250,
                            125
                        ],
                        "expected": 375
                    }
                ],
                "status": "active",
                "order": 7,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "practice_inheritance_vehicle",
                "title": "Class Inheritance",
                "topic": "Class Inheritance",
                "scope": "global",
                "courseId": "",
                "courseTitle": "",
                "topicId": "",
                "topicTitle": "",
                "difficulty": "Intermediate",
                "prompt": "Create a function named solution that defines a Vehicle parent class and a Car child class. Return the string produced by the child class for the given brand.",
                "starterCode": "def solution(brand):\n    class Vehicle:\n        def __init__(self, brand):\n            self.brand = brand\n\n        def info(self):\n            return self.brand\n\n    class Car(Vehicle):\n        # inherit from Vehicle and return '<brand> car'\n        pass\n\n    vehicle = Car(brand)\n    return vehicle.info()\n",
                "tests": [
                    {
                        "args": [
                            "Toyota"
                        ],
                        "expected": "Toyota car"
                    },
                    {
                        "args": [
                            "Honda"
                        ],
                        "expected": "Honda car"
                    },
                    {
                        "args": [
                            "Tata"
                        ],
                        "expected": "Tata car"
                    }
                ],
                "status": "active",
                "order": 8,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "practice_polymorphism_shapes",
                "title": "Polymorphism with Shapes",
                "topic": "Polymorphism",
                "scope": "global",
                "courseId": "",
                "courseTitle": "",
                "topicId": "",
                "topicTitle": "",
                "difficulty": "Intermediate",
                "prompt": "Create a function named solution that builds Circle and Square objects with a common area method, then returns their areas in a list.",
                "starterCode": "def solution(radius, side):\n    class Circle:\n        def __init__(self, radius):\n            self.radius = radius\n\n        def area(self):\n            return 3.14 * self.radius * self.radius\n\n    class Square:\n        def __init__(self, side):\n            self.side = side\n\n        # add an area method\n\n    shapes = [Circle(radius), Square(side)]\n    # return a list of each shape area\n    pass\n",
                "tests": [
                    {
                        "args": [
                            2,
                            3
                        ],
                        "expected": [
                            12.56,
                            9
                        ]
                    },
                    {
                        "args": [
                            1,
                            4
                        ],
                        "expected": [
                            3.14,
                            16
                        ]
                    },
                    {
                        "args": [
                            3,
                            5
                        ],
                        "expected": [
                            28.26,
                            25
                        ]
                    }
                ],
                "status": "active",
                "order": 9,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "practice_method_overriding_employee",
                "title": "Method Overriding",
                "topic": "Method Overriding",
                "scope": "global",
                "courseId": "",
                "courseTitle": "",
                "topicId": "",
                "topicTitle": "",
                "difficulty": "Intermediate",
                "prompt": "Create a function named solution that defines an Employee class and a Manager class that overrides the role method. Return the manager role text.",
                "starterCode": "def solution(name):\n    class Employee:\n        def __init__(self, name):\n            self.name = name\n\n        def role(self):\n            return self.name + \" is an employee\"\n\n    class Manager(Employee):\n        # override role to return '<name> is a manager'\n        pass\n\n    person = Manager(name)\n    return person.role()\n",
                "tests": [
                    {
                        "args": [
                            "Asha"
                        ],
                        "expected": "Asha is a manager"
                    },
                    {
                        "args": [
                            "Ravi"
                        ],
                        "expected": "Ravi is a manager"
                    },
                    {
                        "args": [
                            "Meera"
                        ],
                        "expected": "Meera is a manager"
                    }
                ],
                "status": "active",
                "order": 10,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "exam_python_palindrome",
                "title": "Palindrome Check",
                "topic": "Python",
                "scope": "global",
                "courseId": "",
                "courseTitle": "",
                "topicId": "",
                "topicTitle": "",
                "difficulty": "Beginner",
                "prompt": "Create a function named solution that returns True when a word reads the same forward and backward.",
                "starterCode": "def solution(text):\n    # return True if text is a palindrome\n    pass\n",
                "tests": [
                    {
                        "args": [
                            "madam"
                        ],
                        "expected": true
                    },
                    {
                        "args": [
                            "python"
                        ],
                        "expected": false
                    },
                    {
                        "args": [
                            "level"
                        ],
                        "expected": true
                    }
                ],
                "status": "active",
                "order": 11,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "exam_python_unique_values",
                "title": "Unique Values",
                "topic": "Python",
                "scope": "global",
                "courseId": "",
                "courseTitle": "",
                "topicId": "",
                "topicTitle": "",
                "difficulty": "Beginner",
                "prompt": "Create a function named solution that returns the sorted unique values from a list.",
                "starterCode": "def solution(values):\n    # return sorted unique values\n    pass\n",
                "tests": [
                    {
                        "args": [
                            [
                                3,
                                1,
                                3,
                                2
                            ]
                        ],
                        "expected": [
                            1,
                            2,
                            3
                        ]
                    },
                    {
                        "args": [
                            [
                                "b",
                                "a",
                                "b"
                            ]
                        ],
                        "expected": [
                            "a",
                            "b"
                        ]
                    },
                    {
                        "args": [
                            [
                                5,
                                5,
                                5
                            ]
                        ],
                        "expected": [
                            5
                        ]
                    }
                ],
                "status": "active",
                "order": 12,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "exam_ml_accuracy",
                "title": "Classification Accuracy",
                "topic": "Machine Learning",
                "scope": "global",
                "courseId": "",
                "courseTitle": "",
                "topicId": "",
                "topicTitle": "",
                "difficulty": "Intermediate",
                "prompt": "Create a function named solution that receives two lists, y_true and y_pred, and returns accuracy rounded to two decimals.",
                "starterCode": "def solution(y_true, y_pred):\n    # return correct predictions / total predictions, rounded to 2 decimals\n    pass\n",
                "tests": [
                    {
                        "args": [
                            [
                                1,
                                0,
                                1
                            ],
                            [
                                1,
                                1,
                                1
                            ]
                        ],
                        "expected": 0.67
                    },
                    {
                        "args": [
                            [
                                "cat",
                                "dog"
                            ],
                            [
                                "cat",
                                "dog"
                            ]
                        ],
                        "expected": 1
                    },
                    {
                        "args": [
                            [
                                0,
                                0,
                                1,
                                1
                            ],
                            [
                                1,
                                0,
                                0,
                                1
                            ]
                        ],
                        "expected": 0.5
                    }
                ],
                "status": "active",
                "order": 13,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "exam_ml_train_test_split",
                "title": "Train Test Count",
                "topic": "Machine Learning",
                "scope": "global",
                "courseId": "",
                "courseTitle": "",
                "topicId": "",
                "topicTitle": "",
                "difficulty": "Beginner",
                "prompt": "Create a function named solution that returns the number of training rows after reserving test_percent percent for testing.",
                "starterCode": "def solution(total_rows, test_percent):\n    # return rows left for training after the test split\n    pass\n",
                "tests": [
                    {
                        "args": [
                            100,
                            20
                        ],
                        "expected": 80
                    },
                    {
                        "args": [
                            250,
                            30
                        ],
                        "expected": 175
                    },
                    {
                        "args": [
                            10,
                            50
                        ],
                        "expected": 5
                    }
                ],
                "status": "active",
                "order": 14,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "exam_pandas_column_total",
                "title": "Column Total",
                "topic": "Pandas",
                "scope": "global",
                "courseId": "",
                "courseTitle": "",
                "topicId": "",
                "topicTitle": "",
                "difficulty": "Beginner",
                "prompt": "Create a function named solution that receives table rows as dictionaries and returns the sum of one column.",
                "starterCode": "def solution(rows, column):\n    # rows is a list of dictionaries\n    pass\n",
                "tests": [
                    {
                        "args": [
                            [
                                {
                                    "sales": 10
                                },
                                {
                                    "sales": 15
                                }
                            ],
                            "sales"
                        ],
                        "expected": 25
                    },
                    {
                        "args": [
                            [
                                {
                                    "age": 20
                                },
                                {
                                    "age": 30
                                },
                                {
                                    "age": 25
                                }
                            ],
                            "age"
                        ],
                        "expected": 75
                    },
                    {
                        "args": [
                            [
                                {
                                    "qty": 2
                                },
                                {
                                    "qty": 8
                                }
                            ],
                            "qty"
                        ],
                        "expected": 10
                    }
                ],
                "status": "active",
                "order": 15,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "exam_pandas_filter_rows",
                "title": "Filter Rows",
                "topic": "Pandas",
                "scope": "global",
                "courseId": "",
                "courseTitle": "",
                "topicId": "",
                "topicTitle": "",
                "difficulty": "Intermediate",
                "prompt": "Create a function named solution that returns rows where the given column is greater than the threshold.",
                "starterCode": "def solution(rows, column, threshold):\n    # return matching dictionaries in their original order\n    pass\n",
                "tests": [
                    {
                        "args": [
                            [
                                {
                                    "score": 80
                                },
                                {
                                    "score": 45
                                }
                            ],
                            "score",
                            50
                        ],
                        "expected": [
                            {
                                "score": 80
                            }
                        ]
                    },
                    {
                        "args": [
                            [
                                {
                                    "x": 1
                                },
                                {
                                    "x": 3
                                },
                                {
                                    "x": 2
                                }
                            ],
                            "x",
                            1
                        ],
                        "expected": [
                            {
                                "x": 3
                            },
                            {
                                "x": 2
                            }
                        ]
                    },
                    {
                        "args": [
                            [
                                {
                                    "price": 99
                                },
                                {
                                    "price": 120
                                }
                            ],
                            "price",
                            100
                        ],
                        "expected": [
                            {
                                "price": 120
                            }
                        ]
                    }
                ],
                "status": "active",
                "order": 16,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            }
        ],
        "courses": [
            {
                "id": "python-for-beginners",
                "title": "Python for Beginners",
                "summary": "Complete Python programming from zero to hero.",
                "icon": "PY",
                "price": "FREE",
                "status": "active",
                "welcome": "Welcome to Python for Beginners. Start with the cheat sheet, then open each topic from the left.",
                "cheatSheet": "Variables store values. Use if/elif/else for choices, loops for repetition, functions for reusable logic, and lists/dicts for everyday data.",
                "topics": [
                    {
                        "id": "python-beginner-topic-1",
                        "title": "Python Basics: Variables, Data Types, Operators, and Input/Output",
                        "content": "<h2>Python Basics: Variables, Data Types, Operators, and Input/Output</h2><p>This lesson page is ready for your full HTML content from the admin dashboard.</p><pre><code># Add examples, notes, and exercises here</code></pre>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Python Basics: Variables, Data Types, Operators, and Input/Output Quiz</h2><p>Add topic-specific quiz HTML from the admin dashboard.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 1,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "python-beginner-topic-2",
                        "title": "Control Flow: Conditional Statements (if, elif, else), Loops (for, while)",
                        "content": "<h2>Control Flow: Conditional Statements (if, elif, else), Loops (for, while)</h2><p>This lesson page is ready for your full HTML content from the admin dashboard.</p><pre><code># Add examples, notes, and exercises here</code></pre>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Control Flow: Conditional Statements (if, elif, else), Loops (for, while) Quiz</h2><p>Add topic-specific quiz HTML from the admin dashboard.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 2,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "python-beginner-topic-3",
                        "title": "Data Structures: Lists, Tuples, Sets, Dictionaries",
                        "content": "<h2>Data Structures: Lists, Tuples, Sets, Dictionaries</h2><p>This lesson page is ready for your full HTML content from the admin dashboard.</p><pre><code># Add examples, notes, and exercises here</code></pre>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Data Structures: Lists, Tuples, Sets, Dictionaries Quiz</h2><p>Add topic-specific quiz HTML from the admin dashboard.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 3,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "python-beginner-topic-4",
                        "title": "Functions: Definition, Parameters, Return Values, Scope, Lambda Functions",
                        "content": "<h2>Functions: Definition, Parameters, Return Values, Scope, Lambda Functions</h2><p>This lesson page is ready for your full HTML content from the admin dashboard.</p><pre><code># Add examples, notes, and exercises here</code></pre>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Functions: Definition, Parameters, Return Values, Scope, Lambda Functions Quiz</h2><p>Add topic-specific quiz HTML from the admin dashboard.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 4,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "python-beginner-topic-5",
                        "title": "File Handling: Reading from and Writing to Files",
                        "content": "<h2>File Handling: Reading from and Writing to Files</h2><p>This lesson page is ready for your full HTML content from the admin dashboard.</p><pre><code># Add examples, notes, and exercises here</code></pre>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>File Handling: Reading from and Writing to Files Quiz</h2><p>Add topic-specific quiz HTML from the admin dashboard.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 5,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "python-beginner-topic-6",
                        "title": "Error and Exception Handling: Try, Except, Finally",
                        "content": "<h2>Error and Exception Handling: Try, Except, Finally</h2><p>This lesson page is ready for your full HTML content from the admin dashboard.</p><pre><code># Add examples, notes, and exercises here</code></pre>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Error and Exception Handling: Try, Except, Finally Quiz</h2><p>Add topic-specific quiz HTML from the admin dashboard.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 6,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "python-beginner-topic-7",
                        "title": "Modules and Packages: Importing, Creating, and Using Libraries",
                        "content": "<h2>Modules and Packages: Importing, Creating, and Using Libraries</h2><p>This lesson page is ready for your full HTML content from the admin dashboard.</p><pre><code># Add examples, notes, and exercises here</code></pre>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Modules and Packages: Importing, Creating, and Using Libraries Quiz</h2><p>Add topic-specific quiz HTML from the admin dashboard.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 7,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "python-beginner-topic-8",
                        "title": "Introduction to Object-Oriented Programming (OOP): Classes and Objects",
                        "content": "<h2>Introduction to Object-Oriented Programming (OOP): Classes and Objects</h2><p>This lesson page is ready for your full HTML content from the admin dashboard.</p><pre><code># Add examples, notes, and exercises here</code></pre>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Introduction to Object-Oriented Programming (OOP): Classes and Objects Quiz</h2><p>Add topic-specific quiz HTML from the admin dashboard.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 8,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "python-beginner-topic-9",
                        "title": "Basic Algorithms: Searching, Sorting, and Recursion",
                        "content": "<h2>Basic Algorithms: Searching, Sorting, and Recursion</h2><p>This lesson page is ready for your full HTML content from the admin dashboard.</p><pre><code># Add examples, notes, and exercises here</code></pre>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Basic Algorithms: Searching, Sorting, and Recursion Quiz</h2><p>Add topic-specific quiz HTML from the admin dashboard.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 9,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "python-beginner-topic-10",
                        "title": "Introduction to Python Libraries for Data: NumPy and Pandas (Overview)",
                        "content": "<h2>Introduction to Python Libraries for Data: NumPy and Pandas (Overview)</h2><p>This lesson page is ready for your full HTML content from the admin dashboard.</p><pre><code># Add examples, notes, and exercises here</code></pre>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Introduction to Python Libraries for Data: NumPy and Pandas (Overview) Quiz</h2><p>Add topic-specific quiz HTML from the admin dashboard.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 10,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    }
                ],
                "order": 1,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "python-for-data-science",
                "title": "Python for Data Science",
                "summary": "Python workflows for data cleaning, analysis, NumPy, Pandas, and visualization.",
                "icon": "DS",
                "price": "FREE",
                "status": "active",
                "welcome": "Welcome to Python for Data Science. Use these lessons to move from Python basics into real analysis workflows.",
                "cheatSheet": "Keep data in arrays, Series, and DataFrames. Inspect shape, clean missing values, group data, summarize, and visualize patterns.",
                "topics": [
                    {
                        "id": "python-data-science-topic-1",
                        "title": "NumPy Arrays and Vectorized Operations",
                        "content": "<h2>NumPy Arrays and Vectorized Operations</h2><p>Add the complete lesson content from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>NumPy Arrays and Vectorized Operations Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 1,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "python-data-science-topic-2",
                        "title": "Pandas Series and DataFrames",
                        "content": "<h2>Pandas Series and DataFrames</h2><p>Add the complete lesson content from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Pandas Series and DataFrames Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 2,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "python-data-science-topic-3",
                        "title": "Reading CSV, Excel, and JSON Files",
                        "content": "<h2>Reading CSV, Excel, and JSON Files</h2><p>Add the complete lesson content from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Reading CSV, Excel, and JSON Files Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 3,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "python-data-science-topic-4",
                        "title": "Cleaning Missing and Duplicate Data",
                        "content": "<h2>Cleaning Missing and Duplicate Data</h2><p>Add the complete lesson content from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Cleaning Missing and Duplicate Data Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 4,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "python-data-science-topic-5",
                        "title": "Filtering, Sorting, and Grouping Data",
                        "content": "<h2>Filtering, Sorting, and Grouping Data</h2><p>Add the complete lesson content from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Filtering, Sorting, and Grouping Data Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 5,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "python-data-science-topic-6",
                        "title": "Merging and Joining DataFrames",
                        "content": "<h2>Merging and Joining DataFrames</h2><p>Add the complete lesson content from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Merging and Joining DataFrames Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 6,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "python-data-science-topic-7",
                        "title": "Basic Data Visualization",
                        "content": "<h2>Basic Data Visualization</h2><p>Add the complete lesson content from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Basic Data Visualization Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 7,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "python-data-science-topic-8",
                        "title": "Mini Data Analysis Project",
                        "content": "<h2>Mini Data Analysis Project</h2><p>Add the complete lesson content from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Mini Data Analysis Project Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 8,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    }
                ],
                "order": 2,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "machine-learning-mastery",
                "title": "Machine Learning Mastery",
                "summary": "From basics to advanced ML algorithms with real projects.",
                "icon": "ML",
                "price": "Rs. 999",
                "status": "active",
                "welcome": "Welcome to Machine Learning Mastery. Follow each topic in order and keep notes from experiments.",
                "cheatSheet": "ML workflow: define the target, prepare features, split data, train, validate, tune, and monitor model quality.",
                "topics": [
                    {
                        "id": "machine-learning-topic-1",
                        "title": "Machine Learning Workflow",
                        "content": "<h2>Machine Learning Workflow</h2><p>Add the complete machine learning lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Machine Learning Workflow Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 1,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "machine-learning-topic-2",
                        "title": "Supervised vs Unsupervised Learning",
                        "content": "<h2>Supervised vs Unsupervised Learning</h2><p>Add the complete machine learning lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Supervised vs Unsupervised Learning Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 2,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "machine-learning-topic-3",
                        "title": "Regression Models",
                        "content": "<h2>Regression Models</h2><p>Add the complete machine learning lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Regression Models Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 3,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "machine-learning-topic-4",
                        "title": "Classification Models",
                        "content": "<h2>Classification Models</h2><p>Add the complete machine learning lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Classification Models Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 4,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "machine-learning-topic-5",
                        "title": "Model Evaluation Metrics",
                        "content": "<h2>Model Evaluation Metrics</h2><p>Add the complete machine learning lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Model Evaluation Metrics Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 5,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "machine-learning-topic-6",
                        "title": "Feature Engineering",
                        "content": "<h2>Feature Engineering</h2><p>Add the complete machine learning lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Feature Engineering Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 6,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "machine-learning-topic-7",
                        "title": "Overfitting and Regularization",
                        "content": "<h2>Overfitting and Regularization</h2><p>Add the complete machine learning lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Overfitting and Regularization Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 7,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "machine-learning-topic-8",
                        "title": "End-to-End ML Project",
                        "content": "<h2>End-to-End ML Project</h2><p>Add the complete machine learning lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>End-to-End ML Project Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 8,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    }
                ],
                "order": 3,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "deep-learning-pinns",
                "title": "Deep Learning & PINNs",
                "summary": "Neural networks, CNNs, and Physics-Informed Neural Networks.",
                "icon": "DL",
                "price": "Rs. 1499",
                "status": "active",
                "welcome": "Welcome to Deep Learning & PINNs. Build a strong neural-network base before moving into physics-informed models.",
                "cheatSheet": "Neural networks learn weights with backpropagation. PINNs add physics equations to the loss function.",
                "topics": [
                    {
                        "id": "deep-learning-topic-1",
                        "title": "Neural Network Foundations",
                        "content": "<h2>Neural Network Foundations</h2><p>Add the full deep learning lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Neural Network Foundations Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 1,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "deep-learning-topic-2",
                        "title": "Activation Functions and Loss",
                        "content": "<h2>Activation Functions and Loss</h2><p>Add the full deep learning lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Activation Functions and Loss Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 2,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "deep-learning-topic-3",
                        "title": "Backpropagation and Optimizers",
                        "content": "<h2>Backpropagation and Optimizers</h2><p>Add the full deep learning lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Backpropagation and Optimizers Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 3,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "deep-learning-topic-4",
                        "title": "CNN Basics",
                        "content": "<h2>CNN Basics</h2><p>Add the full deep learning lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>CNN Basics Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 4,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "deep-learning-topic-5",
                        "title": "Regularization and Dropout",
                        "content": "<h2>Regularization and Dropout</h2><p>Add the full deep learning lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Regularization and Dropout Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 5,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "deep-learning-topic-6",
                        "title": "Introduction to PINNs",
                        "content": "<h2>Introduction to PINNs</h2><p>Add the full deep learning lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Introduction to PINNs Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 6,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "deep-learning-topic-7",
                        "title": "Physics Loss Functions",
                        "content": "<h2>Physics Loss Functions</h2><p>Add the full deep learning lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Physics Loss Functions Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 7,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    },
                    {
                        "id": "deep-learning-topic-8",
                        "title": "PINN Mini Project",
                        "content": "<h2>PINN Mini Project</h2><p>Add the full deep learning lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>PINN Mini Project Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 8,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.160Z"
                    }
                ],
                "order": 4,
                "updatedAt": "2026-05-24T09:40:14.160Z"
            },
            {
                "id": "data-analysis-with-pandas",
                "title": "Data Analysis with Pandas",
                "summary": "Master data manipulation, cleaning, and analysis.",
                "icon": "PD",
                "price": "FREE",
                "status": "active",
                "welcome": "Welcome to Data Analysis with Pandas. Practice each topic with small datasets.",
                "cheatSheet": "Use read_csv, head, info, describe, isnull, dropna, fillna, groupby, merge, pivot_table, and plot.",
                "topics": [
                    {
                        "id": "pandas-topic-1",
                        "title": "Pandas Setup and DataFrames",
                        "content": "<h2>Pandas Setup and DataFrames</h2><p>Add the full Pandas lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Pandas Setup and DataFrames Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 1,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.161Z"
                    },
                    {
                        "id": "pandas-topic-2",
                        "title": "Importing and Inspecting Data",
                        "content": "<h2>Importing and Inspecting Data</h2><p>Add the full Pandas lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Importing and Inspecting Data Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 2,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.161Z"
                    },
                    {
                        "id": "pandas-topic-3",
                        "title": "Selecting Rows and Columns",
                        "content": "<h2>Selecting Rows and Columns</h2><p>Add the full Pandas lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Selecting Rows and Columns Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 3,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.161Z"
                    },
                    {
                        "id": "pandas-topic-4",
                        "title": "Cleaning Missing Data",
                        "content": "<h2>Cleaning Missing Data</h2><p>Add the full Pandas lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Cleaning Missing Data Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 4,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.161Z"
                    },
                    {
                        "id": "pandas-topic-5",
                        "title": "GroupBy and Aggregation",
                        "content": "<h2>GroupBy and Aggregation</h2><p>Add the full Pandas lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>GroupBy and Aggregation Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 5,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.161Z"
                    },
                    {
                        "id": "pandas-topic-6",
                        "title": "Merging DataFrames",
                        "content": "<h2>Merging DataFrames</h2><p>Add the full Pandas lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Merging DataFrames Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 6,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.161Z"
                    },
                    {
                        "id": "pandas-topic-7",
                        "title": "Time Series Basics",
                        "content": "<h2>Time Series Basics</h2><p>Add the full Pandas lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Time Series Basics Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 7,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.161Z"
                    },
                    {
                        "id": "pandas-topic-8",
                        "title": "Analysis Project",
                        "content": "<h2>Analysis Project</h2><p>Add the full Pandas lesson from the admin dashboard.</p>",
                        "contentType": "html",
                        "contentFileName": "",
                        "contentDataUrl": "",
                        "contentUrl": "",
                        "contentStoragePath": "",
                        "quizHtml": "<h2>Analysis Project Quiz</h2><p>Add quiz HTML here.</p>",
                        "quizFileName": "",
                        "quizRenderMode": "auto",
                        "videoUrl": "",
                        "order": 8,
                        "status": "active",
                        "updatedAt": "2026-05-24T09:40:14.161Z"
                    }
                ],
                "order": 5,
                "updatedAt": "2026-05-24T09:40:14.161Z"
            }
        ],
        "blogPosts": [
            {
                "id": "python-learning-plan",
                "title": "How to Start Learning Python with a Practical Study Plan",
                "category": "Python",
                "excerpt": "A structured beginner plan for syntax, practice, projects, and revision without feeling scattered.",
                "body": "Start with syntax and small exercises, then move into functions, files, and data structures. Keep notes, solve small problems daily, and build one mini project each week.",
                "author": "ASG Tech",
                "readTime": "6 min read",
                "url": "posts/post1.html",
                "featured": true,
                "status": "active",
                "order": 1,
                "updatedAt": "2026-05-24T09:40:14.161Z"
            },
            {
                "id": "machine-learning-beginner",
                "title": "What Machine Learning Really Means for Beginners",
                "category": "Machine Learning",
                "excerpt": "A plain-language guide to datasets, features, models, validation, and why evaluation matters.",
                "body": "Machine learning is about learning patterns from examples. The useful workflow is data preparation, model training, validation, error analysis, and iteration.",
                "author": "ASG Tech",
                "readTime": "5 min read",
                "url": "posts/post2.html",
                "featured": false,
                "status": "active",
                "order": 2,
                "updatedAt": "2026-05-24T09:40:14.161Z"
            }
        ],
        "projectShowcase": [
            {
                "id": "pinns-richards-equation",
                "title": "PINNs for Richards' Equation",
                "category": "AI and Science",
                "difficulty": "Advanced",
                "summary": "Use Physics-Informed Neural Networks to model soil water flow and connect deep learning with physical constraints.",
                "skills": [
                    "Python",
                    "TensorFlow",
                    "Numerical Methods",
                    "Model Evaluation"
                ],
                "outcome": "A research-style notebook with model diagnostics and visualized predictions.",
                "url": "login.html?next=courses.html",
                "featured": true,
                "status": "active",
                "order": 1,
                "updatedAt": "2026-05-24T09:40:14.162Z"
            },
            {
                "id": "student-performance-dashboard",
                "title": "Student Performance Dashboard",
                "category": "Data Science",
                "difficulty": "Intermediate",
                "summary": "Clean student activity data, analyze trends, and build an institute-style progress dashboard.",
                "skills": [
                    "Pandas",
                    "Visualization",
                    "Metrics",
                    "Presentation"
                ],
                "outcome": "A dashboard story that explains progress, weak areas, and intervention opportunities.",
                "url": "login.html?next=roadmap.html",
                "featured": false,
                "status": "active",
                "order": 2,
                "updatedAt": "2026-05-24T09:40:14.162Z"
            },
            {
                "id": "learning-portal-features",
                "title": "Learning Portal Features",
                "category": "Web App",
                "difficulty": "Beginner to Intermediate",
                "summary": "Practice authentication flow, student dashboards, content organization, and admin views using this portal as a case study.",
                "skills": [
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "UX Structure"
                ],
                "outcome": "A functional student-facing feature with clear admin controls and progress feedback.",
                "url": "blog.html",
                "featured": false,
                "status": "active",
                "order": 3,
                "updatedAt": "2026-05-24T09:40:14.162Z"
            }
        ],
        "videoPlaylists": [
            {
                "id": "python-foundations",
                "title": "Python Foundations",
                "description": "Beginner-friendly lessons for syntax, functions, loops, and practical coding habits.",
                "level": "Beginner",
                "status": "active",
                "order": 1,
                "updatedAt": "2026-05-24T09:40:14.162Z"
            },
            {
                "id": "data-analysis",
                "title": "Data Analysis",
                "description": "Pandas, NumPy, data cleaning, and visual thinking for real datasets.",
                "level": "Beginner to Intermediate",
                "status": "active",
                "order": 2,
                "updatedAt": "2026-05-24T09:40:14.162Z"
            },
            {
                "id": "machine-learning",
                "title": "Machine Learning",
                "description": "Model mindset, feature thinking, validation, and responsible evaluation.",
                "level": "Intermediate",
                "status": "active",
                "order": 3,
                "updatedAt": "2026-05-24T09:40:14.162Z"
            },
            {
                "id": "portfolio-projects",
                "title": "Portfolio Projects",
                "description": "Project walkthroughs that help students turn lessons into public proof of skill.",
                "level": "Career",
                "status": "active",
                "order": 4,
                "updatedAt": "2026-05-24T09:40:14.162Z"
            }
        ],
        "roadmapItems": [
            {
                "id": "roadmap-python-foundations",
                "stage": "Foundation",
                "title": "Python Foundations",
                "duration": "Weeks 1-4",
                "focus": "Build fluency with syntax, functions, data structures, files, and clean problem solving.",
                "outcomes": [
                    "Write reusable Python functions",
                    "Work confidently with lists, dictionaries, and files",
                    "Solve beginner coding challenges with clean indentation"
                ],
                "videoUrl": "videos.html",
                "resourceUrl": "resources.html",
                "status": "active",
                "order": 1,
                "updatedAt": "2026-05-24T09:40:14.164Z"
            },
            {
                "id": "roadmap-data-analysis",
                "stage": "Analytics",
                "title": "Data Analysis with Pandas",
                "duration": "Weeks 5-8",
                "focus": "Turn raw datasets into readable insights using Pandas, NumPy, charts, and exploratory analysis.",
                "outcomes": [
                    "Clean messy tabular data",
                    "Create charts for patterns and comparisons",
                    "Prepare datasets for machine learning"
                ],
                "videoUrl": "videos.html",
                "resourceUrl": "resources.html",
                "status": "active",
                "order": 2,
                "updatedAt": "2026-05-24T09:40:14.164Z"
            },
            {
                "id": "roadmap-machine-learning",
                "stage": "Modeling",
                "title": "Machine Learning Workflow",
                "duration": "Weeks 9-14",
                "focus": "Learn supervised learning, validation, feature thinking, and model evaluation through practical projects.",
                "outcomes": [
                    "Train classification and regression models",
                    "Compare models using meaningful metrics",
                    "Avoid common overfitting mistakes"
                ],
                "videoUrl": "videos.html",
                "resourceUrl": "quiz.html",
                "status": "active",
                "order": 3,
                "updatedAt": "2026-05-24T09:40:14.164Z"
            },
            {
                "id": "roadmap-deep-learning",
                "stage": "Advanced",
                "title": "Deep Learning Foundations",
                "duration": "Weeks 15-20",
                "focus": "Understand neural networks, training loops, transfer learning, and how to reason about model behavior.",
                "outcomes": [
                    "Explain how neural networks learn",
                    "Use pretrained models responsibly",
                    "Connect deep learning concepts to portfolio projects"
                ],
                "videoUrl": "videos.html",
                "resourceUrl": "resources.html",
                "status": "active",
                "order": 4,
                "updatedAt": "2026-05-24T09:40:14.164Z"
            },
            {
                "id": "roadmap-portfolio",
                "stage": "Career",
                "title": "Portfolio and Interview Readiness",
                "duration": "Weeks 21-24",
                "focus": "Package projects, practice interviews, publish work, and prepare a credible student portfolio.",
                "outcomes": [
                    "Build and document portfolio projects",
                    "Prepare for technical interviews",
                    "Publish a professional learning record"
                ],
                "videoUrl": "videos.html",
                "resourceUrl": "certificate.html",
                "status": "active",
                "order": 5,
                "updatedAt": "2026-05-24T09:40:14.164Z"
            }
        ],
        "videoLibrary": [
            {
                "id": "video-python-start",
                "playlistId": "python-foundations",
                "title": "Python Starter Session",
                "category": "Python",
                "level": "Beginner",
                "duration": "28 min",
                "description": "A practical orientation for variables, functions, loops, and how to study coding consistently.",
                "url": "https://www.youtube.com/embed/kqtD5dpn9C8",
                "status": "active",
                "order": 1,
                "updatedAt": "2026-05-24T09:40:14.164Z"
            },
            {
                "id": "video-pandas-workflow",
                "playlistId": "data-analysis",
                "title": "Pandas Data Cleaning Workflow",
                "category": "Data Analysis",
                "level": "Beginner",
                "duration": "34 min",
                "description": "A guided workflow for reading data, checking quality, cleaning columns, and summarizing insights.",
                "url": "https://www.youtube.com/embed/vmEHCJofslg",
                "status": "active",
                "order": 2,
                "updatedAt": "2026-05-24T09:40:14.164Z"
            },
            {
                "id": "video-ml-models",
                "playlistId": "machine-learning",
                "title": "Machine Learning Model Mindset",
                "category": "Machine Learning",
                "level": "Intermediate",
                "duration": "42 min",
                "description": "How to think about features, training data, validation, and model evaluation without getting lost.",
                "url": "https://www.youtube.com/embed/GwIo3gDZCVQ",
                "status": "active",
                "order": 3,
                "updatedAt": "2026-05-24T09:40:14.164Z"
            },
            {
                "id": "video-project-build",
                "playlistId": "portfolio-projects",
                "title": "Portfolio Project Walkthrough",
                "category": "Projects",
                "level": "Intermediate",
                "duration": "45 min",
                "description": "How to turn a lesson into a portfolio project with a clean README, screenshots, and next steps.",
                "url": "projects.html",
                "status": "active",
                "order": 4,
                "updatedAt": "2026-05-24T09:40:14.164Z"
            }
        ],
        "resourceLibrary": [
            {
                "id": "resource-python-cheatsheet",
                "title": "Python Syntax Cheat Sheet",
                "category": "Python",
                "format": "PDF / Notes",
                "description": "A compact reference for syntax, functions, loops, collections, and common beginner mistakes.",
                "url": "course-detail.html?course=python-for-beginners",
                "actionLabel": "Open Python Course",
                "fileName": "",
                "storagePath": "",
                "storageBucket": "",
                "status": "active",
                "order": 1,
                "updatedAt": "2026-05-24T09:40:14.165Z"
            },
            {
                "id": "resource-pandas-guide",
                "title": "Pandas Cleaning Checklist",
                "category": "Data Analysis",
                "format": "Checklist",
                "description": "A student-friendly checklist for missing values, data types, duplicates, and feature preparation.",
                "url": "course-detail.html?course=data-analysis-with-pandas",
                "actionLabel": "View Checklist",
                "fileName": "",
                "storagePath": "",
                "storageBucket": "",
                "status": "active",
                "order": 2,
                "updatedAt": "2026-05-24T09:40:14.165Z"
            },
            {
                "id": "resource-ml-interview",
                "title": "Machine Learning Interview Q&A",
                "category": "Machine Learning",
                "format": "Interview Prep",
                "description": "Core questions on supervised learning, metrics, overfitting, validation, and model selection.",
                "url": "quiz.html",
                "actionLabel": "Practice Quiz",
                "fileName": "",
                "storagePath": "",
                "storageBucket": "",
                "status": "active",
                "order": 3,
                "updatedAt": "2026-05-24T09:40:14.165Z"
            },
            {
                "id": "resource-project-template",
                "title": "Portfolio Project Template",
                "category": "Career",
                "format": "Template",
                "description": "A structure for project README files, problem statements, result summaries, and screenshots.",
                "url": "projects.html",
                "actionLabel": "Open Projects",
                "fileName": "",
                "storagePath": "",
                "storageBucket": "",
                "status": "active",
                "order": 4,
                "updatedAt": "2026-05-24T09:40:14.165Z"
            }
        ],
        "studentAnnouncement": {
            "active": false,
            "title": "",
            "body": "",
            "updatedAt": "2026-05-24T09:40:14.156Z"
        }
    }
};

