
"use client";

import Image from "next/image";
import { Zen_Dots } from "next/font/google";
import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";

const zenDots = Zen_Dots({
  weight: "400",
  subsets: ["latin"],
});

declare global {
	namespace JSX {
		interface IntrinsicElements {
			"hover-tilt": HoverTiltProps;
		}
	}
}

interface HoverTiltProps extends React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> {
  "tilt-factor"?: string | number;
  "scale-factor"?: string | number;
  glare?: boolean;
  "glare-mask-mode"?:
    | "match-source"
    | "luminance"
    | "alpha"
    | "none"
    | undefined;
  "glare-mask-composite"?:
    | "add"
    | "subtract"
    | "exclude"
    | "intersect"
    | undefined;
  shadow?: boolean;
}

interface TradingCardProps {
	name: string;
	description: string;
	imageUrl: string;
	githubUrl?: string;
  altUrl?: string;
  altUrlLabel?: string;
  tech?: { name: string; icon: string | IconType }[];
	tags?: string[];
}

export default function TradingCard({
	name,
	description,
	imageUrl,
	githubUrl,
  altUrl,
  altUrlLabel = "Live Demo",
	tech = [],
	tags = [],
}: TradingCardProps) {
  const [isBelowMd, setIsBelowMd] = useState(false);

	useEffect(() => {
		// @ts-expect-error - package resolves at runtime in this project setup
		import("hover-tilt/web-component");
	}, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent =
      "hover-tilt::part(container) { border-radius: 1.5rem; touch-action: pan-y; }";
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    setIsBelowMd(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsBelowMd(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <hover-tilt
      tilt-factor="0.4"
      scale-factor={isBelowMd ? 1.1 : 1.25}
      glare-mask-composite="add"
      blend-mode="hard-light"
      glare-intensity={0.6}
      glare-mask="url('/circular_texture.jpeg')"
      glare-mask-mode="luminance"
    >
      <div
        className="-z-10 relative overflow-hidden transition-all duration-300 shadow-2xl w-80 2xl:w-96 aspect-[3/5] mc-block"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #5a8f3a 0 12%, #7a5230 12% 32%, #3a3a3a 32% 100%)",
          backgroundColor: "#3a3a3a",
          touchAction: "pan-y",
          imageRendering: "pixelated",
        }}
      >
        <div className="flex items-center justify-between p-3 pt-4 border-white/20">
          <h3
            className="mc-font text-sm xl:text-base 2xl:text-lg font-bold tracking-wide text-white drop-shadow-[2px_2px_0_#000]"
          >
            {name}
          </h3>
          <div className="flex gap-1">
            {tech.length > 0
              ? tech.slice(0, 4).map((item) => (
                  <span
                    key={item.name}
                    className="mc-slot flex items-center justify-center w-10 h-10"
                    title={item.name}
                  >
                    {typeof item.icon === "string" ? (
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-contain w-6 h-6"
                      />
                    ) : (
                      item.icon({ className: "w-6 h-6" })
                    )}
                  </span>
                ))
              : tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-[10px] rounded-full bg-white/10 text-white"
                  >
                    {tag}
                  </span>
                ))}
          </div>
        </div>

        <div className="relative mx-3 overflow-hidden mc-block h-[188px] xl:h-48 2xl:h-56 bg-stone-700 ">          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover w-full h-full select-none"
            draggable={false}
          />
        </div>

        <div className="p-3 space-y-2">
          <p className="text-base leading-relaxed text-gray-200 whitespace-pre-line select-none text-md 2xl:text-lg md:select-text">
            {description}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex justify-between gap-2 pb-6 text-md xl:text-lg 2xl:text-2xl">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="mc-button mc-font flex items-center gap-1 px-4 py-2 text-xs font-bold text-black transition-all -translate-y-10 hover:pl-8"
              style={{ clipPath: "polygon(0 0, 100% 0, 82% 100%, 0 100%)" }}
              draggable={false}
            >
              GitHub
            </a>
          )}
          {altUrl && (
            <a
              href={altUrl}
              target="_blank"
              rel="noreferrer"
              className="mc-button mc-font flex items-center gap-1 px-4 py-2 text-xs font-bold text-black transition-all hover:pr-8"
              style={{ clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0 100%)" }}
              draggable={false}
            >
              {altUrlLabel}
            </a>
          )}
        </div>
      </div>
    </hover-tilt>
  );
}
