import { Spinner } from "@material-tailwind/react";
import Sidebar from "../components/Sidebar";
import { useNavigation, Outlet } from "react-router-dom";

function AdminLayout() {
  const { state } = useNavigation();

  if (state === "loading") {
    return (
      <div className="w-full h-full flex flex-col place-content-center place-items-center">
        <Spinner className="size-12" />
      </div>
    );
  }

  return (
    <div className="flex flex-row w-screen h-screen">
      <div className="z-50 w-16 absolute inset-y-0 left-0">
        <Sidebar />
      </div>
      <div className="w-[calc(100%-64px)] absolute inset-y-0 right-0">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
