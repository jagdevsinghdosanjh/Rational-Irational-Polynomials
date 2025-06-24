let currentVersion = "1";
let storageKey = "";
let shuffledQuiz = [];
let logoBase64 = null;
let stampBase64 = null;

const versionTitles = {
  "1": "Chapter 1 - Number Systems",
  "2": "Chapter 2 - Polynomials",
  "3": "Chapter 3 - Coordinate Geometry",
  "4": "Chapter 4 - Linear Equations in Two Variables",
  "5": "Chapter 5 - Introduction to Euclid's Geometry",
  "6": "Chapter 6 - Lines and Angles",
  "7": "Chapter 7 - Triangles",
  "8": "Chapter 8 - Quadrilaterals",
  "9": "Chapter 9 - Circles",
  "10": "Chapter 10 - Heron's Formula",
  "11": "Chapter 11 - Surface Areas and Volumes",
  "12": "Chapter 12 - Statistics",
  "13": "Chapters 1 to 6",
  "14": "Chapters 7 to 12"
};

// Load logo
const logoImage = new Image();
logoImage.src = "logo.jpeg";
logoImage.onload = () => {
  const canvas = document.createElement("canvas");
  canvas.width = logoImage.width;
  canvas.height = logoImage.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(logoImage, 0, 0);
  logoBase64 = canvas.toDataURL("image/jpeg");
};

// Load stamp
const stampImage = new Image();
stampImage.src = "stamp.jpeg";
stampImage.onload = () => {
  const canvas = document.createElement("canvas");
  canvas.width = stampImage.width;
  canvas.height = stampImage.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(stampImage, 0, 0);
  stampBase64 = canvas.toDataURL("image/jpeg");
};

// Shuffle utility
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Load quiz
async function loadQuiz() {
  const version = document.getElementById("versionSelect").value;
  currentVersion = version;
  storageKey = `quizResults_v${version}`;
  document.getElementById("result").textContent = "";
  document.getElementById("explanation").innerHTML = "";
  document.getElementById("downloadBtn").disabled = true;

  try {
    const response = await fetch(`quizzes/quiz_v${version}.json`);
    const quiz = await response.json();
    shuffledQuiz = JSON.parse(JSON.stringify(quiz));

    shuffledQuiz.forEach(q => {
      const correctVal = q.options[q.correct];
      shuffleArray(q.options);
      q.correct = q.options.indexOf(correctVal);
    });
    shuffleArray(shuffledQuiz);

    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = "";
    shuffledQuiz.forEach((q, i) => {
      let html = `<p><strong>${i + 1}. ${q.question}</strong></p>`;
      q.options.forEach((opt, j) => {
        html += `<label><input type="radio" name="question${i}" value="${j}"> ${opt}</label><br>`;
      });
      quizContainer.innerHTML += html + "<br>";
    });

    localStorage.removeItem(storageKey);
  } catch (error) {
    document.getElementById("quiz").innerHTML = "Error loading quiz. Please check the file.";
    console.error("Fetch error:", error);
  }
}

// Submit and evaluate quiz
function submitQuiz() {
  let score = 0;
  const responses = [];
  const studentName = document.getElementById("studentName").value.trim();
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
    explanationHTML += `<p><strong>${i + 1}. ${res.question}</strong><br>Your answer: ${res.selected}<br>Correct answer: ${res.correct}<br>Explanation: ${res.explanation}</p>`;
  });

  document.getElementById("explanation").innerHTML = explanationHTML;
  localStorage.setItem(storageKey, JSON.stringify({ score, responses }));
  localStorage.setItem("studentName", studentName);
  document.getElementById("downloadBtn").disabled = false;
}

