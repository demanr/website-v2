import Link from "next/link";
import Image from "next/image";
import SocialLink from "./SocialLink";
import { SiX } from "react-icons/si";

export default function BottomBar() {
  return (
    <nav className="w-full border-t border-gray-200">
      <div className="w-full overflow-x-auto">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 min-w-max">
          <div className="flex items-center justify-between w-full gap-8 py-4 lg:gap-16">
            <div className="text-3xl font-bold text-white transition xl:text-6xl lg:text-5xl">
              RACHELLE DE MAN
            </div>
            {/* Socials */}
            <div className="flex space-x-4 text-white transition lg:space-x-8 xl:text-lg lg:text-md">
              <a
                className="flex items-center gap-2 font-bold text-white transition ease-in-out lg:gap-4 justify-left md:justify-center hover:scale-110"
                href="/RachelleDeManResume.pdf"
              >
                <Image
                  className="w-6 h-6 xl:w-8 xl:h-8"
                  src={"/resumeLogo.svg"}
                  width={64}
                  height={64}
                  alt="resume"
                />
                <p className="text-lg lg:text-xl xl:text-2xl">resume</p>
              </a>
              <a
                className="flex items-center gap-2 font-bold text-white transition ease-in-out lg:gap-4 justify-left md:justify-center hover:scale-110"
                href="https://x.com/rachelledeman"
              >
                {/* @ts-expect-error TS5.0 */}
                <SiX className="w-6 h-6" />
                <p className="text-lg lg:text-xl xl:text-2xl">twitter</p>
              </a>
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
            </div>
          </div>
        </div>
      </div>
    </nav>
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
