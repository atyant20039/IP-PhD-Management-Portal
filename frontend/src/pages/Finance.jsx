import {
  Card,
  CardBody,
  CardHeader,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import React, { useState } from "react";

import { CurrencyRupeeIcon, PlusCircleIcon } from "@heroicons/react/24/solid";

import ContingencyPoints from "../components/ContingencyPoints";
import StipendPage from "../components/Stipend";

function Stipend() {
  const [activeTab, setActiveTab] = useState("Stipend"); // Default active tab is "Stipend"

  const tabs = [
    {
      label: "Stipend",
      value: "Stipend",
      icon: CurrencyRupeeIcon,
      childComponent: <StipendPage />,
    },
    {
      label: "Contingency Points",
      value: "Contingency Points",
      icon: PlusCircleIcon,
      childComponent: <ContingencyPoints />,
    },
  ];

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <Card className="relative h-full w-full flex flex-1 flex-col">
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none mt-0 pt-4"
      >
        <Typography variant="h4" color="blue-gray" className="cursor-default">
          Finance
        </Typography>
      </CardHeader>
      <CardBody className="overflow-auto flex flex-1 p-2 pb-0">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          className="flex flex-col flex-1"
        >
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
            className="flex flex-1"
            animate={{
              initial: { y: 250 },
              mount: { y: 0 },
              unmount: { y: 250 },
            }}
          >
            {tabs.map((item) => (
              <TabPanel
                key={item.value}
                value={item.value}
                className="px-0 py-2 h-full"
              >
                {item.childComponent}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </CardBody>
    </Card>
  );
}

export default Stipend;
