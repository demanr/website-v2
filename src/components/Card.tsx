interface Props {
  link?: any;
  title: string;
  description: string;
  image: string;
}

const Card: React.FC<Props> = ({ link, title, description, image }) => {
  return (
    <div className="flex p-8 overflow-hidden rounded min-w-1/3 bg-heavy md:flex-end md:w-1/3">
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
  );
};

export default Card;
