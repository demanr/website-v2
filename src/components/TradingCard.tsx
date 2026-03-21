
"use client";

import Image from "next/image";
import { Zen_Dots } from "next/font/google";
import React, { useEffect, useState } from "react";

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
  style?: React.CSSProperties;
  class?: string;

  shadow?: boolean;
}

interface TradingCardProps {
	name: string;
	description: string;
	imageUrl: string;
	githubUrl?: string;
	liveUrl?: string;
	tech?: { name: string; icon: string }[];
	tags?: string[];
}

export default function TradingCard({
	name,
	description,
	imageUrl,
	githubUrl,
	liveUrl,
	tech = [],
	tags = [],
}: TradingCardProps) {
  const [isBelowMd, setIsBelowMd] = useState(false);

	useEffect(() => {
		// @ts-expect-error - package resolves at runtime in this project setup
		import("hover-tilt/web-component");
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
      glare-intensity={0.5}
      glare-mask="url('/circular_texture.jpeg')"
      glare-mask-mode="luminance"
      style={{ touchAction: "pan-y" }}
      class="[touch-action:pan-y] [&::part(container)]:rounded-3xl [&::part(container)]:[touch-action:pan-y]"
    >
      <div
        className="-z-10 bg-slate-800 relative overflow-hidden transition-all duration-300 shadow-2xl w-80 2xl:w-96 aspect-[3/5] rounded-xl border-4 border-white/60"
        // version 1
        style={{
          //   aspectRatio: "2 / 5",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,.18) 3px, rgba(0,0,0,.18) 6px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,.18) 3px, rgba(0,0,0,.18) 6px), linear-gradient(rgba(26,26,26,.35), rgba(26,26,26,.35)), linear-gradient(rgba(26,26,26,.8), rgba(26,26,26,.8)), url('/CardTexture.jpg')",
          backgroundSize:
            "100% 100%, 100% 100%, 100% 100%, 100% 100%, 220px 220px",
          backgroundColor: "#1a1a1a",
        }}
        //  version 2
        // style={{
        //   width: "320px",
        //   backgroundImage:
        //     "linear-gradient(rgba(10,14,20,.58), rgba(10,14,20,.58)), radial-gradient(circle at 25% 15%, rgba(120,170,210,.12), transparent 45%), url('/ice_texture.png')",
        //   backgroundBlendMode: "multiply, soft-light, normal",
        //   backgroundSize: "100% 100%, 100% 100%, 220px 220px",
        //   backgroundPosition: "center, center, center",
        //   backgroundColor: "#0f141b",
        // }}
      >
        <div className="flex items-center justify-between p-3 pt-4 border-white/20">
          <h3
            className={`${zenDots.className} text-xl xl:text-2xl 2xl:text-3xl font-bold tracking-wide text-white`}
          >
            {name}
          </h3>
          <div className="flex gap-1">
            {tech.length > 0
              ? tech.slice(0, 4).map((item) => (
                  <span
                    key={item.name}
                    className="flex items-center justify-center w-10 h-10"
                    title={item.name}
                  >
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-contain w-6 h-6"
                    />
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

        <div className="relative mx-3 overflow-hidden border border-b-8 rounded-md h-[188px] xl:h-48 2xl:h-56 border-white/40 ">
          <Image
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
              className="flex items-center gap-1 px-5 py-2 pr-10 font-bold text-black transition-all -translate-y-10 bg-white hover:pl-8"
              style={{ clipPath: "polygon(0 0, 100% 0, 82% 100%, 0 100%)" }}
              draggable={false}
            >
              GitHub
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-5 py-2 pl-10 font-bold text-black transition-all bg-white hover:pr-8"
              style={{ clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0 100%)" }}
              draggable={false}
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </hover-tilt>
  );
}
