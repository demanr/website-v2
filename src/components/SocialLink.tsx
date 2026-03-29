import Image from "next/image";

interface Props {
  link: any;
  title: string;
  name: string;
  logo: string;
}

const SocialLink: React.FC<Props> = ({ link, title, name, logo }) => {
  return (
    <a
      className="flex items-center gap-2 font-bold text-white transition ease-in-out lg:gap-4 justify-left md:justify-center hover:scale-110"
      href={link}
    >
      <Image
        className="w-6 h-6 xl:w-8 xl:h-8"
        src={logo}
        width={64}
        height={64}
        alt={title}
      />
      <p className="text-lg lg:text-xl xl:text-2xl">{name}</p>
    </a>
  );
};

export default SocialLink;