// PDF Generator
function generatePDF() {
  const data = JSON.parse(localStorage.getItem(storageKey));
  const studentName = localStorage.getItem("studentName") || "Unnamed Student";
  if (!data) {
    alert("Please submit the quiz first.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginTop = 20, marginBottom = 20, marginLeft = 15, marginRight = 15;
  const usableWidth = pageWidth - marginLeft - marginRight;
  let y = marginTop;

  const title = versionTitles[currentVersion] || `Quiz v${currentVersion}`;
  const safeTitle = title.replace(/[\\/ :*?"<>|]/g, "-");
  const now = new Date();
  const dateString = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/\//g, "-");

  if (logoBase64) {
    doc.addImage(logoBase64, "JPEG", marginLeft, y, 30, 20);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`${title} - Quiz Results`, marginLeft + 35, y + 5);
  doc.setFontSize(11);
  doc.text(`Name: ${studentName}`, marginLeft + 35, y + 12);
  doc.text(`Date: ${now.toDateString()}`, marginLeft + 35, y + 18);
  doc.text(`Score: ${data.score} / ${data.responses.length}`, marginLeft + 35, y + 24);
  y += 30;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  data.responses.forEach((res, index) => {
  const block = [
    `${index + 1}. ${res.question}`,
    `Your answer: ${res.selected}`,
    `Correct answer: ${res.correct}`,
    `Explanation: ${res.explanation}`
  ];

  // Estimate total height before printing the block
  const totalHeight = block.reduce((acc, line) => {
    const wrapped = doc.splitTextToSize(line, usableWidth);
    return acc + wrapped.length * 6;
  }, 0);

  if (y + totalHeight > pageHeight - marginBottom) {
    doc.addPage();
    y = marginTop;
  }

  block.forEach(line => {
    const wrapped = doc.splitTextToSize(line, usableWidth);
    doc.text(wrapped, marginLeft, y);
    y += wrapped.length * 6;
  });

  y += 4; // extra spacing between questions
});


  // data.responses.forEach((res, index) => {
  //   const block = [
  //     `${index + 1}. ${res.question}`,
  //     `Your answer: ${res.selected}`,
  //     `Correct answer: ${res.correct}`,
  //     `Explanation: ${res.explanation}`
  //   ];
  //   block.forEach(line => {
  //     const wrapped = doc.splitTextToSize(line, usableWidth);
  //     if (y + wrapped.length * 6 > pageHeight - marginBottom) {
  //       doc.addPage();
  //       y = marginTop;
  //     }
  //     doc.text(wrapped, marginLeft, y);
  //     y += wrapped.length * 6;
  //   });
  //   y += 4;
  // });

  if (y + 40 > pageHeight - marginBottom) {
    doc.addPage();
    y = marginTop;
  }

  if (stampBase64) {
    const stampWidth = 30;
    const stampX = (pageWidth - stampWidth) / 2;
    doc.addImage(stampBase64, "JPEG", stampX, y, stampWidth, 30);
    y += 35;
  }

  doc.setFont("helvetica", "italic");
  doc.text("Teacher's Signature", (pageWidth - 60) / 2, y + 6);

  doc.save(`${safeTitle} (${dateString}).pdf`);
}

// Retake quiz
function retakeQuiz() {
  loadQuiz();
}

// Hook up the button
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("downloadBtn");
  if (btn) btn.addEventListener("click", generatePDF);
});


// let currentVersion = "1";
// let storageKey = "";
// let shuffledQuiz = [];
// let logoBase64 = null;
// let stampBase64 = null;

// const versionTitles = {
//   "1": "Chapter 1 - Number Systems",
//   "2": "Chapter 2 - Polynomials",
//   // ... add remaining mappings as needed
// };

// const logoImage = new Image();
// logoImage.src = "logo.jpeg";
// logoImage.onload = () => {
//   const canvas = document.createElement("canvas");
//   canvas.width = logoImage.width;
//   canvas.height = logoImage.height;
//   const ctx = canvas.getContext("2d");
//   ctx.drawImage(logoImage, 0, 0);
//   logoBase64 = canvas.toDataURL("image/jpeg");
// };

// const stampImage = new Image();
// stampImage.src = "stamp.jpeg";
// stampImage.onload = () => {
//   const canvas = document.createElement("canvas");
//   canvas.width = stampImage.width;
//   canvas.height = stampImage.height;
//   const ctx = canvas.getContext("2d");
//   ctx.drawImage(stampImage, 0, 0);
//   stampBase64 = canvas.toDataURL("image/jpeg");
// };

// function shuffleArray(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
// }

// // async function loadQuiz() {
// //   const version = document.getElementById("versionSelect").value;
// //   currentVersion = version;
// //   storageKey = `quizResults_v${version}`;
// //   document.getElementById("result").textContent = "";
// //   document.getElementById("explanation").innerHTML = "";
// //   document.getElementById("downloadBtn").disabled = true;

// //   try {
// //     const response = await fetch(`quizzes/quiz_v${version}.json`);
// //     const quiz = await response.json();
// //     shuffledQuiz = JSON.parse(JSON.stringify(quiz));

// //     shuffledQuiz.forEach(q => {
// //       const correctVal = q.options[q.correct];
// //       shuffleArray(q.options);
// //       q.correct = q.options.indexOf(correctVal);
// //     });
// //     shuffleArray(shuffledQuiz);

// //     const quizContainer = document.getElementById("quiz");
// //     quizContainer.innerHTML = "";
// //     shuffledQuiz.forEach((q, i) => {
// //       let html = `<p><strong>${i + 1}. ${q.question}</strong></p>`;
// //       q.options.forEach((opt, j) => {
// //         html += `<label><input type="radio" name="question${i}" value="${j}"> ${opt}</label><br>`;
// //       });
// //       quizContainer.innerHTML += html + "<br>";
// //     });

// //     localStorage.removeItem(storageKey);
// //   } catch (error) {
// //     document.getElementById("quiz").innerHTML = "Error loading quiz. Please check the file.";
// //     console.error("Fetch error:", error);
// //   }
// // }

// async function loadQuiz() {
//   const version = document.getElementById("versionSelect").value;
//   currentVersion = version;
//   storageKey = `quizResults_v${version}`;
//   document.getElementById("result").textContent = "";
//   document.getElementById("explanation").innerHTML = "";
//   document.getElementById("downloadBtn").disabled = true;

//   try {
//     const response = await fetch(`quizzes/quiz_v${version}.json`);
//     const quiz = await response.json();
//     shuffledQuiz = JSON.parse(JSON.stringify(quiz));

//     shuffledQuiz.forEach(q => {
//       const correctVal = q.options[q.correct];
//       shuffleArray(q.options);
//       q.correct = q.options.indexOf(correctVal);
//     });

//     shuffleArray(shuffledQuiz);

//     const quizContainer = document.getElementById("quiz");
//     quizContainer.innerHTML = "";
//     shuffledQuiz.forEach((q, i) => {
//       let html = `<p><strong>${i + 1}. ${q.question}</strong></p>`;
//       q.options.forEach((opt, j) => {
//         html += `<label><input type="radio" name="question${i}" value="${j}"> ${opt}</label><br>`;
//       });
//       quizContainer.innerHTML += html + "<br>";
//     });

//     localStorage.removeItem(storageKey);
//   } catch (error) {
//     document.getElementById("quiz").innerHTML = "Error loading quiz. Please check the file.";
//     console.error("Fetch error:", error);
//   }
// }


// function submitQuiz() {
//   let score = 0;
//   const responses = [];
//   const studentName = document.getElementById("studentName").value.trim();
//   let explanationHTML = "<h2>Explanations:</h2>";

//   shuffledQuiz.forEach((q, i) => {
//     const selected = document.querySelector(`input[name="question${i}"]:checked`);
//     const selectedIndex = selected ? parseInt(selected.value) : null;
//     const isCorrect = selectedIndex === q.correct;
//     responses.push({
//       question: q.question,
//       selected: selectedIndex !== null ? q.options[selectedIndex] : "Not answered",
//       correct: q.options[q.correct],
//       explanation: q.explanation,
//       isCorrect
//     });
//     if (isCorrect) score++;
//   });

//   document.getElementById("result").textContent = `You scored ${score} out of ${shuffledQuiz.length}!`;

//   responses.forEach((res, i) => {
//     explanationHTML += `<p><strong>${i + 1}. ${res.question}</strong><br>Your answer: ${res.selected}<br>Correct answer: ${res.correct}<br>Explanation: ${res.explanation}</p>`;
//   });

//   document.getElementById("explanation").innerHTML = explanationHTML;
//   localStorage.setItem(storageKey, JSON.stringify({ score, responses }));
//   localStorage.setItem("studentName", studentName);
//   document.getElementById("downloadBtn").disabled = false;
// }

// function generatePDF() {
//   const data = JSON.parse(localStorage.getItem(storageKey));
//   const studentName = localStorage.getItem("studentName") || "Unnamed Student";
//   if (!data) {
//     alert("Please submit the quiz first.");
//     return;
//   }

//   const { jsPDF } = window.jspdf;
//   const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const marginTop = 20, marginBottom = 20, marginLeft = 15, marginRight = 15;
//   const usableWidth = pageWidth - marginLeft - marginRight;
//   let y = marginTop;

//   const title = versionTitles[currentVersion] || `Quiz v${currentVersion}`;
//   const safeTitle = title.replace(/[\\/ :*?"<>|]/g, "-");
//   const now = new Date();
//   const dateString = now.toLocaleDateString("en-GB", {
//     day: "2-digit", month: "short", year: "numeric"
//   }).replace(/\//g, "-");

//   if (logoBase64) {
//     doc.addImage(logoBase64, "JPEG", marginLeft, y, 30, 20);
//   }

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(14);
//   doc.text(`${title} - Quiz Results`, marginLeft + 35, y + 5);
//   doc.setFontSize(11);
//   doc.text(`Name: ${studentName}`, marginLeft + 35, y + 12);
//   doc.text(`Date: ${now.toDateString()}`, marginLeft + 35, y + 18);
//   doc.text(`Score: ${data.score} / ${data.responses.length}`, marginLeft + 35, y + 24);
//   y += 30;

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(11);

//   data.responses.forEach((res, index) => {
//     const block = [
//       `${index + 1}. ${res.question}`,
//       `Your answer: ${res.selected}`,
//       `Correct answer: ${res.correct}`,
//       `Explanation: ${res.explanation}`
//     ];
//     block.forEach(line => {
//       const wrapped = doc.splitTextToSize(line, usableWidth);
//       if (y + wrapped.length * 6 > pageHeight - marginBottom) {
//         doc.addPage();
//         y = marginTop;
//       }
//       doc.text(wrapped, marginLeft, y);
//       y += wrapped.length * 6;
//     });
//     y += 4;
//   });

//   if (y + 40 > pageHeight - marginBottom) {
//     doc.addPage();
//     y = marginTop;
//   }

//   if (stampBase64) {
//     const stampWidth = 30;
//     const stampX = (pageWidth - stampWidth) / 2;
//     doc.addImage(stampBase64, "JPEG", stampX, y, stampWidth, 30);
//     y += 35;
//   }

//   doc.setFont("helvetica", "italic");
//   doc.text("Teacher's Signature", (pageWidth - 60) / 2, y