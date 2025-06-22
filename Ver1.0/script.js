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
    quizData.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedOption) {
            if (parseInt(selectedOption.value) === q.correct) {
                score++;
                selectedOption.parentElement.classList.add("correct");
            } else {
                selectedOption.parentElement.classList.add("incorrect");
            }
        }
    });

    document.getElementById("result").innerHTML = `You scored ${score} out of ${quizData.length}!`;
}

window.onload = loadQuiz;
