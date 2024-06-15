import {
  ArrowRightStartOnRectangleIcon,
  CircleStackIcon,
  CurrencyRupeeIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LongLogo from "../assets/iiitdlonglogo.png";
import ShortLogo from "../assets/iiitdshortlogo.png";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (url) => {
    if (url === "/login") {
      localStorage.removeItem("token");
    }
    navigate(url);
  };

  const list = [
    {
      icon: HomeIcon,
      text: "Dashboard",
      url: "/",
    },
    {
      icon: CircleStackIcon,
      text: "Database",
      url: "/db",
    },
    {
      icon: CurrencyRupeeIcon,
      text: "Finance",
      url: "/finance",
    },
    {
      icon: DocumentDuplicateIcon,
      text: "Invigilation",
      url: "/exam",
    },
    {
      icon: UserGroupIcon,
      text: "Faculty",
      url: "/faculty",
    },
    {
      icon: ArrowRightStartOnRectangleIcon,
      text: "Logout",
      url: "/login",
    },
  ];

  return (
    <div className="bg-blue-gray-50 flex flex-col h-full w-full hover:w-60 transition-all group">
      <div className="flex place-content-center h-16">
        <img
          src={LongLogo}
          alt="IIITD Logo"
          className="my-2 size-0 invisible group-hover:visible group-hover:size-auto"
        />
        <img
          src={ShortLogo}
          alt="IIITD Logo"
          className="group-hover:invisible group-hover:size-0 visible"
        />
      </div>
      <hr className="my-1 border-gray-500 w-11/12 flex place-self-center" />
      {list.map((item, index) => {
        const isActive = location.pathname === item.url;
        return (
          <div
            key={index}
            className={`m-1 p-3 rounded-xl flex hover:bg-blue-gray-100/70 cursor-pointer ${
              isActive ? "bg-blue-gray-300 hover:bg-blue-gray-200/70" : ""
            }`}
            onClick={() => handleNavigation(item.url)}
          >
            <div className="flex-1 flex align-middle">
              <item.icon className="size-8" />
              <div className="invisible font-medium size-0 self-center group-hover:size-auto group-hover:visible group-hover:ml-2 group-hover:delay-75">
                {item.text}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;
