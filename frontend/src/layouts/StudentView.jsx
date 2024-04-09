import { Spinner } from "@material-tailwind/react";
import { useNavigation, Outlet } from "react-router-dom";

function StudentLayout() {
  const { state } = useNavigation();

  if (state === "loading") {
    return (
      <div className="w-full h-full flex flex-col place-content-center place-items-center">
        <Spinner className="size-12" />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen">
      <Outlet />
    </div>
  );
}

export default StudentLayout;
