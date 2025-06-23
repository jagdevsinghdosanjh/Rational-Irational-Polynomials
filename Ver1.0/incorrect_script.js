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
        q.originalIndex = index;  // track original position
        const correctValue = q.options[q.correct[0]];
        shuffleArray(q.options);
        q.correct[0] = q.options.indexOf(correctValue);
    });
    shuffleArray(shuffledQuizData);
}

function loadQuiz() {
    randomizeQuiz();
    const quizContainer = document.getElementById("quiz");
    shuffledQuizData.forEach((q, index) => {
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

    shuffledQuizData.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        const selectedIndex = selectedOption ? parseInt(selectedOption.value) : null;
        const isCorrect = selectedIndex === q.correct[0];

        userResponses.push({
            question: q.question,
            selected: selectedIndex !== null ? q.options[selectedIndex] : "Not answered",
            correct: q.options[q.correct[0]],
            explanation: q.explanation,
            isCorrect: selectedIndex !== null ? isCorrect : false
        });

        score += selectedIndex !== null && isCorrect ? 1 : 0;
    });

    document.getElementById("result").innerHTML = `You scored ${score} out of ${shuffledQuizData.length}!`;

    userResponses.forEach((res, i) => {
        explanationHTML += `<p><strong>${i + 1}. ${res.question}</strong><br>
            Your answer: ${res.selected}<br>
            Correct answer: ${res.correct}<br>
            Explanation: ${res.explanation}</p>`;
    });

    document.getElementById("explanation").innerHTML = explanationHTML;

    localStorage.setItem("quizResults", JSON.stringify({ score, userResponses }));
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const quizResults = JSON.parse(localStorage.getItem("quizResults"));
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Physical World and Measurement Quiz Results", 20, 15);

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

        y += 4; // extra spacing between questions
    });

    doc.save("quiz_results.pdf");
}
window.onload = loadQuiz;