import Image from "next/image";
import { Inter } from "next/font/google";
import CopyrightBeta from "../components/CopyrightBeta";
import Navbar from "../components/Navbar";
import BottomBar from "@/components/BottomBar";
import SocialLinkMobile from "@/components/SocialLinksMobile";
import TradingCard from "@/components/TradingCard";
import ProjectCard from "@/components/ProjectCard";
import {
  SiCplusplus,
  SiNextdotjs,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiGooglegemini,
  SiOpencv,
} from "react-icons/si";

import { IoHardwareChipOutline } from "react-icons/io5";

import { RiRobot2Line } from "react-icons/ri";


//const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const tradingCards = [
    {
      name: "Tango",
      description:
        "Apple Intelligence if it was actually useful. A Voice activated AI helper that flows uses the clipboard to streamline responses.\nWinner of HTN 2025.",
      imageUrl: "/tango.jpeg",
      githubUrl: "https://github.com/demanr/tango",
      altUrl: "https://devpost.com/software/tango-q37d4z",
      altUrlLabel: "Devpost",
      tech: [
        { name: "Gemini", icon: SiGooglegemini },
        { name: "TypeScript", icon: SiTypescript },
        { name: "Tailwind CSS", icon: SiTailwindcss },
      ],
      tags: ["Hackathon"],
    },
    {
      name: "Bracket Bot",
      description:
        "Autonomous lane driving robot that navigates using OpenCV-based detection and centering.\nWinner at Bracket Bot hackathon. ",
      imageUrl: "/bracketbot.png",
      githubUrl: "https://github.com/Krish120003/lane-centering-bracketbot",
      altUrl:
        "https://github.com/Krish120003/lane-centering-bracketbot?tab=readme-ov-file#how",
      altUrlLabel: "Video Demo",
      tech: [
        // { name: "Hardware", icon: RiRobot2Line },
        { name: "OpenCV", icon: SiOpencv },
        { name: "Python", icon: SiPython },
      ],
      tags: ["Hackathon"],
    },
    {
      name: "Integrity",
      description:
        "Tool to scan hackathon submissions and flag any foul play using AI and custom heuristics.",
      imageUrl: "/integrity.jpeg",
      githubUrl: "https://github.com/krish120003/integrity",
      //   altUrl: "https://devpost.com/software/tango-q37d4z",
      //   altUrlLabel: "Devpost",
      tech: [
        { name: "Gemini", icon: SiGooglegemini },
        { name: "Python", icon: SiPython },
      ],
      tags: ["Hackathon"],
    },
    {
      name: "Dash",
      description:
        "Customizable dashboard that acts as a hub for frequently visited webpages. \n\n Built for HTN 2024.",
      imageUrl: "/dash2.jpeg",
      githubUrl: "https://github.com/Krish120003/dash?tab=readme-ov-file",
      altUrl: "https://github.com/Krish120003/dash",
      altUrlLabel: "Project Link",
      tech: [
        { name: "React", icon: SiReact },
        { name: "Next.js", icon: SiNextdotjs },
        { name: "TypeScript", icon: SiTypescript },
        { name: "Tailwind CSS", icon: SiTailwindcss },
      ],
      tags: ["Hackathon"],
    },
  ];

  const handleDesktopHorizontalWheel = (
    event: React.WheelEvent<HTMLDivElement>,
  ) => {
    if (window.innerWidth < 768) return;

    const horizontalContainer = event.currentTarget;
    const nextScrollLeft = horizontalContainer.scrollLeft + event.deltaY;

    if (nextScrollLeft !== horizontalContainer.scrollLeft) {
      horizontalContainer.scrollLeft = nextScrollLeft;
      event.preventDefault();
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen md:h-screen">
      <Navbar />

      {/* Mobile Only */}
      <div className="w-full md:hidden">
        <div
          id="portfolio-mobile"
          className="relative min-h-[120px] overflow-hidden"
        >
          <div className="absolute inset-y-0 right-0 w-2/5 pointer-events-none">
            <Image
              src="/portrait.jpeg"
              alt="Portrait"
              fill
              className="object-cover object-right"
            />
            <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black to-transparent backdrop-blur-[1px]" />
          </div>
          <div className="relative z-10 flex flex-col items-start px-4 py-8 text-5xl">
            <div className="">RACHELLE </div>
            <div className="">DE MAN</div>
          </div>
        </div>
        <div className="grid w-2/3 grid-cols-2 gap-1 pt-6 pl-4 pr-4 align-left">
          <SocialLinkMobile
            link="https://github.com/demanr"
            title="Github"
            name="demanr"
            logo="/githubLogo.svg"
          />
          <SocialLinkMobile
            link="https://www.linkedin.com/in/r-deman/"
            title="LinkedIn"
            name="r-deman"
            logo="/linkedinLogo.svg"
          />
          <a
            className="flex items-center gap-2 font-bold text-white transition ease-in-out justify-left md:justify-center hover:scale-110"
            href="/RachelleDeManResume.pdf"
          >
            <img className="w-4 h-4" src={"/resumeLogo.svg"} alt="resume" />
            <p className="text-md">resume</p>
          </a>
        </div>
        <div
          id="projects-mobile"
          className="flex flex-col gap-12 px-4 pt-12 mx-auto max-w-fit"
        >
          {tradingCards.map((card, index) => (
            <TradingCard
              key={`mobile-card-${index}`}
              name={card.name}
              description={card.description}
              imageUrl={card.imageUrl}
              githubUrl={card.githubUrl}
              altUrl={card.altUrl}
              altUrlLabel={card.altUrlLabel}
              tech={card.tech}
              tags={card.tags}
            />
          ))}
        </div>
        <div id="positions-mobile"></div>
      </div>

      <div className="hidden h-full md:block">
        <div
          id="home-scroll-desktop"
          className="h-full overflow-x-auto "
          onWheel={handleDesktopHorizontalWheel}
        >
          <div className="flex items-start h-full my-auto">
            <div
              id="portfolio-desktop"
              className="relative h-[95%] min-w-[38vw]"
            >
              <Image
                src="/portrait.jpeg"
                alt="Portrait"
                fill
                className="object-cover object-right"
              />
              <div className="absolute inset-y-0 right-0 w-12 pointer-events-none bg-gradient-to-l from-black/80 to-transparent backdrop-blur-[1px]" />
            </div>
            <div className=" min-w-[32rem] px-10 pb-10 my-auto lg:text-lg xl:text-2xl 2xl:text-3xl">
              <h1 className="pb-10">Hello there!</h1>
              <p className="pb-4">
                I'm Rachelle. Programmer, crocheter, and game lover.
              </p>
              <p className="pb-4">
                Welcome to my showcase. Displayed are some of my most meaningful
                projects- both technical and otherwise.
              </p>
              <p className="pb-4">
                If you’re curious about anything I’ve done (or want to chat
                about your work) feel free to reach out! I’m always willing to
                trade cards.
              </p>
              <p className="pb-4">
                I'm best reached through Email, LinkedIn, or Twitter.
              </p>
            </div>
            <div
              id="projects-desktop"
              className="min-w-[26rem] px-10 pt-10 pb-20 flex gap-32 z-50 my-auto"
            >
              {tradingCards.map((card, index) => (
                <TradingCard
                  key={`desktop-card-${index}`}
                  name={card.name}
                  description={card.description}
                  imageUrl={card.imageUrl}
                  githubUrl={card.githubUrl}
                  altUrl={card.altUrl}
                  altUrlLabel={card.altUrlLabel}
                  tech={card.tech}
                  tags={card.tags}
                />
              ))}
            </div>
            <div id="positions-desktop"></div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 hidden w-full bg-black md:block">
        <BottomBar />
      </div>
    </div>
  );
}

//  <div className="flex flex-col justify-center gap-4 pt-32 md:flex-wrap md:gap-12 md:pt-24 md:flex-row lg:w-3/4 xl:w-3/4">
//    <SocialLink
//      link="https://github.com/demanr"
//      title="Github"
//      name="demanr"
//      logo="/githubLogo.svg"
//    />
//    <SocialLink
//      link="https://www.linkedin.com/in/r-deman/"
//      title="LinkedIn"
//      name="r-deman"
//      logo="/linkedinLogo.svg"
//    />
//    <SocialLink
//      link="/photography"
//      title="Photography"
//      name="photography"
//      logo="/photographyLogo.svg"
//    />
//    <SocialLink
//      link="mailto:rachelledeman@icloud.com"
//      title="Email"
//      name="rachelledeman@icloud.com"
//      logo="/mailLogo.svg"
//    />
//  </div>;
