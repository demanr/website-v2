export interface BlogContentImage {
  src: string;
  alt: string;
  caption?: string;
}

export type BlogContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "image"; image: BlogContentImage };

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: BlogContentBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "hello-world",
    title: "Making your Linkedin profile Pop (in 5 minutes or less)",
    date: "May 29, 2026",
    description:
      "How a few minutes taking a picture completely transforms your professional look.",
    content: [
      { type: "paragraph", text: "Content Coming Soon!" },
      { type: "image", image: { src: "/bracketbot.png", alt: "Bracket Bot robot", caption: "My lane-driving robot from the Bracket Bot hackathon" }},
      { type: "paragraph", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    ],
  },
  {
    slug: "hello-world",
    title: "Hello World",
    date: "Sept 29, 2026",
    description:
      "Description Text.",
    content: [
      { type: "paragraph", text: "Content Coming Soon!" },
      { type: "image", image: { src: "/bracketbot.png", alt: "Bracket Bot robot", caption: "My lane-driving robot from the Bracket Bot hackathon" }},
      { type: "paragraph", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    ],
  },
  {
    slug: "hello-world",
    title: "Hello World Number 2",
    date: "July 04, 2026",
    description:
      "Description Text The Second one.",
    content: [
      { type: "paragraph", text: "Content Coming Soon!" },
      { type: "image", image: { src: "/bracketbot.png", alt: "Bracket Bot robot", caption: "My lane-driving robot from the Bracket Bot hackathon" }},
      { type: "paragraph", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
