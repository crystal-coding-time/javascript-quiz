/* --------------- Query Selectors --------------- */

let quiz = document.querySelector("#quiz");
let intro = document.querySelector("#introduction");
let assesFT = document.querySelector("#assess-ft");
let progressBar = document.querySelector(".progress");
let startBtn = document.querySelector("#startBtn");
let spanTime = document.querySelector("#spanTime");
let questionH5 = document.querySelector("#question");
let answersDiv = document.querySelector("#answers");
let allDone = document.querySelector("#allDone");
let finalScore = document.querySelector("#finalScore");
let submit = document.querySelector("#submit");
let highScoresList = document.querySelector("#highScoresList");
let initials = document.querySelector("#initials");
let resetHighscoresBtn = document.querySelector("#resetHighscoresBtn");

/* ------- Global Variable Declarations ------- */

let totalSeconds = 100;
let timeRemining = totalSeconds;
let secondsElapsed = 0;
let discountSeconds = 0;
let currentQuestion = 0;
let progress = 0;
let correctAnswers = 0;
let correctScore = 0;
var localHighscoresArray = [];
let time = setInterval(timer, 1000);
let justRegistered = false;
clearInterval(time);

/* ------------- Event Management ------------- */

startBtn.addEventListener("click", startQuiz);
answersDiv.addEventListener("click", assesSelection);
submit.addEventListener("click", addToHighscores);
resetHighscoresBtn.addEventListener("click", clearHighscores);
$("#staticBackdrop").on("shown.bs.modal", function (e) {
  loadHighScores();
});
$("#staticBackdrop").on("hidden.bs.modal", function (e) {
  if (justRegistered) {
    init();
  }
});

init();

/* ------------- Functions Declaration ------------- */

function init() {
  spanTime.textContent = timeRemining;
  quiz.style.display = "none";
  allDone.style.display = "none";
  assesFT.style.display = "none";
  intro.style.display = "block";
  startBtn.style.display = "block";
  progressBar.style.display = "none";

  totalSeconds = 100;
  timeRemining = totalSeconds;
  secondsElapsed = 0;
  discountSeconds = 0;
  currentQuestion = 0;
  progress = 0;
  correctAnswers = 0;
  correctScore = 0;
  justRegistered = false;
  spanTime.textContent = timeRemining;

  if (localStorage.getItem("highscore")) {
    localHighscoresArray = localStorage.getItem("highscore").split(",");
  }
  clearInterval(time);
  updateProgress();

  allDone.firstElementChild.setAttribute("class", "alert alert-info mt-0 mb-0");
  submit.setAttribute("class", "btn btn-info");
  progressBar.firstElementChild.setAttribute(
    "class",
    "progress-bar bg-info progress-bar-striped progress-bar-animated"
  );
}

function startQuiz() {
  intro.style.display = "none";
  startBtn.style.display = "none";
  quiz.style.display = "block";
  time = setInterval(timer, 1000);
  progressBar.style.display = "block";
  showQuestion();
}

function timer() {
  timeRemining = totalSeconds - secondsElapsed - 1 - discountSeconds;
  spanTime.textContent = timeRemining;
  secondsElapsed++;
  if (timeRemining <= 0) {
    clearInterval(time);
    disableQuestions();
    gameOver("time_out");
  }
}

function showQuestion() {
  questionH5.textContent = quizQuestions[currentQuestion].question;
  var optionsBtnsArray = [];
  var indexArray = [];
  var image = document.createElement("img");

  for (i = 0; i < quizQuestions[currentQuestion].options.length; i++) {
    var questionBtn = document.createElement("button");
    questionBtn.setAttribute("type", "button");
    questionBtn.setAttribute(
      "class",
      "list-group-item list-group-item-action list-group-item-info mt-1 answerButton"
    );
    questionBtn.setAttribute("data-index", i);
    if (i === 0) {
      questionBtn.setAttribute("correct", "yes");
    } else {
      questionBtn.setAttribute("correct", "no");
    }
    questionBtn.textContent = quizQuestions[currentQuestion].options[i];
    answersDiv.append(questionBtn);
    indexArray.push(i);
  }

  answersDiv.childNodes.forEach(function (child) {
    var rndIndex = Math.floor(Math.random() * indexArray.length);
    answersDiv.append(answersDiv.children[rndIndex]);
    indexArray.splice(rndIndex, 1);
  });
}

