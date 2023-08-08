"use strict";
// Select element
const scoreEl = document.querySelector(".score");
const timeEl = document.querySelector(".time");
const imageEl = document.querySelector("img");
const answerEl = document.querySelector("#answer");
const selectWordEl = document.querySelector(".select_word");
const btnSuggest = document.querySelector(".btn_suggest");
const btnNext = document.querySelector(".btn_next");
const resultEl = document.querySelector("#result");
const statusResultEl = document.querySelector(".status_result");
const answerResultEl = document.querySelector(".answer_result");
const suggestEL = document.querySelector(".suggest");

let q = 1;
let score = 0;
let sg = 3;
let arrCharacterAnswer = [];
let len;
let arrAnswer;
let time = 30;
let intervalID;
// Get random letter
const getRandomLetter = function () {
  const alphabet = "ABCDEGHIKLMNOPQRSTUVXY";
  const randomIndex = Math.trunc(Math.random() * alphabet.length);
  return alphabet[randomIndex];
};
// Create array character from answer
const getArrayCharacter = function (answer) {
  const normalizedStr = answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const arrCharacter = normalizedStr.split("");
  return arrCharacter;
};
// Shuffle an array
function shuffleArray(array) {
  let arrShuffle = [];
  let len = array.length;
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * array.length);
    arrShuffle.push(array[randomIndex]);
    array.splice(randomIndex, 1);
  }
  return arrShuffle;
}

const displayCellsAnswer = function (arrCharacter) {
  let html = "";
  for (let i = 0; i < arrCharacter.length; i++) {
    html = `<div class="${
      arrCharacter[i] === " " ? "space" : "cell_answer"
    }" data-cell="" data-stt='${i}'></div>`;
    answerEl.innerHTML += html;
  }
};

const displayCellsSelect = function (arrCharacter) {
  let arrCellsSelect = [];
  arrCellsSelect = arrCharacter.filter((c) => c !== " ");
  let len = arrCellsSelect.length;
  for (let i = 0; i < len; i++) {
    arrCellsSelect.push(getRandomLetter());
  }
  // console.log(arrCellsSelect);
  const arrCellsShuff = shuffleArray(arrCellsSelect);
  for (let i = 0; i < arrCellsShuff.length; i++) {
    let html = `<li class="word" data-cell='${i}'>${arrCellsShuff[i]}</li>`;
    selectWordEl.innerHTML += html;
  }
};

const displayListCells = function (answer) {
  // Create array character from answer
  const arrCharacter = getArrayCharacter(answer);
  // Create cells answer
  displayCellsAnswer(arrCharacter);
  // Create cells select
  displayCellsSelect(arrCharacter);
};

const displayQuestion = function (question) {
  imageEl.src = question.url_image;
  displayListCells(question.answer);
};

const checkAnswer = function (cellAnswer) {
  selectWordEl.style.display = "none";
  resultEl.style.display = "block";
  // Get answer of player
  console.log("finish");
  let answer = "";
  // const cellAnswer = document.querySelectorAll(".cell_answer");
  cellAnswer.forEach((cell) => {
    answer += cell.innerText;
  });

  // Get answer of computer
  const arrCharacter = getArrayCharacter(questions[q - 1].answer);
  let strCharacter = "";
  for (let i = 0; i < arrCharacter.length; i++) {
    if (arrCharacter[i] !== " ") {
      strCharacter += arrCharacter[i];
    }
  }
  if (answer === strCharacter) {
    console.log("Correct !");
    score += 5;
    scoreEl.textContent = score;
    statusResultEl.classList.add("correct");
    statusResultEl.textContent = "Chính Xác !";
  } else {
    console.log("Wrong !");
    console.log(answer);
    statusResultEl.classList.remove("correct");
    statusResultEl.classList.add("incorrect");
    statusResultEl.textContent = "Không Chính Xác !";
  }
  // Display answer of cumputer
  answerResultEl.textContent = `Đáp án là: ${questions[q - 1].answer}`;
  clearInterval(intervalID);
};

