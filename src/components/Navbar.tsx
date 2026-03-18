import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="pr-0 border-b border-gray-200 lg:pr-36 md:pr-12 w-fit">
      <div className="px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center h-12 md:h-12">
          <div className="flex space-x-4 text-base text-white transition md:space-x-8 md:text-lg lg:text-xl">
            <Link href="/portfolio" className="md:w-20 hover:font-bold">
              /Portfolio
            </Link>
            <Link href="/projects" className="md:w-20 hover:font-bold">
              /Projects
            </Link>
            <Link href="/positions" className="md:w-20 hover:font-bold">
              /Positions
            </Link>
            <Link href="/photography" className="md:w-20 hover:font-bold">
              /Photography
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
