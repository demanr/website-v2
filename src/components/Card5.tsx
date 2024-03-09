interface Props {
  link?: any;
  title: string;
  description: string;
  image: string;
}

const Card5: React.FC<Props> = ({ link, title, description, image }) => {
  return (
    <div className="flex w-4/5 p-4 animate-bgMobile md:animate-bg bg-heavy md:flex-end bg-[length:400%_400%] from-heavy via-light to-heavy md:w-2/3 hover:bg-gradient-to-r rounded-sm">
      <div className="flex min-w-full p-8 overflow-hidden rounded animate-bgReverseMobile md:animate-bgReverse animate-wingleRevers md:flex-end md:w-full">
        <div className="flex flex-col gap-4 ">
          <h3 className="text-xl font-bold md:text-2xl">Dash</h3>
          <p className="text-md md:text-lg">{description}</p>
          {link && (
            <a
              className="flex items-center font-bold transition ease-in-out justify-left md:justify-right hover:scale-110"
              href={link}
            >
              View on GitHub
            </a>
          )}
        </div>

        <img className="object-contain w-1/2" src={image} alt={title} />
      </div>
    </div>
  );
};

export default Card5;
