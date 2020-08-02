import React, { useState, useEffect } from "react";
import "./App.css";
import { getQuiz } from "./Services/quizService";
import { Quiz } from "./Types/QuizTypes";
import QuestionCard from "./Components/QuestionCard";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  Container,
  CircularProgress,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#000",
    textAlign: "center",
    "& h1": {
      color: "#D5D5D5",
      textShadow: "4px 2px 5px #917373",
      padding: "20px 0",
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    height: "80vh",
    margin: "50px 0",
    backgroundColor: "#D5D5D5",
    color: "#000",
  },
  loader: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    padding: "100px 0",
  },
}));

let TOTAL_QUESTIONS = 10;

function App() {
  const classes = useStyles();

  let [questions, setQuestions] = useState<Quiz[]>([]);
  let [questionNo, setQuestionNo] = useState(0);
  // let [score, setScore] = useState(0);
  let [quizCompleted, setQuizCompleted] = useState(false);
  let [correctAnswers, setCorrectAnswers] = useState(0);
  let [wrongAnswers, setWrongAnswers] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const questions: Quiz[] = await getQuiz(TOTAL_QUESTIONS, "easy");
      setQuestions(questions);
    }
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent<EventTarget>, userAns: string) => {
    e.preventDefault();

    const currentQuestion: Quiz = questions[questionNo];

    console.log(
      "correct And: " +
        currentQuestion.correct_answer +
        "--user Selection:" +
        userAns
    );

    if (userAns === currentQuestion.correct_answer) {
      setCorrectAnswers(++correctAnswers);
    }
    if (userAns !== currentQuestion.correct_answer) {
      setWrongAnswers(++wrongAnswers);
    }

    if (questionNo !== questions.length - 1) setQuestionNo(++questionNo);
    else {
      setQuizCompleted(true);
    }
  };

  if (!questions.length)
    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    );
  if (quizCompleted) {
    return (
      <div className={classes.root}>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12}>
              <Paper className={classes.paper}>
                <Typography variant="h2" gutterBottom>
                  Result
                </Typography>

                <Typography variant="h6" gutterBottom>
                  You final score is
                  <b> {(correctAnswers / questions.length) * 100} %</b> <br />
                  Correnct Answers <b>{correctAnswers}</b>
                  <br />
                  Wrong Answers <b>{wrongAnswers}</b>
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }
  return (
    <div className={classes.root}>
      <h1>React Quiz</h1>
      <QuestionCard
        options={questions[questionNo].option}
        question={questions[questionNo].question}
        callback={handleSubmit}
      />
    </div>
  );
}

export default App;
