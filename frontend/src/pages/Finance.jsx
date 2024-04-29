import React, { useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Typography,
} from "@material-tailwind/react";

import {
  UserCircleIcon,
} from "@heroicons/react/24/solid";

import StipendPage from "../components/Stipend";
import ContingencyPoints from "../components/ContingencyPoints";

function Stipend() {
  const [activeTab, setActiveTab] = useState("Stipend"); // Default active tab is "Stipend"

  const tabs = [
    {
      label: "Stipend",
      value: "Stipend",
      icon: UserCircleIcon,
      childComponent: <StipendPage />,
    },
    {
      label: "Contingency Points",
      value: "Contingency Points",
      icon: UserCircleIcon,
      childComponent: <ContingencyPoints />,
    },
  ];

  const handleTabChange = (value) => {
    setActiveTab(value);

  };
  
  return (
    <>
      <Typography variant="h2" className="my-3">
        Finance
      </Typography>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <TabsHeader>
          {tabs.map((item) => (
            <Tab key={item.value} value={item.value}>
              <div className="flex items-center gap-2">
                <item.icon className="size-5" />
                {item.label}
              </div>
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody
          animate={{
            initial: { y: 250 },
            mount: { y: 0 },
            unmount: { y: 250 },
          }}
        >
          {tabs.map((item) => (
            <TabPanel key={item.value} value={item.value} className="h-[37rem]">
              {item.childComponent}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </>
  );
}

export default Stipend;
