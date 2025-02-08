"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QuizData, QuizResponse, QuizResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import axios from "axios";

export function QuizClient() {
  const router = useRouter();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [quizResponse, setQuizResponse] = useState<QuizResponse | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    setQuizData(JSON.parse(localStorage.getItem("quizData") || "{}").answer);
  }, []);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    axios
      .post(
        "http://localhost:8000/evaluate_questions",
        [{ ...question, user_response: answer }],
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        console.log(response.data[0]);
        console.log(response.data.results);
        setQuizResponse(response.data);

        if (response.data && response.data?.results[0].is_correct) {
          console.log("hello")
          setScore(score + 1);
        }
      });
  };

  const handleNextQuestion = () => {
    if (!quizData) return;

    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setQuizResponse(null);
    } else {
      // Quiz completed, navigate to results
      router.push(`/results?score=${score}`);
    }
  };

  if (!quizData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        Loading quiz...
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {quizData.questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              Score: {score}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">{question.text}</h2>
          {/* --{JSON.stringify(question)}-- */}
          <div className="grid gap-4">
            {question.format == "reponse_courte" && (
              <input
                placeholder="your response"
                className={
                  "justify-start h-auto py-4 px-6 bg-blue-100 " +
                  (quizResponse
                    ? quizResponse?.results[0].is_correct
                      ? "outline-green-400"
                      : "outline-red-400"
                    : "")
                }
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    handleAnswerSelect(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
            )}
            {question.format == "QCM" &&
              Object.values(question.options).map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className={
                    "justify-start h-auto py-4 px-6 " +
                    (quizResponse
                      ? quizResponse?.results[0].is_correct
                        ? "outline-green-400"
                        : "outline-red-400"
                      : "")
                  }
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </Button>
              ))}
            {question.format == "yesNo" && (
              <>
                <Button
                  key={0}
                  variant={selectedAnswer === "true" ? "default" : "outline"}
                  className={
                    "justify-start h-auto py-4 px-6 " +
                    (quizResponse
                      ? quizResponse?.results[0].is_correct
                        ? "outline-green-400"
                        : "outline-red-400"
                      : "")
                  }
                  onClick={() => handleAnswerSelect("true")}
                  disabled={selectedAnswer !== null}
                >
                  True
                </Button>
                <Button
                  key={1}
                  variant={selectedAnswer === "false" ? "default" : "outline"}
                  className={
                    "justify-start h-auto py-4 px-6 " +
                    (quizResponse
                      ? quizResponse?.results[0].is_correct
                        ? "outline-green-400"
                        : "outline-red-400"
                      : "")
                  }
                  onClick={() => handleAnswerSelect("false")}
                  disabled={selectedAnswer !== null}
                >
                  False
                </Button>
              </>
            )}
            {quizResponse && quizResponse?.results[0].is_correct == true && (
              <div className="text-green-400 mt-[-15px]">Correct Answer</div>
            )}
            {quizResponse && quizResponse?.results[0].is_correct == false && (
              <div className="text-red-400 mt-[-15px]">Wrong Answer</div>
            )}
          </div>
          {showExplanation && (
            <div
              className={
                "mt-6 p-4 bg-muted rounded-lg min-h-[3.25rem] " +
                (!quizResponse && "placeholder-animation")
              }
            >
              <p className="text-sm">{quizResponse?.results[0].explanation}</p>
            </div>
          )}
          {selectedAnswer && quizResponse && (
            <div className="mt-6">
              <Button onClick={handleNextQuestion}>
                {currentQuestion < quizData.questions.length - 1
                  ? "Next Question"
                  : "See Results"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