function disableQuestions() {
  let questionsAssed = document.querySelectorAll(".answerButton");
  questionsAssed.forEach((element) => {
    element.setAttribute(
      "class",
      "list-group-item list-group-item-action list-group-item-danger mt-1 answerButton disabled"
    );
    if (
      parseInt(element.getAttribute("data-index")) ===
      quizQuestions[currentQuestion].correct
    ) {
      element.setAttribute(
        "class",
        "list-group-item list-group-item-action list-group-item-success mt-1 answerButton disabled"
      );
    }
  });
}

function assesSelection(event) {
  if (event.target.matches("button")) {
    var index = parseInt(event.target.getAttribute("data-index"));
    var timeInterval = 1000;
    disableQuestions();
    if (event.target.getAttribute("correct") === "yes") {
      displayFTAlert(true);
      correctAnswers++;
    } else {
      discountSeconds += 5; // When the wrong answer is selected, 5 seconds is removed from the total time
      clearInterval(time);
      time = setInterval(timer, 1000);
      displayFTAlert(false);
    }
    currentQuestion++;
    updateProgress();

    if (currentQuestion === quizQuestions.length) {
      timeInterval = 5000;
      gameOver("questions_done");
    } else {
      setTimeout(removeQuestionsButtons, 1000);
      setTimeout(showQuestion, 1001);
    }

    setTimeout(function () {
      assesFT.style.display = "none";
    }, timeInterval);
  }
}

/* --------------- This targets the progress bar --------------- */ 
function updateProgress() {
  progress = Math.floor((currentQuestion / quizQuestions.length) * 100);
  var styleStr = String("width: " + progress + "%; height: 100%;"); 
  progressBar.firstElementChild.setAttribute("style", styleStr);
  progressBar.firstElementChild.textContent = progress + " %";
  correctScore = Math.floor((correctAnswers / quizQuestions.length) * 100);
}

function displayFTAlert(correct) {
  if (correct) {
    assesFT.setAttribute(
      "class",
      "alert alert-success mt-0 mb-0 pt-0 pb-0 text-center"
    );
    assesFT.innerHTML = "<strong>Correct</strong>";
    assesFT.style.display = "block";
  } else {
    assesFT.setAttribute(
      "class",
      "alert alert-danger mt-0 mb-0 pt-0 pb-0 text-center"
    );
    assesFT.innerHTML =
      "<strong>Incorrect. </strong> 5 Second Penalty";
    assesFT.style.display = "block";
    spanTime.style.color = "red";
    setTimeout(function () {
      spanTime.style.color = "black";
    }, 1000);
  }
}

function removeQuestionsButtons() {
  questionH5.textContent = "";
  var child = answersDiv.lastElementChild;
  while (child) {
    answersDiv.removeChild(child);
    child = answersDiv.lastElementChild;
  }
}

/* --------------- This is for the end of the game --------------- */ 
function gameOver(cause) {
  if (cause === "questions_done") {
    console.log("QUESTIONS DONE");
    setTimeout(() => {
      assesFT.setAttribute(
        "class",
        "alert alert-dark mt-0 mb-0 pt-0 pb-0 text-center"
      );
      assesFT.innerHTML = "<strong>Quiz Completed</strong>";
    }, 1500);
    clearInterval(time);
  } else if (cause === "time_out") {
    console.log("TIME OUT");
    disableQuestions();
    setTimeout(() => {
    }, 4000);
    assesFT.setAttribute(
      "class",
      "alert alert-info mt-0 mb-0 pt-0 pb-0 text-center"
    );
    assesFT.innerHTML = "<strong>Time finished</strong> Good luck!";
  } else {
    return false;
  }
  assesFT.style.display = "block";
  if (correctScore >= 70) {
    setTimeout(() => {
    }, 5000);
  } else {
    setTimeout(() => {
      allDone.firstElementChild.setAttribute(
        "class",
        "alert alert-danger mt-0 mb-0"
      );
      progressBar.firstElementChild.setAttribute(
        "class",
        "progress-bar bg-danger progress-bar-striped progress-bar-animated"
      );
      submit.setAttribute("class", "btn btn-danger");
    }, 5000);
  }
  setTimeout(function () {
    finalScore.textContent = correctScore;
    quiz.style.display = "none";
    allDone.style.display = "block";
    assesFT.style.display = "none";
    removeQuestionsButtons();
  }, 5000);
}

