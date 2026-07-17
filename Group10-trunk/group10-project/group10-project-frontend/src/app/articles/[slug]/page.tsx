"use client";
import ArticleHero from "@/components/articles/articleHero";
import ArticleSection from "@/components/articles/ArticleSection";
import ArticleStructure from "@/components/articles/ArticleStructure";
import articleData from "../../../../data/articleData.json";
import { useParams } from "next/navigation";
import { Article, Paragraph, ArticleSection as Section } from "@/types/Article";

function searchArticleById(data: Article[], slug: string): Article | null {
  // Find and return the article with the matching ID, or null if not found
  return data.find((article) => article.slug === slug) || null;
}

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

// Define the layout for the article here.
const articleLayout = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const chosenArticle = searchArticleById(articles, slug);

  if (!chosenArticle) {
    return <div>Article not found</div>;
  }
  const retrieveGifUrlById = (gifId: number | null): string | undefined => {
    if (gifId === null) return undefined;
    const gif = chosenArticle.gifs.find((g) => g.id === gifId);
    console.log(gif);
    return gif ? gif.url : undefined;
  };

  return (
    <ArticleStructure article={chosenArticle}>
      <div className="">
        {/* Article Introduction */}
        <ArticleHero
          title={chosenArticle.title}
          subtitle={chosenArticle.subtitle}
          author={chosenArticle.author}
          blurb={chosenArticle.blurb}
        />
        <div
          id="content"
          className="grid grid-cols-1 md:grid-cols-1 gap-x-16 gap-y-8 items-center"
        >
          {/* Article body */}
          {chosenArticle.content.map((section, index) => (
            <ArticleSection
              id={index.toString()}
              key={index}
              title={section.title}
              imageUrl=""
            >
              {section.paragraphs.map((paragraph, pIndex) => {
                const gifUrl = retrieveGifUrlById(paragraph.gifId ?? null);
                return (
                    <div key={pIndex}>
                    <p className="text-md leading-relaxed mb-4">
                      {paragraph.text}
                    </p>
                    {gifUrl && (
                      <img 
                      src={gifUrl}
                      alt={`Illustration for ${section.title}`}
                      className="my-4 w-300 h-500 rounded-lg object-contain mx-auto"
                      />
                    )}
                    </div>
                );
              })}
            </ArticleSection>
          ))}
        </div>
      </div>
    </ArticleStructure>
  );
};

export default articleLayout;
