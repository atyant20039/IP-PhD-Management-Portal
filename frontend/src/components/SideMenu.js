import React from "react";
import {
    Card,
    Typography,
    List,
    ListItem,
    IconButton,

  } from "@material-tailwind/react";

  import {Bars3Icon, PowerIcon, CurrencyRupeeIcon, TableCellsIcon, BuildingLibraryIcon, AcademicCapIcon} from "@heroicons/react/24/outline";
  import dash_icon from "../assets/dashboard_menu_icon.svg";
import db_icon from "../assets/database_menu_icon.svg";
import stipend_icon from "../assets/stipend_menu_icon.svg";

   
  const SideMenu = () => {   
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const toggleSidebar = () => {
      setIsMenuOpen(!isMenuOpen);
    };
    return (
        <div className={`h-screen  ${isMenuOpen ? 'w-16' : 'w-64'}  transition-all duration-100 mt-2`}>
          <div className="flex flex-row">
            <IconButton variant="text" size="lg" onClick={toggleSidebar} className="ml-4" >
                <Bars3Icon className="h-8 w-8 stroke-2" />
            </IconButton>
          </div>
          <Card className="h-[calc(100vh-2rem)] w-full h-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
            {/* <div className="mb-2 p-4">
              <Typography variant="h5" color="blue-gray" >
              
              <span className={`${isMenuOpen?'hidden':'ml-2'}`}>PhD Portal</span>
              </Typography>
            </div> */}
            <List>
              <ListItem>
                <AcademicCapIcon className="h-8 w-8 stroke-2"/>
                <span className={`${isMenuOpen?'hidden':'ml-2'}`}>PhD Management Portal</span>
              </ListItem>
              <br></br>
              <ListItem>
                <BuildingLibraryIcon className="w-8" />
                <span className={`${isMenuOpen?'hidden':'ml-2'}`}>Dashboard</span>
              </ListItem>
              <hr className="my-2 border-blue-gray-50" />
              <ListItem>
                <CurrencyRupeeIcon className="w-8"/>
                <span className={`${isMenuOpen?'hidden':'ml-2'}`}>Stipend Release</span>
              </ListItem>
              <hr className="my-2 border-blue-gray-50" />
              <ListItem>
                <TableCellsIcon className="w-8"/>
                <span className={`${isMenuOpen?'hidden':'ml-2'}`}>Database</span>
              </ListItem>
              <hr className="my-2 border-blue-gray-50" />
              <ListItem>
                <PowerIcon className="h-8 w-8 stroke-2 " />
                <span className={`${isMenuOpen?'hidden':'ml-2'}`}>Logout</span>
              </ListItem>
            </List>
          </Card>
        </div>
    );
  }
  export default SideMenu;