function addToHighscores() {
  var highScoreElement = document.createElement("li");
  var highscoreStr = initials.value + " - " + correctScore;
  localHighscoresArray.push(highscoreStr);
  var highscoreArrayStr = localHighscoresArray.toString();
  highScoreElement.textContent = highscoreStr;
  highScoresList.append(highScoreElement);
  localStorage.setItem("highscore", localHighscoresArray);
  justRegistered = true;
  initials.value = "";
}

/* --------------- This stores the users score --------------- */ 
function loadHighScores() {
  var tempHighscoresArray = [];
  var tempHighscoresObject = {};
  var tempHighscoresObjectsArray = [];
  var tempLocalSCoreArray = [];
  while (highScoresList.hasChildNodes()) {
    highScoresList.removeChild(highScoresList.childNodes[0]);
  }
  var lastPos;
  var lastChar = "";
  var localScore = 0;
  var localStrScore = "";
  var tempHighscore = "";
  for (i = 0; i < localHighscoresArray.length; i++) {
    for (j = localHighscoresArray[i].length - 1; j >= 0; j--) {
      lastPos = localHighscoresArray[i].length - 1;
      lastChar = localHighscoresArray[i][lastPos - j];
      if (lastChar && lastChar >= 0 && lastChar <= 9) {
        localScore += lastChar;
      }
      if (j > 1) {
        if (j === 2 && lastChar === "1") {
        }
        localStrScore += lastChar;
      }

      localScore = parseInt(localScore);
    }

    tempHighscore = localScore + localStrScore;
    tempHighscoresArray.push(tempHighscore);
    tempHighscoresObject.score = localScore;
    tempHighscoresObject.scoreStr = localStrScore;

    tempHighscoresObjectsArray.push(tempHighscoresObject);
    tempLocalSCoreArray.push(localScore);
    localScore = 0;
    localStrScore = "";
    tempHighscoresObject = {};
  }
  tempLocalSCoreArray.sort(function (a, b) {
    return b - a;
  });
  var sortedScoresCompleteArray = [];
  var flagged = [];
  tempLocalSCoreArray.forEach(function (element) {
    tempHighscoresObjectsArray.forEach(function (object, index) {
      if (element === object.score && !flagged.includes(index)) {
        flagged.push(index);

        var tempScoreString = object.scoreStr + " " + object.score;
        sortedScoresCompleteArray.push(tempScoreString);
      }
    });
  });
  for (i = 0; i < sortedScoresCompleteArray.length; i++) {
    var highScoreElement = document.createElement("li");
    highScoreElement.textContent = sortedScoresCompleteArray[i];
    for (j = sortedScoresCompleteArray[i].length - 1; j >= 0; j--) {
      lastPos = sortedScoresCompleteArray[i].length - 1;
      lastChar = sortedScoresCompleteArray[i][lastPos - j];
      if (lastChar && lastChar >= 0 && lastChar <= 9) {
        localScore += lastChar;
      }
      if (j > 1) {
        localStrScore += lastChar;
      }

      localScore = parseInt(localScore);
    }

    tempHighscore = localScore + localStrScore;

    if (localScore > 80 && localScore <= 100) {
      highScoreElement.setAttribute(
        "class",
        "list-group-item list-group-item-success"
      );
    } else if (localScore > 70 && localScore <= 80) {
      highScoreElement.setAttribute(
        "class",
        "list-group-item list-group-item-info"
      );
    } else if (localScore > 60 && localScore <= 70) {
      highScoreElement.setAttribute(
        "class",
        "list-group-item list-group-item-primary"
      );
    } else if (localScore > 50 && localScore <= 60) {
      highScoreElement.setAttribute(
        "class",
        "list-group-item list-group-item-warning"
      );
    } else if (localScore <= 50) {
      highScoreElement.setAttribute(
        "class",
        "list-group-item list-group-item-danger"
      );
    }

    highScoresList.append(highScoreElement);
    tempHighscoresArray.push(tempHighscore);
    tempHighscoresObject.score = localScore;
    tempHighscoresObject.scoreStr = localStrScore;
    tempHighscoresObjectsArray.push(tempHighscoresObject);
    tempLocalSCoreArray.push(localScore);
    localScore = 0;
    localStrScore = "";
    tempHighscoresObject = {};
  }
}

/* --------------- This clears the highscore on the local storage --------------- */ 
function clearHighscores() {
  localHighscoresArray = [];
  localStorage.setItem("highscore", localHighscoresArray);
  loadHighScores();
}
