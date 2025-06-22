//Ver4.0 - Polynomial Quiz Application (script.js)
    const quizData=[
      {
      "question": "Which of the following is a polynomial?",
      "options": ["2x² + 3x + 5", "1/x + 2", "√x + 3", "x⁻¹ + 4"],
      "correct": 0,
      "explanation": "A polynomial must have variables with non-negative integer powers."
    },
    {
      "question": "What is the degree of the polynomial 5x³ - 2x² + 7?",
      "options": ["1", "2", "3", "5"],
      "correct": 2,
      "explanation": "The degree is the highest exponent, which is 3."
    },
     {
        "question": "What is the coefficient of x² in 4x² - 3x + 7?",
        "options": ["4", "-3", "7", "0"],
        "correct": 0,
        "explanation": "The coefficient of x² is 4."
    },
    {
      "question": "Find the zero of x² - 9.",
      "options": ["±3", "5", "-9", "None"],
      "correct": 0,
      "explanation": "Using a² - b² = (a - b)(a + b), we get (x - 3)(x + 3) = 0."
    },
    {
      "question": "Which polynomial identity expands (a + b)²?",
      "options": ["a² + b²", "a² + 2ab + b²", "a² - b²", "(a+b)(a-b)"],
      "correct": 1,
      "explanation": "The expansion formula is (a + b)² = a² + 2ab + b²."
    },
    {
      "question": "What is the factorization of x² + 5x + 6?",
      "options": ["(x + 2)(x + 3)", "(x + 1)(x + 6)", "(x + 3)(x + 5)", "(x + 2)(x + 5)"],
      "correct": 0,
      "explanation": "Finding two numbers whose product is 6 and sum is 5 gives (x + 2)(x + 3)."
    },
    {
      "question": "What is the remainder when x² + 3x + 2 is divided by x + 1?",
      "options": ["0", "1", "2", "3"],
      "correct": 0,
      "explanation": "Using the remainder theorem, substituting x = -1 gives 0."
    },
    {
      "question": "Which polynomial represents a monomial?",
      "options": ["3x²", "2x + 5", "x² + x + 1", "x³ - x"],
      "correct": 0,
      "explanation": "A monomial has only one term."
    },
    {
      "question": "Solve (x + 4)(x - 4).",
      "options": ["x² - 16", "x² + 16", "x² - 4", "x² + 4"],
      "correct": 0,
      "explanation": "Using identity (a+b)(a-b) = a² - b², we get x² - 16."
    },
    {
      "question": "What is the zero of x² - 4x + 4?",
      "options": ["2", "-2", "4", "None"],
      "correct": 0,
      "explanation": "Factorizing gives (x-2)(x-2) = 0, so x = 2."
    },
    {
      "question": "Find the value of (a - b)² when a = 3 and b = 2.",
      "options": ["1", "5", "10", "9"],
      "correct": 1,
      "explanation": "Using (a - b)² = a² - 2ab + b², substituting a = 3, b = 2 gives 5."
    },
    {
      "question": "Which is a quadratic polynomial?",
      "options": ["x³ + 3x² + 4x + 5", "x² + 4x + 6", "x⁴ + 2x³ - 3", "None"],
      "correct": 1,
      "explanation": "A quadratic polynomial has the highest degree of 2."
    },
    {
      "question": "Expand (x + 3)(x - 2).",
      "options": ["x² + x - 6", "x² - x - 6", "x² - x + 6", "x² + x + 6"],
      "correct": 0,
      "explanation": "Using distributive property, x² + x - 6."
    },
    {
      "question": "What is the coefficient of x² in 3x² - 4x + 7?",
      "options": ["3", "-4", "7", "None"],
      "correct": 0,
      "explanation": "The coefficient of x² is 3."
    },
    {
      "question": "What is the highest degree term in 4x³ - 2x² + x - 1?",
      "options": ["4x³", "-2x²", "x", "-1"],
      "correct": 0,
      "explanation": "The highest degree term is 4x³ (degree = 3)."
    },
    {
      "question": "What is the factorization of x² - 2x - 8?",
      "options": ["(x-4)(x+2)", "(x+4)(x-2)", "(x+3)(x-3)", "None"],
      "correct": 0,
      "explanation": "Finding two numbers whose product is -8 and sum is -2 gives (x-4)(x+2)."
    },
    {
      "question": "Find the sum of the zeros of x² - 5x + 6.",
      "options": ["5", "6", "0", "-5"],
      "correct": 0,
      "explanation": "Using the relation sum of zeros = -b/a, we get 5."
    },
    {
      "question": "What identity is used in x² - y²?",
      "options": ["a² + b²", "a² - b² = (a-b)(a+b)", "(a+b)²", "(a-b)²"],
      "correct": 1,
      "explanation": "The formula a² - b² = (a-b)(a+b) applies."
    },
    {
      "question": "What is the zero of the polynomial x² + x - 6?",
      "options": ["-3 and 2", "3 and -2", "6 and -1", "None"],
      "correct": 0,
      "explanation": "Factorizing (x+3)(x-2) = 0 gives x = -3 and x = 2."
    },
    {
      "question": "Find the product of the zeros of x² - 4x + 3.",
      "options": ["3", "4", "12", "-4"],
      "correct": 0,
      "explanation": "Product of zeros = c/a, which is 3."
    }
  ];

function loadQuiz() {
    const quizContainer = document.getElementById("quiz");
    quizData.forEach((q, index) => {
        let questionHTML = `<p>${index + 1}. ${q.question}</p>`;
        q.options.forEach((option, i) => {
            questionHTML += `<input type="radio" name="question${index}" value="${i}"> ${option} <br>`;
        });
        quizContainer.innerHTML += questionHTML + "<br>";
    });
}

function submitQuiz() {
    let score = 0;
    let userResponses = [];
    let explanationHTML = `<h2>Explanations:</h2>`;

    quizData.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedOption) {
            userResponses.push({ question: q.question, selected: q.options[selectedOption.value], correct: q.options[q.correct], explanation: q.explanation });

            if (parseInt(selectedOption.value) === q.correct) {
                score++;
                selectedOption.parentElement.classList.add("correct");
            } else {
                selectedOption.parentElement.classList.add("incorrect");
            }

            explanationHTML += `<p><strong>${index + 1}. ${q.question}</strong><br>
                               Your Answer: ${q.options[selectedOption.value]}<br>
                               Correct Answer: ${q.options[q.correct]}<br>
                               Explanation: ${q.explanation}</p>`;
        }
    });

    document.getElementById("result").innerHTML = `You scored ${score} out of ${quizData.length}!`;
    document.getElementById("explanation").innerHTML = explanationHTML;

    localStorage.setItem("quizResults", JSON.stringify({ score, userResponses }));
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const quizResults = JSON.parse(localStorage.getItem("quizResults"));
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Polynomial Quiz Results", 20, 10);

    doc.setFontSize(14);
    doc.text(`Score: ${quizResults.score} / ${quizData.length}`, 20, y);
    y += 10;

    quizResults.userResponses.forEach((response, index) => {
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${response.question}`, 10, y);
        y += 7;
        doc.text(`Your Answer: ${response.selected}`, 10, y);
        y += 5;
        doc.text(`Correct Answer: ${response.correct}`, 10, y);
        y += 5;
        doc.text(`Explanation: ${response.explanation}`, 10, y);
        y += 10;
    });

    doc.save("quiz_results.pdf");
}

window.onload = loadQuiz;
