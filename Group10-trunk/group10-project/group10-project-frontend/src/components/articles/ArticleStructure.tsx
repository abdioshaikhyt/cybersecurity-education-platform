import React from "react";
import ArticleNavbar from "./ArticleNavbar";
import ArticleFooter from "./ArticleFooter";
import { Article } from "@/types/Article";
import RelatedArticlesCard from "./RelatedArticlesCard";

interface ArticleStructureProps {
  children: React.ReactNode;
}

const ArticleStructure = ({ children, article }: ArticleStructureProps & { article: Article }) => {
  return (
    <div className="flex flex-col flex-grow bg-gradient-to-b from-blue-100 to-white min-h-screen">
      <div className="flex flex-1">
        {/* Main content */}
        <main className="flex-1 py-8">
          <article className="container max-w-3xl mx-auto px-4 md:px-6">
            {children}
          </article>
        </main>
      </div>
      {/* Links & References */}
      <ArticleFooter references={article.References}/>
    </div>
  );
};

export default ArticleStructure;
