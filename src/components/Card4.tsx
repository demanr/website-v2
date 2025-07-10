interface Props {
  link?: any;
  title: string;
  description: string;
  image: string;
}

const Card3: React.FC<Props> = ({ link, title, description, image }) => {
  return (
    <div className="flex w-1/3 p-4 bg-transparent border-8 animate-jello border-heavy md:flex-end md:w-1/3">
      <div className="flex min-w-full p-8 overflow-hidden bg-heavy md:flex-end md:w-full">
        {link && (
          <a
            className="flex items-center gap-4 font-bold text-black transition ease-in-out justify-left md:justify-center hover:scale-110"
            href={link}
          >
            View on GitHub
          </a>
        )}
        <h5>THIS IS A TEST </h5>
      </div>
    </div>
  );
};

export default Card3;
