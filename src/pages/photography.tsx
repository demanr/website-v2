import { NextPage } from "next";
import React from "react";
import Image, { StaticImageData } from "next/image";
import { useScreen } from "usehooks-ts";

import img1 from "../../public/photography/IMG_0673 2.jpeg";
import img2 from "../../public/photography/IMG_0675 2.jpeg";
import img3 from "../../public/photography/IMG_0695 2.jpeg";
import img4 from "../../public/photography/IMG_0696 2.jpeg";
import img5 from "../../public/photography/IMG_0697 2.jpeg";
import img6 from "../../public/photography/IMG_0718 2.jpeg";
import img7 from "../../public/photography/IMG_0743 2.jpeg";
import img8 from "../../public/photography/IMG_0806 2.jpeg";
import img9 from "../../public/photography/IMG_0814 2.jpeg";
import img10 from "../../public/photography/IMG_0824 2.jpeg";
import img11 from "../../public/photography/IMG_1097 2.jpeg";
import img12 from "../../public/photography/IMG_1108 2.jpeg";
import img13 from "../../public/photography/IMG_1205 2.jpeg";
import img14 from "../../public/photography/IMG_1268.jpeg";
import img15 from "../../public/photography/IMG_1596 2.jpeg";
import img16 from "../../public/photography/IMG_1632 2.jpeg";
import img17 from "../../public/photography/IMG_1803 2.jpeg";
import img18 from "../../public/photography/IMG_2002 2.jpeg";
import img19 from "../../public/photography/IMG_2067 2.jpeg";
import img20 from "../../public/photography/IMG_2124 2.jpeg";
import img21 from "../../public/photography/IMG_2352 2.jpeg";
import img22 from "../../public/photography/IMG_2378 2.jpeg";
import img23 from "../../public/photography/IMG_2465 2.jpeg";
import img24 from "../../public/photography/IMG_2584 2.jpeg";
import img25 from "../../public/photography/IMG_2591 2.jpeg";
import img26 from "../../public/photography/IMG_2637 2.jpeg";
import img27 from "../../public/photography/IMG_2639 2.jpeg";
import img28 from "../../public/photography/IMG_2662 2.jpeg";
import img29 from "../../public/photography/IMG_2732 2.jpeg";
import img30 from "../../public/photography/IMG_2775.jpeg";
import img31 from "../../public/photography/IMG_3390 2.jpeg";
import img32 from "../../public/photography/IMG_3417 2.jpeg";
import img33 from "../../public/photography/IMG_3468 2.jpeg";
import img34 from "../../public/photography/IMG_3670 2.jpeg";
import img35 from "../../public/photography/IMG_3792.jpeg";
import img36 from "../../public/photography/IMG_4044 2.jpeg";
import img37 from "../../public/photography/IMG_4598 2.jpeg";
import img38 from "../../public/photography/IMG_4614 2.jpeg";
import img39 from "../../public/photography/IMG_5303 2.jpeg";
import img40 from "../../public/photography/IMG_5577 2.jpeg";
import img41 from "../../public/photography/IMG_5821 2.jpeg";
import img42 from "../../public/photography/IMG_5972 2.jpeg";
import img43 from "../../public/photography/IMG_5987 2.jpeg";
import img44 from "../../public/photography/IMG_5996 2.jpeg";
import img45 from "../../public/photography/IMG_6103 2.jpeg";
import img46 from "../../public/photography/IMG_6143 2.jpeg";
import img47 from "../../public/photography/IMG_6154 2.jpeg";
import img48 from "../../public/photography/IMG_6326 2.jpeg";
import img49 from "../../public/photography/IMG_9245 2.jpeg";
import img50 from "../../public/photography/IMG_9307 2.jpeg";
import img51 from "../../public/photography/IMG_9972 2.jpeg";
import img52 from "../../public/photography/lastimg.jpeg";
import img53 from "../../public/photography/IMG_0009 2.jpeg";
import img54 from "../../public/photography/IMG_0022 2.jpeg";
import img55 from "../../public/photography/IMG_0201 2.jpeg";
import img56 from "../../public/photography/IMG_0265 2.jpeg";
import img57 from "../../public/photography/IMG_0399.jpeg";
import img58 from "../../public/photography/IMG_0400.jpeg";
import img59 from "../../public/photography/IMG_0412.jpeg";
import img60 from "../../public/photography/IMG_0496.jpeg";
import img61 from "../../public/photography/IMG_0094 2.jpeg";

const allPhotos = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
  img14,
  img15,
  img16,
  img17,
  img18,
  img19,
  img20,
  img21,
  img22,
  img23,
  img24,
  img25,
  img26,
  img27,
  img28,
  img29,
  img30,
  img31,
  img32,
  img33,
  img34,
  img35,
  img36,
  img37,
  img38,
  img39,
  img40,
  img41,
  img42,
  img43,
  img44,
  img45,
  img46,
  img47,
  img48,
  img49,
  img50,
  img51,
  img52,
  img53,
  img54,
  img55,
  img56,
  img57,
  img58,
  img59,
  img60,
  img61,
];

allPhotos.sort(() => Math.random() - 0.5);

const imgList1Desktop = allPhotos.slice(0, 20);
const imgList2Desktop = allPhotos.slice(20, 40);
const imgList3Desktop = allPhotos.slice(40, 61);

const imgList1Mobile = allPhotos.slice(0, 30);
const imgList2Mobile = allPhotos.slice(30, 61);

interface CardProps {
  img: StaticImageData;
  date: string;
}

const Card: React.FC<CardProps> = ({ img, date }) => {
  return (
    <div className="relative justify-center rounded-md">
      <Image
        className="border-2 border-neutral-800 "
        src={img}
        alt=""
        placeholder="blur"
        loading="lazy"
      ></Image>
    </div>
  );
};
/* <div className="absolute bottom-0 right-0 z-10 pb-2 pr-4 text-3xl">
        date
      </div>*/

/* cardCol props list of string name imgs */
interface CardColProps {
  imgs: StaticImageData[];
}

const CardCol: React.FC<CardColProps> = ({ imgs }) => {
  /* less columns based on card size?*/

  return (
    <div className="flex flex-col gap-4">
      {imgs.map((image) => (
        <Card img={image} date="" key={img1.src} />
      ))}
    </div>
  );
};

const Photography: NextPage = () => {
  const imgList = [
    "/../../public/photography/testimg.jpeg",
    "/../../public/photography/test2.jpeg",
  ];
  const screen = useScreen();

  return (
    <div className="px-8 py-8 font-serif text-6xl">
      <div className="px-2">
        <h1 className="">Photography</h1>
        {/* <hr className="max-w-2xl" /> */}
        <div className="w-full max-w-2xl pt-4 pb-8 text-xl opacity-60">
          I've always held an interest in photographing nature. As a kid, I'd
          rush to finish dinner to try to catch the perfect sunset on my iPod.
          In this day and age, most people carry a miniture camera everywhere
          they go, myself included. Due to this, countless swiftly passing
          sights are able to be kept in photo form, if only we take the moment
          to witness them. Here is a small collection of the precious views I've
          taken the time appreciate. Enjoy!
        </div>
      </div>
      {/* <hr className="max-w-2xl pb-8" /> */}
      <div className="grid w-full grid-cols-3 gap-2 p-8md:gap-4">
        <CardCol imgs={imgList1Desktop} />
        <div className="pt-16 md:pt-36">
          <CardCol imgs={imgList2Desktop} />
        </div>
        <CardCol imgs={imgList3Desktop} />
      </div>
    </div>
  );
};

export default Photography;
