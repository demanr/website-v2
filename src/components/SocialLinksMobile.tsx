interface Props {
  link: any;
  title: string;
  name: string;
  logo: string;
}

const SocialLinkMobile: React.FC<Props> = ({ link, title, name, logo }) => {
  return (
    <a
      className="flex items-center gap-2 font-bold text-white transition ease-in-out justify-left md:justify-center hover:scale-110"
      href={link}
    >
      <img className="w-4 h-4" src={logo} alt={title} />
      <p className="text-md">{name}</p>
    </a>
  );
};

export default SocialLinkMobile;
