import Link from "next/link";

interface ArticleCardProps {
  imageUrl: string;
  title: string;
  url: string;
  slug: string;
  blurb: string;
}

const articleCard = ({
  imageUrl,
  title,
  url,
  blurb,
  slug,
}: ArticleCardProps) => {
  return (
    <div className="border border-gray-300 p-4 rounded-lg max-w-sm bg-gray-200">
      <div className="h-48 overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full rounded-lg object-cover" />
       </div>
      <h2 className="text-xl font-bold my-4">
        <Link href={url} className="text-black underline ">
          {title}
        </Link>
      </h2>
      <p>{blurb}</p>
      <Link
        href={url}
        className="inline-block mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        Dive In
      </Link>
    </div>
  );
};

export default articleCard;
