"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import quizData from "../../../../data/quizData.json";

const QuizPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const quiz = quizData.find((q) => q.id === id);

  console.log(quiz?.id);

  const newArray = new Array(quiz?.questions.length || 0).fill(-1);
  const [answers, setAnswers] = useState<number[]>(newArray);

  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [unanswered, setUnanswered] = useState<string[]>([]);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!quiz) {
    return (
      <div className="text-center p-8 text-red-500 font-bold">
        Quiz not found!
      </div>
    );
  }

  const handleSelect = (qIndex: number, aIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = aIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const missing = answers
      .map((a, i) => (a === -1 ? `Q${i + 1}` : null))
      .filter((q) => q !== null) as string[];
    if (missing.length > 0) {
      setUnanswered(missing);
      setShowConfirm(true);
    } else {
      submit();
    }
  };

  const submit = () => {
    setShowConfirm(false);
    setSubmitted(true);
    router.push(
      `/quizzes/${id}/result?answers=${JSON.stringify(answers)}&id=${id}`
    );
  };

  const progress = (answers.filter((a) => a !== -1).length / answers.length) * 100;

  return (
    <div>
      <div className="min-h-screen p-6 relative">
        {/* Navbar */}
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow relative">
          <h1 className="text-2xl font-bold mb-4 text-blue-700">
            {quiz.title}
          </h1>
          <p className="mb-6 text-gray-700">{quiz.description}</p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-300 h-3 rounded mb-4">
            <div
              className="bg-blue-600 h-3 rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Timer */}
          <div className="text-sm text-gray-600 mb-4 flex justify-between">
            <span>Time: {time} seconds</span>
            <span>
              {answers.filter((a) => a !== -1).length} / {answers.length}{" "}
              answered
            </span>
          </div>

          {quiz.questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-6">
              <h2 className="font-semibold text-lg mb-2">{`Q${qIndex + 1}: ${
                question.text
              }`}</h2>
              <div className="space-y-2">
                {question.answers.map((answer, aIndex) => {
                  const isSelected = answers[qIndex] === aIndex;
                  return (
                    <button
                      key={aIndex}
                      onClick={() => handleSelect(qIndex, aIndex)}
                      className={`block w-full text-left p-3 rounded border ${
                        isSelected
                          ? "bg-gray-300 font-bold"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {answer.text}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!submitted && (
            <>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Submit Quiz
              </button>

              {/* Confirmation pop up */}
              {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-10">
                  <div className="bg-white p-6 rounded shadow-lg text-center border border-gray-300 max-w-md w-full">
                    <h3 className="text-lg font-semibold mb-4">
                      Are you sure you want to submit?
                    </h3>
                    {unanswered.length > 0 && (
                      <div className="mb-4 text-red-600">
                        <p className="font-medium mb-2">
                          You haven't answered:
                        </p>
                        <ul className="list-disc ml-4">
                          {unanswered.map((q, i) => (
                            <li key={i}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={submit}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Submit Anyway
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
