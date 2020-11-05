const GameState = Object.freeze({
  WELCOMING: Symbol("welcome"),
  BEGIN: Symbol("BEGIN"),
  QUIZ: Symbol("quiz"),
  ANSWERVALIDATION: Symbol("ANSWERVALIDATION"),
  EXIT: Symbol("EXIT"),
});

const QuizFILE = require("./www/questions.json");
const TOTALNOQUESTIONS = 10;

function Game() {
  this.stateCur = GameState.WELCOMING;
  this.countCur = 0;
  this.questionID = {};
  this.questionCur = null;
  this.playerCur = 1;
  this.scoresCur = 0;
}

function RandomNumber(n) {
  return Math.ceil(Math.random() * n);
}

Game.prototype.quiz = function () {
  let randomID;
  do {
    randomID = RandomNumber(10);
  } while (this.questionID[randomID]);

  this.questionID[randomID] = true;
  this.countCur++;
  return randomID;
};

Game.prototype.resetState = function () {
  this.countCur = 0;
  this.questionID = {};
  this.questionCur = null;
  this.playerCur = 1;
  this.scoresCur = 0;
};

Game.prototype.makeAMove = function (inputMsg) {
  let sReply = "";

  switch (this.stateCur) {
    case GameState.WELCOMING:
      sReply = `Hello, how well do you know about Canada. 
        This quiz is based on the general knowledge questions of Canada. 
        Type \"Begin\" to begin the quiz`;
      this.stateCur = GameState.BEGIN;
      break;

    case GameState.BEGIN:
      this.resetState();
      if (inputMsg && inputMsg.toLowerCase().match("begin")) {
        this.stateCur = GameState.QUIZ;
        sReply = `Instructions:
        -Every Question has 4 options.
        -Enter the alphabet associated with each question 
        and press Enter.
        Type any key and hit Enter to begin the quiz`;
      } else {
        sReply = 'Type "Begin" to start the quiz';
      }
      break;

    case GameState.QUIZ:
      if (this.countCur === TOTALNOQUESTIONS) {
        this.stateCur = GameState.EXIT;
        break;
      }
      const questionId = this.quiz();
      this.questionCur = questionId;

      sReply = `${QuizFILE[questionId].question}
            a)  ${QuizFILE[questionId].options[0]}
            b)  ${QuizFILE[questionId].options[1]}
            c)  ${QuizFILE[questionId].options[2]}
            d)  ${QuizFILE[questionId].options[3]}
            Please type your answer
          `;
      this.stateCur = GameState.ANSWERVALIDATION;
      break;

    case GameState.ANSWERVALIDATION:
      const arr = ["A", "a", "B", "b", "C", "c", "D", "d"];
      if (arr.indexOf(inputMsg) === -1) {
        sReply = "Invalid Option!!! Please choose an option from A,B,C or D";
        break;
      }

      if (inputMsg.toUpperCase() === QuizFILE[this.questionCur].answer) {
          this.scoresCur++;
      }

      this.stateCur = GameState.QUIZ;

      if (this.countCur === TOTALNOQUESTIONS) {
          this.stateCur = GameState.EXIT;
      }
      sReply = this.makeAMove();
      break;

    case GameState.EXIT:
      const playerScore = this.scoresCur;
      const string1 = `The quiz is Ended. 
      Your Score is ${playerScore}`;

      sReply = `${string1}`;
      break;
  }

  console.log( sReply);
  return [sReply];
};

module.exports = Game;
