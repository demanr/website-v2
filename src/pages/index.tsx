import Image from "next/image";
import { Inter } from "next/font/google";
import SocialLink from "../components/SocialLink";
import CurrentlyPlaying from "../components/LastFM";
import CopyrightBeta from "../components/CopyrightBeta";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="bg-[#0C0D14] text-white align-center w-full h-full">
      <main className="flex flex-col items-center justify-center w-full p-16 font-bold text-center md:p-24">
        <h1 className="pt-12 text-5xl font-bold md:text-7xl">Rachelle</h1>
        <h1 className="pb-8 text-5xl font-bold md:text-7xl md:pb-8">DeMan</h1>
        <h2 className="text-2xl font-thin md:text-3xl pb-14 md:pb-16">
          Software Developer.
          <br />
          CS Student @ McMaster.
        </h2>
        <a
          className="text-xl md:text-2xl py-2 px-6 md:py-4 md:px-10 bg-[#D42C4B] rounded-xl transition ease-in-out hover:scale-110"
          href="/Rachelle_DeMan_feb_resume.pdf"
        >
          Resume
        </a>
        <div className="flex flex-col justify-center gap-4 pt-32 md:gap-12 md:pt-24 md:flex-row">
          <SocialLink
            link="https://github.com/demanr"
            title="Github"
            name="demanr"
            logo="/githubLogo.svg"
          />
          <SocialLink
            link="https://www.linkedin.com/in/r-deman/"
            title="LinkedIn"
            name="r-deman"
            logo="/linkedinLogo.svg"
          />
          <SocialLink
            link="mailto:rachelledeman@icloud.com"
            title="Email"
            name="rachelledeman@icloud.com"
            logo="/mailLogo.svg"
          />
        </div>
      </main>
      <div className="pb-12"></div>
      <div className="fixed bottom-0 right-0 z-10 w-full lg:w-fit lg:p-4 backdrop-blur-sm lg:backdrop-blur-0 min-h-[1px]">
        <CurrentlyPlaying />
      </div>
      <div className="flex w-full">
        <CopyrightBeta />
      </div>
    </div>
  );
}
