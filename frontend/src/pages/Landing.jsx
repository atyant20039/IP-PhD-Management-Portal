import React from 'react';
import dashboardImage from '../assets/SquareGrid/desk.jpg';
import stipendImage from '../assets/SquareGrid/wallet(2).jpg';
import phd_dataImage from '../assets/SquareGrid/database.png';
import Tile from '../components/Tile';

  export const Landing = () => {
    return(
        <div className="flex flex-row cursor-pointer">
            <Tile label={'Dashboard'} image={dashboardImage}/>
            <Tile label={'Stipend Release'} image = {stipendImage} />
            <Tile label={'Database'} image={phd_dataImage} linkTo={'/database'}/>
        </div>
        
    )
  }