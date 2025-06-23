//Script for a Quiz Application V2.0
//Rational Irrational and Polynomial Numbers Quiz
const quizData = [
    { 
        question: "Which of the following is a polynomial?", 
        options: ["2x² + 3x + 5", "1/x + 2", "√x + 3", "x⁻¹ + 4"], 
        correct: 0 
    },
    { 
        question: "What is the degree of the polynomial 3x⁴ + 2x³ - x + 7?", 
        options: ["1", "3", "4", "7"], 
        correct: 2 
    },
    { 
        question: "What is the zero of the polynomial x - 5?", 
        options: ["5", "-5", "0", "None of the above"], 
        correct: 0 
    }
];

// Deep copy to preserve original data
const shuffledQuizData = JSON.parse(JSON.stringify(quizData));

// Utility to shuffle arrays
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Shuffle questions and their options
function randomizeQuiz() {
    shuffledQuizData.forEach((q, index) => {
        q.originalIndex = index;
        const correctValue = q.options[q.correct];
        shuffleArray(q.options);
        q.correct = q.options.indexOf(correctValue);
    });
    shuffleArray(shuffledQuizData);
}

function loadQuiz() {
    randomizeQuiz();
    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = ""; // Clear previous content if any
    shuffledQuizData.forEach((q, index) => {
        let questionHTML = `<p><strong>${index + 1}. ${q.question}</strong></p>`;
        q.options.forEach((option, i) => {
            questionHTML += `<label><input type="radio" name="question${index}" value="${i}"> ${option}</label><br>`;
        });
        quizContainer.innerHTML += questionHTML + "<br>";
    });
}

function submitQuiz() {
    let score = 0;
    let userResponses = [];
    let explanationHTML = `<h2>Explanations:</h2>`;

    shuffledQuizData.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        const selectedIndex = selectedOption ? parseInt(selectedOption.value) : null;
        const isCorrect = selectedIndex === q.correct;

        userResponses.push({
            question: q.question,
            selected: selectedIndex !== null ? q.options[selectedIndex] : "Not answered",
            correct: q.options[q.correct],
            explanation: q.explanation,
            isCorrect: selectedIndex !== null ? isCorrect : false
        });

        score += isCorrect ? 1 : 0;
    });

    document.getElementById("result").innerHTML = `You scored ${score} out of ${shuffledQuizData.length}!`;

    userResponses.forEach((res, i) => {
        explanationHTML += `<p><strong>${i + 1}. ${res.question}</strong><br>
            Your answer: ${res.selected}<br>
            Correct answer: ${res.correct}<br>
            Explanation: ${res.explanation}</p>`;
    });

    document.getElementById("explanation").innerHTML = explanationHTML;

    localStorage.setItem("polynomialQuizResults", JSON.stringify({ score, userResponses }));
    //localStorage.setItem("quizResults", JSON.stringify({ score, userResponses }));

}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const quizResults = JSON.parse(localStorage.getItem("polynomialQuizResults"));
    //const quizResults = JSON.parse(localStorage.getItem("quizResults"));

    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Quiz Results", 20, 15);

    doc.setFontSize(13);
    doc.text(`Score: ${quizResults.score} / ${quizResults.userResponses.length}`, 20, y);
    y += 10;

    quizResults.userResponses.forEach((res, index) => {
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

    doc.save("quiz_results.pdf");

}

window.onload = loadQuiz;
