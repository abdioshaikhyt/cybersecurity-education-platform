"use client"
import {Reference} from "@/types/Article"
import Link from "next/link"

interface ArticleFooterProps {
  references?: Reference[]
}

const ArticleFooter = ({ references }: ArticleFooterProps) => {
  
  const hasReferences = references && references.length > 0

  return (
    <div className="bg-green-100 py-8">
      <div className="container max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 border-b-2 border-green-300 pb-2">References</h2>
        {hasReferences ? (
          <ul className="list-disc pl-6 space-y-2">
            {references.map((ref, index) => (
              <li key={`${ref.id}-${index}`} className="text-gray-800">
                <Link
                  href={ref.url}
                   className="text-blue-800 visited:text-purple-800 underline hover:text-blue-600"
                  onClick={(e) => {
                    // This ensures the link turns purple even if it doesn't work
                    e.currentTarget.classList.add("text-purple-700")
                    e.currentTarget.classList.remove("text-blue-600")
                  }}
                >
                  {ref.title}
                </Link>{" "}
                — {ref.source}, {ref.year}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 italic">No references available for this article.</p>
        )}
      </div>
    </div>
  )
}

export default ArticleFooter

