
"use client";

import Image from "next/image";
import React, { useEffect } from "react";

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
	useEffect(() => {
		// @ts-expect-error - package resolves at runtime in this project setup
		import("hover-tilt/web-component");
	}, []);

	return (
    <hover-tilt
      tilt-factor="0.4"
      scale-factor="1.25"
      glare-mask-composite="add"
      blend-mode="hard-light"
      glare-intensity={0.5}
      glare-mask="url('/circular_texture.jpeg')"
      glare-mask-mode="luminance"
      class="[&::part(container)]:rounded-3xl "
    >
      <div
        className="z-[-10] bg-slate-800 relative overflow-hidden transition-all duration-300 shadow-2xl w-80 aspect-[3/5] rounded-xl border-4"
        // version 1
        style={{
          width: "340px",
          //   aspectRatio: "2 / 5",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,.18) 3px, rgba(0,0,0,.18) 6px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,.18) 3px, rgba(0,0,0,.18) 6px), linear-gradient(rgba(26,26,26,.35), rgba(26,26,26,.35)), linear-gradient(rgba(26,26,26,.8), rgba(26,26,26,.8)), url('/CardTexture.jpeg')",
          backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 220px 220px",
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
        <div className="flex items-center justify-between p-3 border-b border-white/20">
          <h3 className="text-sm font-bold tracking-wide text-white">{name}</h3>
          <div className="flex gap-1">
            {tech.length > 0
              ? tech.slice(0, 4).map((item) => (
                  <span
                    key={item.name}
                    className="flex items-center justify-center rounded-md h-7 w-7 bg-zinc-900/90"
                    title={item.name}
                  >
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={16}
                      height={16}
                      className="object-contain w-4 h-4"
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

        <div className="relative h-40 mx-3 mt-3 overflow-hidden border rounded-md border-white/20">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover w-full h-full "
          />
        </div>

        <div className="p-3 space-y-2">
          <p className="text-sm leading-relaxed text-gray-200">{description}</p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-3 border-t border-white/20 bg-black/30 backdrop-blur-xs">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white transition-colors rounded-md bg-white/10 hover:bg-white/20"
            >
              GitHub
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white transition-colors rounded-md bg-blue-500/20 hover:bg-blue-500/30"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </hover-tilt>
  );
}
