import React from "react";
import articleData from "../../../data/articleData.json";
import { Article } from "../../types/Article";
import Link from "next/link";

const RelatedArticlesCard = ({ article }: { article: Article }) => {
  return (
    <div className="mt-12 p-6 w-screen rounded-lg shadow-sm">
      <h3 className="font-medium text-lg mb-6 text-center">
        <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
          Continue Reading
        </span>
      </h3>
      <div className="grid grid-cols-2 gap-8">
        {(articleData as Article[])
          .filter((a) => a.slug !== article.slug)
          .slice(0, 2)
          .map((relatedArticle) => (
            <div key={relatedArticle.id} className="text-center">
              <h4 className="font-medium">
                <Link
                  href={`/articles/${relatedArticle.slug}`}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent hover:opacity-80"
                >
                  {relatedArticle.title}
                </Link>
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {relatedArticle.author}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RelatedArticlesCard;
