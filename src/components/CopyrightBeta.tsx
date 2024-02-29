import { useEffect, useState } from "react";

const CopyrightBeta = () => {
  let start = new Date();
  let year = start.getFullYear().toString();

  return (
    <footer className="bottom-0 w-full py-6 text-xs text-center sm:absolute">
      © Rachelle De Man {year} - All Rights Reserved.
    </footer>
  );
};

export default CopyrightBeta;
