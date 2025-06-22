const quizData = [
    { question: "Which of the following is a polynomial?", options: ["2x² + 3x + 5", "1/x + 2", "√x + 3", "x⁻¹ + 4"], correct: 0 },
    { question: "What is the degree of the polynomial 3x⁴ + 2x³ - x + 7?", options: ["1", "3", "4", "7"], correct: 2 },
    { question: "What is the zero of the polynomial x - 5?", options: ["5", "-5", "0", "None of the above"], correct: 0 }
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

    quizData.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedOption) {
            userResponses.push({ question: q.question, selected: q.options[selectedOption.value], correct: q.options[q.correct] });

            if (parseInt(selectedOption.value) === q.correct) {
                score++;
                selectedOption.parentElement.classList.add("correct");
            } else {
                selectedOption.parentElement.classList.add("incorrect");
            }
        }
    });

    document.getElementById("result").innerHTML = `You scored ${score} out of ${quizData.length}!`;
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
        y += 10;
    });

    doc.save("quiz_results.pdf");
}

window.onload = loadQuiz;
