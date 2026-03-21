import Image from "next/image";
import { Inter } from "next/font/google";
import CopyrightBeta from "../components/CopyrightBeta";
import Navbar from "../components/Navbar";
import BottomBar from "@/components/BottomBar";
import SocialLinkMobile from "@/components/SocialLinksMobile";
import TradingCard from "@/components/TradingCard";
import ProjectCard from "@/components/ProjectCard";

//const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const tradingCards = Array.from({ length: 3 }, () => ({
    name: "Dash",
    description:
      "Customizable dashboard that acts as a hub for frequently visited webpages. \n\n Built for HTN 2024.",
    imageUrl: "/dash2.jpeg",
    githubUrl: "https://github.com/Krish120003/dash?tab=readme-ov-file",
    liveUrl: "https://github.com/Krish120003/dash",
    tech: [
      { name: "GitHub", icon: "/githubLogo.svg" },
      { name: "LinkedIn", icon: "/linkedinLogo.svg" },
    ],
    tags: ["Hackathon Project"],
  }));

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
        <div className="relative min-h-[120px] overflow-hidden">
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
          <SocialLinkMobile
            link="mailto:rachelledeman@icloud.com"
            title="Email"
            name="rachelledeman@icloud.com"
            logo="/mailLogo.svg"
          />
        </div>
        <div className="flex flex-col gap-12 px-4 pt-12 mx-auto max-w-fit">
          {tradingCards.map((card, index) => (
            <TradingCard
              key={`mobile-card-${index}`}
              name={card.name}
              description={card.description}
              imageUrl={card.imageUrl}
              githubUrl={card.githubUrl}
              liveUrl={card.liveUrl}
              tech={card.tech}
              tags={card.tags}
            />
          ))}
        </div>
      </div>

      <div className="hidden h-full md:block">
        <div
          className="h-full overflow-x-auto "
          onWheel={handleDesktopHorizontalWheel}
        >
          <div className="flex items-start h-full my-auto">
            <div className="relative h-[95%] min-w-[38vw]">
              <Image
                src="/portrait.jpeg"
                alt="Portrait"
                fill
                className="object-cover object-right"
              />
              <div className="absolute inset-y-0 right-0 w-12 pointer-events-none bg-gradient-to-l from-black/80 to-transparent backdrop-blur-[1px]" />
            </div>
            <div className="h-9/10 min-w-[32rem] px-10 pt-20 pb-10 text-lg lg:text-xl">
              <h1 className="pb-10">Hello there!</h1>
              <p className="pb-4">TBA Long intro description</p>
              <p className="pb-4">
                lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className="pb-4">
                lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="pb-4">
                lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p>Yippee!</p>
            </div>
            <div className="min-w-[26rem] px-10 pt-10 pb-20 flex gap-32 z-50 my-auto">
              {tradingCards.map((card, index) => (
                <TradingCard
                  key={`desktop-card-${index}`}
                  name={card.name}
                  description={card.description}
                  imageUrl={card.imageUrl}
                  githubUrl={card.githubUrl}
                  liveUrl={card.liveUrl}
                  tech={card.tech}
                  tags={card.tags}
                />
              ))}
              {/* <ProjectCard
                title="Project Title"
                tech={[{ name: "test", icon: "/githubLogo.svg" }]}
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                imageUrl="/dash2.jpeg"
                links={[
                  { label: "GitHub", href: "https://github.com" },
                  { label: "Live Demo", href: "https://example.com" },
                ]}
              /> */}
            </div>
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