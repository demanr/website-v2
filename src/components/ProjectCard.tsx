import Image from "next/image";

interface ProjectTech {
	name: string;
	icon: string;
}

interface ProjectLink {
	label: string;
	href: string;
}

interface ProjectCardProps {
	title: string;
	tech?: ProjectTech[];
	imageUrl?: string;
	description: string;
	links?: ProjectLink[];
}

export default function ProjectCard({
	title,
	tech = [],
	imageUrl,
	description,
	links = [],
}: ProjectCardProps) {
	return (
		<div
			className="w-[360px] aspect-[0.68] rounded-[22px] border-[10px] border-[#cf1f11] bg-black p-4 text-white"
			style={{
				backgroundImage: 'url("/CardTexture.jpg")',
				backgroundRepeat: "repeat",
			}}
		>
			<div className="flex flex-col h-full gap-4">
				<header className="flex items-center justify-between gap-4">
					<h3 className="text-2xl leading-none font-emibold">{title}</h3>
					<div className="flex items-center gap-2">
						{tech.slice(0, 4).map((item) => (
							<span
								key={item.name}
								className="flex items-center justify-center rounded-md h-9 w-9 bg-zinc-900/90"
								title={item.name}
							>
								<Image
									src={item.icon}
									alt={item.name}
									width={20}
									height={20}
									className="object-contain w-5 h-5"
								/>
							</span>
						))}
					</div>
				</header>

				<div className="relative h-full w-full overflow-hidden rounded-xl border-2 border-[#cf1f11] bg-zinc-900">
					{imageUrl ? (
						<Image
							src={imageUrl}
							alt={`${title} preview`}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 92vw, 380px"
						/>
					) : (
						<div className="flex items-center justify-center h-full text-sm text-zinc-300">
							Project image
						</div>
					)}
				</div>

				<div className="min-h-[28%] rounded-xl bg-black/55 p-3">
					<p className="text-lg leading-tight text-zinc-100">{description}</p>
				</div>

				<footer className="flex items-end justify-between gap-3 mt-auto">
					{links.map((link) => (
						<a
							key={link.href}
							href={link.href}
							target="_blank"
							rel="noreferrer"
							className="min-w-[46%] rounded-sm bg-[#cf1f11] px-4 py-2 text-center text-sm font-semibold leading-none text-white transition hover:bg-[#b91b10]"
						>
							{link.label} ↗
						</a>
					))}
				</footer>
			</div>
		</div>
	);
}
