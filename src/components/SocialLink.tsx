interface Props {
  link: any;
  title: string;
  name: string;
  logo: string;
}

const SocialLink: React.FC<Props> = ({ link, title, name, logo }) => {
  return (
    <a
      className="flex items-center gap-4 font-bold text-white transition ease-in-out justify-left md:justify-center hover:scale-110"
      href={link}
    >
      <img className="w-8 h-8" src={logo} alt={title} />
      <p className="text-xl md:text-2xl">{name}</p>
    </a>
  );
};

export default SocialLink;
