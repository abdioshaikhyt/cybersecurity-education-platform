import Link from "next/link";
import QuizCard from "@/components/quizzes/QuizCard";
import QuizTestData from "../../../data/quizData.json";
import ArticleNavbar from "@/components/articles/ArticleNavbar";
import { BiBook } from "react-icons/bi";

interface Quiz {
  id: number;
  title: string;
  description: string;
  explanation: string;
  questions: {
    text: string;
    answers: {
      text: string;
      isCorrect: boolean;
    }[];
  }[];
}

const quizzes: Quiz[] = QuizTestData.map((data: any) => ({
  id: data.id,
  title: data.title,
  description: data.description,
  explanation: data.explanation,
  questions: data.questions.map((q: any) => ({
    text: q.text,
    answers: q.answers.map((a: any) => ({
      text: a.text,
      isCorrect: a.isCorrect,
    })),
  })),
}));

export default function Page() {
  return (
    <div className=" min-h-screen relative ">
      {/* Title */}
      <div className="text-center py-8">
        <h1 className="text-4xl text-gray-900 font-bold">
          <span className="text-yellow-500"> Quizzing </span> Homepage
        </h1>
        <p className="text-lg mt-2">
          Explore our collection of quizzes to challenge your knowledge!
        </p>
      </div>

      {/* Quiz container */}
      <div className="w-full max-w-4xl mx-auto p-6 mt-4">
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div
              className="bg-white/40 p-6 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-yellow-400 pl-4"
              key={quiz.id}
            >
              <div className="border-l-4 border-yellow-400 pl-4">
                </div>
              <div>
                <Link
                  href={`/quizzes/${quiz.id}`}
                  className="hover:underline p-1"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <BiBook className="text-2xl text-yellow-500" />{" "}
                    {/* Book icon */}
                    <h2 className="text-2xl font-semibold text-black">
                      {quiz.title}
                    </h2>
                  </div>
                  <p className="text-gray-700">{quiz.description}</p>
                </Link>
                <span>
                  <div className="mt-4"> </div>
                  <Link href={`/quizzes/${quiz.id}`}>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 flex items-center gap-2">
                      Start Quiz
                    </button>
                  </Link>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
