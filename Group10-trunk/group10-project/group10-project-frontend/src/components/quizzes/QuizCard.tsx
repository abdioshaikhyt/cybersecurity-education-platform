import React from "react";
import Link from "next/link";

interface QuizCardProps {
  id: number;
  title: string;
  description: string;
}

const QuizCard = ({ id, title, description }: QuizCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    <p className="text-gray-600 mt-2">{description}</p>
  </div>
  );
};

export default QuizCard;
