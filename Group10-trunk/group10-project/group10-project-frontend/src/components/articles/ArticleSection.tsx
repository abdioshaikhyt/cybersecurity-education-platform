interface ArticleSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  imageUrl?: string;
}
const ArticleSection = ({ id, title, children, imageUrl }: ArticleSectionProps) => {
  console.log(imageUrl)
  return (
    <section id={id} className="">
      <h3 className="text-2xl font-semibold">{title}</h3>
      <div className="border-2 border-yellow-500"> </div>
      {children}
      {imageUrl && <img src={imageUrl} alt={`Section image for ${title}`} className="my-4 w-full rounded-lg" />}
    </section>
  );
};

export default ArticleSection;
