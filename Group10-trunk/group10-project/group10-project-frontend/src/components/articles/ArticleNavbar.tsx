import React from "react";
import { RiArticleLine } from "react-icons/ri";
import { MdOutlineQuiz } from "react-icons/md";
import { FaHome, FaBook } from "react-icons/fa";
import Link from "next/link";

const ArticleNavbar = () => {
  return (
    <div id="intro" className="flex bg-blue-100 justify-center items-center w-full p-6">
      <div className="flex justify-between w-3/4">
        <Link href="/" className="hover:text-blue-500 hover:underline self-center">
          <h1 className="text-3xl antialiased font-bold font-sans">
            <span className="text-black">VYDS</span>
          </h1>
        </Link>
        <div className="flex space-x-8 font-semibold self-center justify-center">
        <Link href="/" className="hover:text-blue-500 hover:underline">
            <span className="text-black flex items-center space-x-1">
              <FaHome />
              <span>Home</span>
            </span>
          </Link>
          <Link href="/articles" className="hover:text-blue-500 hover:underline">
            <span className="text-black flex items-center space-x-1">
              <RiArticleLine />
              <span>Articles</span>
            </span>
          </Link>
          <Link href="/quizzes" className="hover:text-blue-500 hover:underline">
            <span className="text-black flex items-center space-x-1">
              <MdOutlineQuiz />
              <span>Quizzes</span>
            </span>
          </Link>
          <Link href="/glossary" className="hover:text-blue-500 hover:underline">
            <span className="text-black flex items-center space-x-1">
              <FaBook />
              <span>Glossary</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleNavbar;
