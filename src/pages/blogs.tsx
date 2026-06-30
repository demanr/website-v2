import Navbar from "@/components/Navbar";
import BottomBar from "@/components/BottomBar";
import Link from "next/link";
import { blogPosts } from "@/data/blogs";

export default function Blogs() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Navbar />
      <div className="flex-1 px-4 py-4 md:py-8 md:px-8">
        <div className="max-w-4xl px-2">
          {/* <Link
            href="/"
            className="inline-block pb-2 text-base md:pb-4 md:text-xl opacity-70 hover:opacity-100"
          >
            ← Back
          </Link> */}
          <h1 className="text-xl md:text-3xl">Rachelle-Blogs</h1>
          <p className="w-full max-w-2xl pb-2 text-base leading-5 border-b md:py-2 md:leading-6 md:text-xl opacity-60">
            Sharing some of what I learned on the journey to becoming a
            developer
          </p>
          {/* remove once live */}
          {/* <p className="pt-4 text-lg md:text-xl">Coming Soon!</p> */}

          <div className="flex flex-col gap-4 pt-4 md:pt-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="">
                <div className="grid grid-cols-[auto_auto_1fr] gap-x-2 text-base md:text-lg">
                  <span className="w-[105px] md:w-[115px] opacity-50">
                    {post.date}
                  </span>
                  <span className="opacity-50 ">–</span>
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="transition hover:opacity-70"
                  >
                    {post.title}
                  </Link>
                  <span className="md:col-span-2"></span>
                  <p className="hidden text-base leading-5 md:block md:leading-6 opacity-60">
                    {post.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <div className="hidden w-full bg-black md:block">
        <BottomBar />
      </div>
    </div>
  );
}
