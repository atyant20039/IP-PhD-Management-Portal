import React from "react";
import { Spinner } from "@material-tailwind/react";

function Loading() {
  return (
    <div className="w-full h-full flex flex-col place-content-center place-items-center">
      <Spinner className="size-12" />
    </div>
  );
}

export default Loading;
