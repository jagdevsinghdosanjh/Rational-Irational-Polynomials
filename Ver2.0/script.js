const quizTitle = "Polynomial Quiz v2.0";

const quizData = [
    {
        question: "Which of the following is a polynomial?",
        options: ["2x² + 3x + 5", "1/x + 2", "√x + 3", "x⁻¹ + 4"],
        correct: 0,
        explanation: "Polynomials must not include roots, negative exponents, or variables in denominators."
    },
    {
        question: "What is the degree of the polynomial 3x⁴ + 2x³ - x + 7?",
        options: ["1", "3", "4", "7"],
        correct: 2,
        explanation: "The degree is determined by the highest exponent, which is 4 here."
    },
    {
        question: "What is the zero of the polynomial x - 5?",
        options: ["5", "-5", "0", "None of the above"],
        correct: 0,
        explanation: "Solving x - 5 = 0 gives x = 5 as the root of the polynomial."
    }
];

const storageKey = "polynomialQuizResults_v2";
const shuffledQuizData = JSON.parse(JSON.stringify(quizData));

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

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
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const quizResults = JSON.parse(localStorage.getItem(storageKey));

    if (!quizResults) {
        alert("Please submit the quiz first.");
        return;
    }

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
    document.getElementById("downloadBtn").addEventListener("click", generatePDF);
});
