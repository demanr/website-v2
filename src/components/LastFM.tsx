import { useEffect, useState } from "react";
import { useLastFM } from "use-last-fm";

const CurrentlyPlaying = () => {
  const lastFM = useLastFM(
    process.env.NEXT_PUBLIC_LASTFM_USER!,
    process.env.NEXT_PUBLIC_LASTFM_TOKEN!
  );
  const [ready, setReady] = useState<boolean>(false);

  // ready set to true after 1.8 seconds
  useEffect(() => {
    setTimeout(() => {
      setReady(true);
    }, 1800);
  }, []);

  if (lastFM.status !== "playing" || !ready) {
    console.log("not playing");
    return (
      <a
        href="#"
        className="opacity-5 -translate-y-[35%]"
        aria-label="void"
        id="player"
      ></a>
    );
  }
  console.log("playing");
  return (
    <a
      href={lastFM.song.url}
      id="player"
      className="transition duration-500 overflow-hidden flex h-[7rem] wp-full lg:w-[20rem] gap-4 lg:pr-8 bg-none lg:bg-[#DE2D4E] p-4 lg:rounded-full opacity-1"
    >
      <div className="h-full overflow-hidden border-2 rounded-full aspect-square animate-spinDJ">
        <img
          src={lastFM.song.art ? lastFM.song.art : "record.webp"}
          className="w-full h-full aspect-square"
          alt="album art"
          width={80}
          height={80}
        ></img>
      </div>
      <div className="flex-1 flex flex-col items-start justify-center text-left w-[calc(100%-7rem)]">
        <p className="text-sm">Listening to </p>
        <p className="w-full pb-1 overflow-hidden text-2xl font-bold leading-5 text-ellipsis whitespace-nowrap">
          {lastFM.song.name}
        </p>
        <span className="w-full overflow-hidden text-lg leading-5 text-ellipsis whitespace-nowrap">
          {lastFM.song.artist} - {lastFM.song.album}
        </span>
      </div>
    </a>
  );
};

export default CurrentlyPlaying;
