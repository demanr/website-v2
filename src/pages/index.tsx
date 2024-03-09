import Image from "next/image";
import { Inter } from "next/font/google";
import SocialLink from "../components/SocialLink";
import CurrentlyPlaying from "../components/LastFM";
import CopyrightBeta from "../components/CopyrightBeta";
import Card5 from "../components/Card5";

//const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="">
      <div className="absolute w-full overflow-hidden -z-10">
        <div className="relative w-full -translate-x-1/2 sm:left-1/3 sm:-translate-x-1/3 lg:left-1/2 lg:-translate-x-1/3">
          <svg
            viewBox="0 0 822 631"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[200%] sm:w-[100%] lg:w-2/3"
          >
            <rect
              x="419.584"
              y="-302.327"
              width="470.794"
              height="805.9"
              transform="rotate(31.3467 419.584 -302.327)"
              fill="url(#paint0_linear_10_139)"
            ></rect>
            <rect
              x="0.329346"
              y="-57.3891"
              width="470.794"
              height="805.9"
              transform="rotate(-31.35 0.329346 -57.3891)"
              fill="url(#paint1_linear_10_139)"
            ></rect>
            <defs>
              <linearGradient
                id="paint0_linear_10_139"
                x1="654.981"
                y1="-302.327"
                x2="654.981"
                y2="503.573"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FF3257"></stop>
                <stop offset="1" stop-color="#FF3257" stop-opacity="0"></stop>
              </linearGradient>
              <linearGradient
                id="paint1_linear_10_139"
                x1="235.726"
                y1="-57.3891"
                x2="235.726"
                y2="748.511"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FF3257"></stop>
                <stop offset="1" stop-color="#FF3257" stop-opacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="w-full h-full text-white align-center">
        <main className="flex flex-col items-center justify-center w-full p-16 font-bold text-center md:p-24">
          <h1 className="pt-12 text-5xl font-bold md:text-7xl">Rachelle</h1>
          <h1 className="pb-8 text-5xl font-bold md:text-7xl md:pb-8">
            De Man
          </h1>
          <h2 className="text-2xl font-thin md:text-3xl pb-14 md:pb-16">
            Software Developer.
            <br />
            CS Student @ McMaster.
          </h2>
          <a
            className="text-xl md:text-2xl py-2 px-6 md:py-4 md:px-10 bg-[#D42C4B] rounded-xl transition ease-in-out hover:scale-110"
            href="/RachelleDeManResume.pdf"
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
    </div>
  );
}

/**
 * 
 * <div className="flex flex-col items-center justify-center w-full gap-4 p-8 md:flex-row md:gap-12">
          <Card5
            link="https://github.com/Krish120003/dash?tab=readme-ov-file"
            title="Dash"
            description="Customizable web dashboard that acts as a central hub for frequently
            visited webpages. Hackathon project for Hack The North 2023."
            image="/dash2.jpeg"
          />
        </div>
        
        <div className="flex flex-col items-center justify-center w-full gap-4 p-8 md:flex-row md:gap-12">
          <Card
            link="mailto:rachelledeman@icloud.com"
            title="Email"
            description="example"
            image="/mailLogo.svg"
          />
          <Card3
            link="mailto:rachelledeman@icloud.com"
            title="Email"
            description="example"
            image="/mailLogo.svg"
          />
        </div>
        */

/**

 * 
 * 
<div className="flex flex-col items-center justify-center w-full gap-4 p-8 md:flex-row md:gap-12">
          <Card
            link="mailto:rachelledeman@icloud.com"
            title="Email"
            description="example"
            image="/mailLogo.svg"
          />
          <Card3
            link="mailto:rachelledeman@icloud.com"
            title="Email"
            description="example"
            image="/mailLogo.svg"
          />
        </div>
 */
