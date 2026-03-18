
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

interface HoverTiltProps
	extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
	"tilt-factor"?: string | number;
	"scale-factor"?: string | number;
	shadow?: boolean;
}

interface TradingCardProps {
	name: string;
	description: string;
	imageUrl: string;
	githubUrl?: string;
	liveUrl?: string;
	tags?: string[];
}

export default function TradingCard({
	name,
	description,
	imageUrl,
	githubUrl,
	liveUrl,
	tags = [],
}: TradingCardProps) {
	useEffect(() => {
		// @ts-expect-error - package resolves at runtime in this project setup
		import("hover-tilt/web-component");
	}, []);

	return (
		<hover-tilt tilt-factor="1.5" scale-factor="1.05">
			<div
				className="relative overflow-hidden transition-all duration-300 shadow-2xl rounded-xl"
				style={{
					width: "320px",
					aspectRatio: "7 / 10",
					backgroundImage:
						"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,.03) 2px, rgba(255,255,255,.03) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,.03) 2px, rgba(255,255,255,.03) 4px), url(/CardTexture.jpg)",
					backgroundSize: "100% 100%, 100% 100%, auto",
					backgroundColor: "#1a1a1a",
				}}
			>
				<div className="flex items-center justify-between p-3 border-b border-white/20">
					<h3 className="text-sm font-bold tracking-wide text-white">{name}</h3>
					<div className="flex gap-1">
						{tags.slice(0, 2).map((tag, index) => (
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
					<Image src={imageUrl} alt={name} fill className="object-cover w-full h-full" />
				</div>

				<div className="p-3 space-y-2">
					<p className="text-sm leading-relaxed text-gray-200">{description}</p>
				</div>

				<div className="absolute bottom-0 left-0 right-0 flex gap-2 p-3 border-t border-white/20 bg-black/30 backdrop-blur-sm">
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
