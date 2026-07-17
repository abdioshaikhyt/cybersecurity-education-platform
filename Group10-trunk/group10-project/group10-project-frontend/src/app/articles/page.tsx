"use client";
import Hero from "@/components/articles/hero";
import ArticleCard from "@/components/articles/articleCard";
import articleData from "../../../data/articleData.json";
import { Article, Paragraph } from "@/types/Article";

const articles: Article[] = articleData.map((data) => ({
  id: data.id,
  title: data.title,
  subtitle: data.subtitle,
  imageUrl: data.imageUrl,
  blurb: data.blurb,
  author: data.author,
  slug: data.slug,
  content: (data.content ?? []).map(
    (section: { title: string; paragraphs: { text: string }[] }) => ({
      title: section.title,
      paragraphs: section.paragraphs.map((paragraph: Paragraph) => ({
        text: paragraph.text,
        gifId: paragraph.gifId ?? null,
      })),
    })
  ),
  gifs: (data.gifs ?? []).map((gif: any) => ({
    id: gif.id,
    url: gif.url ?? gif.CoverImageUrl ?? "",
  })),  
    References: data.References || [],
}));

const page = () => {
  return (
    <main id="background" className="min-h-screen text-black">
      <Hero />
      {/* Article Section */}
      <h3 className="text-center text-3xl font-san py-3 font-bold">
        Explore Published Articles
      </h3>
      <hr className="border-t-4 p-2 border-blue-400 " />
      <div className="flex justify-center items-center">
        <div
          id="article-container"
          className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-8"
        >
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              imageUrl={
                "/transparentLogo.png"
              }
              title={article.title}
              url={`./articles/${article.slug}`}
              slug={article.slug}
              blurb={article.blurb}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default page;
