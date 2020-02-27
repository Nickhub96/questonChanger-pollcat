const axios = require("axios");
const { getQuestions, getAnswersbyQid } = require("./api");

async function setNewQuestion() {
  try {
    const { data } = await axios.get(
      "https://pollcat-backend.herokuapp.com/api/questions?questionStatus=current"
    );
    console.log(data, "daaaata");
    const questionData = data.questions[0];
    const { question_id } = data.questions[0];

    const getAnswers = await axios.get(
      `https://pollcat-backend.herokuapp.com/api/answers/${question_id}`
    );
    const { answers } = getAnswers.data;

    const answerTotal = answers.reduce((tally, answer) => {
      if (!tally[answer.answerIndex]) {
        tally[answer.answerIndex] = 1;
      } else {
        tally[answer.answerIndex] = tally[answer.answerIndex] + 1;
      }

      return tally;
    }, []);

    const updatedAnswerArray = questionData.answerArray.map((answer, index) => {
      const parsedAnswer = JSON.parse(answer);
      const stringifiedAnswer = { ...parsedAnswer, votes: answerTotal[index] };
      return stringifiedAnswer;
    });

    const updatedQuestionData = {
      ...questionData,
      answerArray: updatedAnswerArray,
      questionStatus: "past"
    };

    const patchQuestion = await axios.patch(
      `https://pollcat-backend.herokuapp.com/api/questions/${question_id}`,
      {
        questionStatus: "past",
        answerArray: updatedQuestionData.answerArray
      }
    );

    const newCurrentQuestion = await axios.patch(
      `https://pollcat-backend.herokuapp.com/api/questions/${question_id + 1}`,
      { questionStatus: "current" }
    );
  } catch (err) {
    console.log(err, "this is an error");
  }
}

setNewQuestion();
