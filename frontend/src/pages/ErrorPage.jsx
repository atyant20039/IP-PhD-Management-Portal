import { useRouteError } from "react-router-dom";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
        <div className="h-full w-full flex flex-row place-content-center">
            <div className=" flex flex-col place-content-center">
                <div className="flex flex-col place-content-center place-items-center">
                    <ExclamationTriangleIcon/>
                    <div className="text-4xl font-bold my-8">Oops!</div>
                    <div className="my-8">Sorry, an unexpected error has occurred.</div>
                    <div>
                        <i>{error.statusText || error.message}</i>
                    </div>
                </div>
            </div>
        </div>
  );
}