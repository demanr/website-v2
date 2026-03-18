'use client';

import Image from 'next/image';
import React, { MouseEvent, useRef } from 'react';

interface TradingCardLink {
	label: string;
	href: string;
	icon?: string;
}

interface TradingCardV2Props {
	title: string;
	description: string;
	image: string;
	link?: string;
	links?: TradingCardLink[];
	tag?: string;
}

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

const TradingCardV2: React.FC<TradingCardV2Props> = ({
	title,
	description,
	image,
	link,
	links,
	tag = 'Featured Project',
}) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const footerLinks = links ?? (link ? [{ label: 'GitHub', href: link, icon: '/githubLogo.svg' }] : []);
	const headerIcons = footerLinks.slice(0, 2);

	const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
		if (!cardRef.current) return;

		const rect = cardRef.current.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		// Calculate percentages
		const xPercent = (x / rect.width) * 100;
		const yPercent = (y / rect.height) * 100;

		// Set CSS variables for shine position
		cardRef.current.style.setProperty('--mouse-x', `${xPercent}%`);
		cardRef.current.style.setProperty('--mouse-y', `${yPercent}%`);
		cardRef.current.style.setProperty('--shine-opacity', '1');
	};

	const handleMouseLeave = () => {
		if (!cardRef.current) return;
		cardRef.current.style.setProperty('--shine-opacity', '0');
	};

	return (
		<div
			ref={cardRef}
			className="group relative w-[min(360px,92vw)] aspect-[0.72] rounded-[20px] overflow-hidden transition-transform duration-300"
			style={{
				'--mouse-x': '50%',
				'--mouse-y': '50%',
				'--shine-opacity': '0',
				backgroundColor: '#000',
				backgroundImage: 'url("/CardTexture.jpg")',
				backgroundRepeat: 'repeat',
				backgroundSize: 'auto',
				border: '1px solid rgba(255, 255, 255, 0.28)',
				boxShadow: '0 20px 35px -20px black, 0 0 35px -20px hsl(176, 100%, 76%)',
			} as React.CSSProperties}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			{/* Content */}
			<div className="relative z-10 flex flex-col h-full gap-3 p-4 text-white">
				{/* Header */}
				<div className="flex items-center justify-between min-h-[2.2rem]">
					<h3 className="text-base font-bold leading-tight">{title}</h3>
					<div className="flex gap-2" aria-hidden>
						{headerIcons.map((item) => (
							<span
								className="flex items-center justify-center w-6 h-6 overflow-hidden border rounded-full border-white/40 bg-white/8"
								key={item.href}
							>
								{item.icon ? (
									<Image
										src={item.icon}
										alt=""
										width={14}
										height={14}
										className="w-[0.875rem] h-[0.875rem] object-contain brightness-0 invert"
									/>
								) : (
									<span className="text-xs">{item.label.slice(0, 1)}</span>
								)}
							</span>
						))}
					</div>
				</div>

				{/* Image */}
				<div className="relative w-full aspect-video rounded-[10px] border border-white/24 overflow-hidden bg-white/6">
					<Image
						src={image}
						alt={title}
						fill
						sizes="(max-width: 768px) 92vw, 360px"
						className="object-cover w-full h-full"
					/>
				</div>

				{/* Content */}
				<div className="flex flex-col flex-1 gap-2">
					<span className="text-xs tracking-widest uppercase opacity-82">{tag}</span>
					<p className="text-sm leading-[1.35] opacity-94">{description}</p>
				</div>

				{/* Footer */}
				<div className="min-h-[2.5rem] border-t border-white/20 pt-2 flex flex-wrap gap-2">
					{footerLinks.map((item) => (
						<a
							className="inline-flex items-center gap-2 px-2 py-1 text-xs font-semibold transition-colors border rounded-full text-white/95 border-white/28 bg-white/8 hover:bg-white/12"
							href={item.href}
							target="_blank"
							rel="noreferrer"
							key={item.href}
						>
							{item.icon && (
								<Image
									src={item.icon}
									alt=""
									width={12}
									height={12}
									className="object-contain w-3 h-3 brightness-0 invert"
								/>
							)}
							<span>{item.label}</span>
						</a>
					))}
				</div>
			</div>

			{/* Shine/Glare Layer */}
			<div
				className="absolute inset-0 pointer-events-none rounded-[20px] transition-opacity duration-200"
				style={{
					opacity: 'var(--shine-opacity)',
					background: `radial-gradient(
            circle at var(--mouse-x) var(--mouse-y),
            rgba(255, 255, 255, 0.8) 0%,
            rgba(255, 255, 255, 0.4) 15%,
            rgba(255, 255, 255, 0.1) 30%,
            transparent 60%
          )`,
					mixBlendMode: 'color-dodge' as const,
					zIndex: 20,
				}}
			/>

			{/* Rainbow Holographic Layer */}
			<div
				className="absolute inset-0 pointer-events-none rounded-[20px] transition-opacity duration-200"
				style={{
					opacity: 'calc(var(--shine-opacity) * 0.6)',
					background: `repeating-linear-gradient(
            125deg,
            rgba(255, 90, 90, 0.2) 0%,
            rgba(255, 230, 110, 0.2) 14%,
            rgba(90, 255, 220, 0.2) 28%,
            rgba(110, 140, 255, 0.2) 42%,
            rgba(220, 120, 255, 0.2) 56%,
            rgba(255, 90, 90, 0.2) 70%
          ), radial-gradient(
            circle at var(--mouse-x) var(--mouse-y),
            rgba(255, 255, 255, 0.4) 0%,
            transparent 40%
          )`,
					mixBlendMode: 'color-dodge' as const,
					zIndex: 21,
					backgroundSize: '200% 200%, cover',
					backgroundPosition: 'center, center',
				}}
			/>
		</div>
	);
};

export default TradingCardV2;
