import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import BottomBar from "@/components/BottomBar";
import { blogPosts, getBlogPost, type BlogContentBlock } from "@/data/blogs";

function renderBlock(block: BlogContentBlock, i: number) {
  switch (block.type) {
    case "paragraph":
      return <p key={i}>{block.text}</p>;
    case "image":
      return (
        <figure key={i} className="my-8">
          <Image
            src={block.image.src}
            alt={block.image.alt}
            width={1200}
            height={675}
            className="w-full rounded-md border border-neutral-800"
          />
          {block.image.caption && (
            <figcaption className="mt-2 text-sm text-center opacity-50">
              {block.image.caption}
            </figcaption>
          )}
        </figure>
      );
  }
}

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const post = typeof slug === "string" ? getBlogPost(slug) : undefined;

  if (!post) {
    return (
      <div className="flex flex-col w-full min-h-screen">
        <Navbar />
        <div className="flex-1 px-8 py-8">
          <div className="px-2">
            <Link
              href="/"
              className="inline-block pb-2 text-base md:pb-4 md:text-xl opacity-70 hover:opacity-100"
            >
              ← Back
            </Link>
            <h1 className="text-4xl md:text-6xl">Post not found</h1>
          </div>
        </div>
        <div className="hidden w-full bg-black md:block">
          <BottomBar />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      <Navbar />
      <div className="flex-1 px-8 py-8">
        <div className="px-2 max-w-3xl">
          <Link
            href="/blogs"
            className="inline-block pb-2 text-base md:pb-4 md:text-xl opacity-70 hover:opacity-100"
          >
            ← Back to Blogs
          </Link>
          <p className="text-sm opacity-50 md:text-base">{post.date}</p>
          <h1 className="mt-2 text-4xl font-bold md:text-6xl">{post.title}</h1>
          <div className="mt-8 space-y-6 text-base leading-7 md:text-lg md:leading-8 opacity-80">
            {post.content.map((block, i) => renderBlock(block, i))}
          </div>
        </div>
      </div>
      <div className="hidden w-full bg-black md:block">
        <BottomBar />
      </div>
    </div>
  );
}
