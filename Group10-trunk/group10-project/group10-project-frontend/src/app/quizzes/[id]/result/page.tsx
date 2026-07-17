"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import quizData from "../../../../../data/quizData.json";

const ResultPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id } = useParams();
  const [answers, setAnswers] = useState<number[]>([]);
  const [showPopup, setShowPopup] = useState(true);

  const quiz = quizData.find((q) => q.id === id);

  useEffect(() => {
    const answersParam = searchParams.get("answers");
    if (answersParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(answersParam));
        setAnswers(parsed);
      } catch (error) {
        console.error("Invalid answers parameter:", error);
      }
    }
  }, [searchParams]);

  if (!quiz) {
    return (
      <div className="text-center p-8 text-red-500 font-bold">
        Quiz not found!
      </div>
    );
  }

  const correctCount = quiz.questions.reduce((acc, q, i) => {
    const correctIndex = q.answers.findIndex((a) => a.isCorrect);
    return acc + (answers[i] === correctIndex ? 1 : 0);
  }, 0);

  const handleRetry = () => {
    router.push(`/quizzes/${id}`);
  };

  return (
    <div>
      {" "}
      <div className="min-h-screen bg-zinc-900 p-6 relative">
        {/* Score Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-10">
            <div className="bg-white p-6 rounded shadow-lg text-center border border-gray-300 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">Quiz Completed</h3>
              <p className="mb-4">
                You got{" "}
                <span className="font-bold text-blue-700">
                  {correctCount} / {quiz.questions.length}
                </span>
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleRetry}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Retry
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Result Content */}
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow mt-12">
          <h1 className="text-2xl font-bold mb-4 text-blue-700">
            Results: {quiz.title}
          </h1>
          <p className="mb-6 text-gray-700">
            Score: {correctCount} / {quiz.questions.length}
          </p>

          {quiz.questions.map((question, qIndex) => {
            const correctIndex = question.answers.findIndex((a) => a.isCorrect);
            return (
              <div key={qIndex} className="mb-6">
                <h2 className="font-semibold text-lg mb-2">{`Q${qIndex + 1}: ${
                  question.text
                }`}</h2>
                <div className="space-y-2">
                  {question.answers.map((answer, aIndex) => {
                    const isSelected = answers[qIndex] === aIndex;
                    const isCorrect = answer.isCorrect;
                    const isWrongSelected = isSelected && !isCorrect;

                    const getButtonColor = () => {
                      if (isSelected && isCorrect)
                        return "bg-green-500 text-white";
                      if (isCorrect) return "bg-green-200";
                      if (isWrongSelected) return "bg-red-500 text-white";
                      return "bg-gray-100";
                    };

                    return (
                      <div
                        key={aIndex}
                        className={`w-full text-left p-3 rounded border ${getButtonColor()}`}
                      >
                        {answer.text}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
