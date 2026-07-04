// exam-data.js - Shared data for exam system

// Initialize exam data if not exists
if(!localStorage.getItem('examQuestions')) {
    const defaultQuestions = [
        {
            id: 1,
            title: "Sum of Two Numbers",
            description: "Write a function that takes two numbers and returns their sum.",
            testCases: [
                { input: "3,5", expected: "8" },
                { input: "10,20", expected: "30" },
                { input: "-5,7", expected: "2" }
            ],
            marks: 10
        },
        {
            id: 2,
            title: "Check Even or Odd",
            description: "Write a function that returns 'Even' if number is even, 'Odd' if odd.",
            testCases: [
                { input: "4", expected: "Even" },
                { input: "7", expected: "Odd" },
                { input: "0", expected: "Even" }
            ],
            marks: 10
        },
        {
            id: 3,
            title: "Find Maximum of Three Numbers",
            description: "Write a function that returns the largest of three numbers.",
            testCases: [
                { input: "5,10,3", expected: "10" },
                { input: "100,50,75", expected: "100" },
                { input: "-1,-5,-3", expected: "-1" }
            ],
            marks: 10
        },
        {
            id: 4,
            title: "Reverse a String",
            description: "Write a function that reverses a given string.",
            testCases: [
                { input: "hello", expected: "olleh" },
                { input: "python", expected: "nohtyp" },
                { input: "12345", expected: "54321" }
            ],
            marks: 10
        },
        {
            id: 5,
            title: "Factorial of a Number",
            description: "Write a function that returns factorial of a number.",
            testCases: [
                { input: "5", expected: "120" },
                { input: "0", expected: "1" },
                { input: "3", expected: "6" }
            ],
            marks: 10
        },
        {
            id: 6,
            title: "Check Prime Number",
            description: "Write a function that returns True if number is prime, False otherwise.",
            testCases: [
                { input: "7", expected: "True" },
                { input: "10", expected: "False" },
                { input: "2", expected: "True" }
            ],
            marks: 10
        }
    ];
    localStorage.setItem('examQuestions', JSON.stringify(defaultQuestions));
}

// Store exam results
if(!localStorage.getItem('examResults')) {
    localStorage.setItem('examResults', JSON.stringify([]));
}

// Get all questions
function getExamQuestions() {
    return JSON.parse(localStorage.getItem('examQuestions'));
}

// Save questions (admin only)
function saveExamQuestions(questions) {
    localStorage.setItem('examQuestions', JSON.stringify(questions));
}

// Save exam result
function saveExamResult(result) {
    const results = JSON.parse(localStorage.getItem('examResults'));
    results.push(result);
    localStorage.setItem('examResults', JSON.stringify(results));
}

// Get all results
function getExamResults() {
    return JSON.parse(localStorage.getItem('examResults'));
}

// Check if student has already taken exam
function hasTakenExam(applicationId, email) {
    const results = getExamResults();
    return results.some(r => r.applicationId === applicationId && r.email === email);
}

// Validate student login
function validateStudent(name, applicationId, email) {
    // In real system, you'd check against database
    // For now, just validate format
    if(!name || !applicationId || !email) return false;
    if(applicationId.length < 3) return false;
    if(!email.includes('@')) return false;
    return true;
}

// Evaluate code against test cases
function evaluateCode(code, testCases, functionName) {
    let passed = 0;
    let results = [];
    
    for(let testCase of testCases) {
        try {
            // Create a function from code
            const func = new Function('return ' + code)();
            
            // Parse input arguments
            let args = testCase.input.split(',').map(arg => {
                if(!isNaN(arg) && arg.trim() !== '') return Number(arg);
                return arg.trim().replace(/['"]/g, '');
            });
            
            // Call function
            let output = func(...args);
            
            // Convert output to string for comparison
            let outputStr = String(output);
            let expectedStr = String(testCase.expected);
            
            if(outputStr === expectedStr) {
                passed++;
                results.push({passed: true, expected: expectedStr, got: outputStr});
            } else {
                results.push({passed: false, expected: expectedStr, got: outputStr});
            }
        } catch(e) {
            results.push({passed: false, expected: testCase.expected, got: 'Error: ' + e.message});
        }
    }
    
    return { passed, total: testCases.length, results };
}