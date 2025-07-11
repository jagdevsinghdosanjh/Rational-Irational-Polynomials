const quizTitle = "Polynomial Quiz v2.0";
const storageKey = "polynomialQuizResults_v2";

// 
const quizData = [
  {
    question: "Which of the following is a polynomial?",
    options: ["2x² + 3x + 5", "1/x + 2", "√x + 3", "x⁻¹ + 4"],
    correct: 0,
    explanation:
      "Polynomials must not include roots, negative exponents, or variables in denominators.",
  },
  {
    question: "What is the degree of the polynomial 3x⁴ + 2x³ - x + 7?",
    options: ["1", "3", "4", "7"],
    correct: 2,
    explanation:
      "The degree is determined by the highest exponent, which is 4 here.",
  },
  {
    question: "What is the zero of the polynomial x - 5?",
    options: ["5", "-5", "0", "None of the above"],
    correct: 0,
    explanation: "Solving x - 5 = 0 gives x = 5 as the root of the polynomial.",
  },
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


const shuffledQuizData = JSON.parse(JSON.stringify(quizData));

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function randomizeQuiz() {
    shuffledQuizData.forEach(q => {
        const correctValue = q.options[q.correct];
        shuffleArray(q.options);
        q.correct = q.options.indexOf(correctValue);
    });
    shuffleArray(shuffledQuizData);
}

function loadQuiz() {
    randomizeQuiz();
    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = "";
    shuffledQuizData.forEach((q, index) => {
        let html = `<p><strong>${index + 1}. ${q.question}</strong></p>`;
        q.options.forEach((option, i) => {
            html += `<label><input type="radio" name="question${index}" value="${i}"> ${option}</label><br>`;
        });
        quizContainer.innerHTML += html + "<br>";
    });
}

function submitQuiz() {
    let score = 0;
    const responses = [];
    let explanationHTML = "<h2>Explanations:</h2>";

    shuffledQuizData.forEach((q, index) => {
        const selected = document.querySelector(`input[name="question${index}"]:checked`);
        const selectedIndex = selected ? parseInt(selected.value) : null;
        const isCorrect = selectedIndex === q.correct;

        responses.push({
            question: q.question,
            selected: selectedIndex !== null ? q.options[selectedIndex] : "Not answered",
            correct: q.options[q.correct],
            explanation: q.explanation,
            isCorrect
        });

        if (isCorrect) score++;
    });

    document.getElementById("result").textContent = `You scored ${score} out of ${shuffledQuizData.length}!`;

    responses.forEach((res, i) => {
        explanationHTML += `<p><strong>${i + 1}. ${res.question}</strong><br>
            Your answer: ${res.selected}<br>
            Correct answer: ${res.correct}<br>
            Explanation: ${res.explanation}</p>`;
    });

    document.getElementById("explanation").innerHTML = explanationHTML;
    localStorage.setItem(storageKey, JSON.stringify({ score, responses }));

    // Enable download button after quiz is submitted
    const btn = document.getElementById("downloadBtn");
    if (btn) btn.disabled = false;
}

function generatePDF() {
    const quizResultsRaw = localStorage.getItem(storageKey);
    if (!quizResultsRaw) {
        alert("Please submit the quiz first.");
        return;
    }

    const quizResults = JSON.parse(quizResultsRaw);
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`${quizTitle} - Results`, 20, 15);

    doc.setFontSize(13);
    doc.text(`Score: ${quizResults.score} / ${quizResults.responses.length}`, 20, y);
    y += 10;

    quizResults.responses.forEach((res, index) => {
        const block = [
            `${index + 1}. ${res.question}`,
            `Your answer: ${res.selected}`,
            `Correct answer: ${res.correct}`,
            `Explanation: ${res.explanation}`
        ];
        doc.setFontSize(11);
        block.forEach(line => {
            const wrapped = doc.splitTextToSize(line, pageWidth - 20);
            if (y + wrapped.length * 6 > pageHeight - 15) {
                doc.addPage();
                y = 20;
            }
            doc.text(wrapped, 10, y);
            y += wrapped.length * 6;
        });
        y += 4;
    });

    const filename = quizTitle.toLowerCase().replace(/\s+/g, "_") + "_results.pdf";
    doc.save(filename);
}

document.addEventListener("DOMContentLoaded", () => {
    loadQuiz();

    // Clear previous submission and disable download button on each load
    localStorage.removeItem(storageKey);
    const btn = document.getElementById("downloadBtn");
    if (btn) {
        btn.disabled = true;
        btn.addEventListener("click", generatePDF);
    }
});