const countdown = function () {
  const getTime = function () {
    if (time < 0 && q < questions.length) {
      nextQuestion();
      timeEl.textContent = "30 s";
      sg = 3;
    } else if (time == 0 && q === questions.length) {
      timeEl.textContent = "0 s";
    } else {
      timeEl.textContent = time + " s";
      time--;
    }
    if (time < 6) {
      timeEl.style.color = "red";
    }
    if (time > 5) {
      timeEl.style.color = "black";
    }
  };
  intervalID = setInterval(getTime, 1000);
};

const nextQuestion = function () {
  clearInterval(intervalID);
  if (q < questions.length) {
    imageEl.src = "";
    answerEl.innerHTML = "";
    selectWordEl.innerHTML = "";

    displayQuestion(questions[q]);
    q++;
    sg = 3;
    suggestEL.textContent = sg;
    selectWordEl.style.display = "flex";
    resultEl.style.display = "none";
    arrAnswer = getArrayCharacter(questions[q - 1].answer);
    time = 30;
  } else {
    alert("Bạn đã hoàn thành tất cả câu hỏi");
  }
};

displayQuestion(questions[0]);
countdown();

btnNext.addEventListener("click", function () {
  nextQuestion();
  countdown();
  sg = 3;
});
// Click select a letter form list letter
selectWordEl.addEventListener("click", function (e) {
  const cellAnswer = document.querySelectorAll(".cell_answer");
  const arrCell = [];
  cellAnswer.forEach((cell) => {
    if (cell.innerText === "") {
      arrCell.push(cell);
    }
  });
  arrCell[0].innerText = e.target.innerText;
  arrCell[0].dataset.cell = e.target.dataset.cell;
  e.target.innerText = "";
  if (arrCell.length === 1) {
    checkAnswer(cellAnswer);
  }
});
// Undo letter selected
answerEl.addEventListener("click", function (e) {
  const cellSelect = document.querySelectorAll(".word");
  cellSelect.forEach((cell) => {
    if (cell.dataset.cell === e.target.dataset.cell) {
      cell.innerText = e.target.innerText;
    }
  });
  e.target.innerText = "";
});

arrAnswer = getArrayCharacter(questions[q - 1].answer);
btnSuggest.addEventListener("click", function () {
  const cellAnswer = document.querySelectorAll(".cell_answer");
  const arrCell = [];
  if (sg === 0) {
    alert("Bạn đã hết lượt xem gợi ý");
    suggestEL.textContent = 0;
  } else if (sg > 0 && sg < 4) {
    const arrLetter = [];
    if (sg < 1) {
      suggestEL.textContent = 0;
    }

    // Remove element space
    cellAnswer.forEach((cell) => {
      if (cell.innerText !== "") {
        arrLetter.push(cell.innerText);
      }
    });
    if (sg === 3 && arrLetter.length === 0) {
      arrCharacterAnswer = arrAnswer.filter((el) => el !== " ");
    } else if (sg === 3 && arrLetter.length > 0) {
      // Remove letter exits
      const arrCharacter = arrAnswer.filter((el) => el !== " ");
      arrCharacterAnswer = arrCharacter.slice(arrLetter.length);
      console.log(arrCharacterAnswer);
    }

    len = arrCharacterAnswer.length;
    // Get random letter of array answer
    let index = Math.trunc(Math.random() * len);
    let letter = arrCharacterAnswer[index];
    console.log(letter);
    // Remove letter suggested
    arrCharacterAnswer.splice(index, 1);
    console.log(arrCharacterAnswer);
    // Get index of arrAnswer
    let stt;
    for (let i = 0; i < arrAnswer.length; i++) {
      if (arrAnswer[i] === letter) {
        stt = i;
      }
    }
    arrAnswer[stt] = "*";
    console.log(stt);
    // Display cell suggest random
    cellAnswer.forEach((cell) => {
      if (cell.dataset.stt == stt) {
        cell.innerText = letter;
      }
    });
    sg--;
    if (sg >= 0) {
      suggestEL.textContent = sg;
    }
    cellAnswer.forEach((cell) => {
      if (cell.innerText === "") {
        arrCell.push(cell);
      }
    });
    if (arrCell.length === 0) {
      checkAnswer(cellAnswer);
    }
  }
});
