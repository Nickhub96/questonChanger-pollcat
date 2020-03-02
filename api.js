const axios = require("axios");

exports.getQuestions = () => {
  return axios
    .get(
      "https://pollcat-backend.herokuapp.com/api/questions?questionStatus=current"
    )
    .then(({ data }) => {
      // console.log(data, data.questions[0].answerArray);
      return data.questions[0].question_id;
    });
};

exports.getAnswersbyQid = question_id => {
  return axios
    .get(`https://pollcat-backend.herokuapp.com/api/answers/${question_id}`)
    .then(({ data }) => {
      return data;
    });
};
