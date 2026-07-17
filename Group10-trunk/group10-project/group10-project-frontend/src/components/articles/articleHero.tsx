interface ArticleHeroProps {
    title: string;
    subtitle: string;
    author: string;
    blurb: string;
}

const defaultSubtitle: string = "A visual Introduction to almost everything you should know";
const articleHero = ({title, subtitle=defaultSubtitle, author="Default Author", blurb} : ArticleHeroProps) => {
  
    return (
      <div id="header">
        <div id="title" className="justify-items-center p-4 text-center">
          <h1 className="text-4xl font-extrabold font-sans"> {title} </h1>
        </div>
        {/* <div id="subtitle" className="flex-auto justify-items-center p-4">
          <h1 className="text-xl font-blod font-sans">
            {subtitle==="Subtitle" ? defaultSubtitle : subtitle}
          </h1>
        </div> */}
        <div id="author-details" className="flex-auto  p-4">
          <h1 className="text-xl font-blod font-sans text-center">
            {author}
          </h1>
        </div>
    </div>
  );
};

export default articleHero;
