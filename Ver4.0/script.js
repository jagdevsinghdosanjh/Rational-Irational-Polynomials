//Ver4.0 - Polynomial Quiz Application (script.js)
const quizVersions = {
  "1": [
    {
      question: "Which is a rational number?",
      options: ["π", "√2", "3/4", "0.333..."],
      correct: 2,
      explanation: "3/4 is rational because it's a ratio of integers."
    },
    {
      question: "√9 is a ...",
      options: ["Rational", "Irrational", "Prime", "None"],
      correct: 0,
      explanation: "√9 = 3 which is rational."
    }
  ],
  "2": [
    {
      question: "Which is a polynomial?",
      options: ["2x^2 + 1", "1/x", "√x + 3", "x⁻² + 4"],
      correct: 0,
      explanation: "Polynomials can't have variables in denominators, roots, or negative powers."
    },
    {
      question: "Degree of 5x⁴ - x + 7?",
      options: ["2", "3", "4", "5"],
      correct: 2,
      explanation: "Highest power is 4, so degree is 4."
    }
  ],
  "3": [
    {
      question: "Which of these is irrational?",
      options: ["√5", "0.25", "2", "3/5"],
      correct: 0,
      explanation: "√5 is irrational because it can't be written as a ratio of integers."
    },
    {
      question: "π is ...",
      options: ["Rational", "Irrational", "Both", "None"],
      correct: 1,
      explanation: "π is irrational—non-repeating, non-terminating decimal."
    }
  ]
};

let currentVersion = "4.0";
let shuffledQuiz = [];
let storageKey = "";

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function loadQuiz() {
  const version = document.getElementById("versionSelect").value;
  currentVersion = version;
  storageKey = `quizResults_v${version}`;
  localStorage.removeItem(storageKey);
  document.getElementById("result").textContent = "";
  document.getElementById("explanation").innerHTML = "";
  document.getElementById("downloadBtn").disabled = true;

  const quiz = JSON.parse(JSON.stringify(quizVersions[version]));
  quiz.forEach(q => {
    const correctVal = q.options[q.correct];
    shuffleArray(q.options);
    q.correct = q.options.indexOf(correctVal);
  });

  shuffleArray(quiz);
  shuffledQuiz = quiz;

  const quizContainer = document.getElementById("quiz");
  quizContainer.innerHTML = "";
  quiz.forEach((q, i) => {
    let html = `<p><strong>${i + 1}. ${q.question}</strong></p>`;
    q.options.forEach((opt, j) => {
      html += `<label><input type="radio" name="question${i}" value="${j}"> ${opt}</label><br>`;
    });
    quizContainer.innerHTML += html + "<br>";
  });
}

function submitQuiz() {
  let score = 0;
  const responses = [];
  let explanationHTML = "<h2>Explanations:</h2>";

  shuffledQuiz.forEach((q, i) => {
    const selected = document.querySelector(`input[name="question${i}"]:checked`);
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

  document.getElementById("result").textContent = `You scored ${score} out of ${shuffledQuiz.length}!`;

  responses.forEach((res, i) => {
    explanationHTML += `<p><strong>${i + 1}. ${res.question}</strong><br>
      Your answer: ${res.selected}<br>
      Correct answer: ${res.correct}<br>
      Explanation: ${res.explanation}</p>`;
  });

  document.getElementById("explanation").innerHTML = explanationHTML;
  localStorage.setItem(storageKey, JSON.stringify({ score, responses }));
  document.getElementById("downloadBtn").disabled = false;
}

function generatePDF() {
  const data = JSON.parse(localStorage.getItem(storageKey));
  if (!data) {
    alert("Please submit the quiz first.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`Quiz v${currentVersion} - Results`, 20, 15);

  doc.setFontSize(13);
  doc.text(`Score: ${data.score} / ${data.responses.length}`, 20, y);
  y += 10;

  data.responses.forEach((res, index) => {
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

  doc.save(`quiz_v${currentVersion}_results.pdf`);
}

function retakeQuiz() {
  loadQuiz();
  document.getElementById("result").textContent = "";
  document.getElementById("explanation").innerHTML = "";
  document.getElementById("downloadBtn").disabled = true;
}

document.addEventListener("DOMContentLoaded", () => {
  const downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) downloadBtn.addEventListener("click", generatePDF);
});
