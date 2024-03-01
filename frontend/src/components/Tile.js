import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
  } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const Tile = ({label, image, linkTo}) => {
    return(
        <Link to={linkTo}>
        <Button
            ripple={true}
            fullWidth={false}
            className="w-72 h-58 bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none"
        >
            <Card className="mt-6 ml-8 flex flex-col ">
                <CardHeader className="relative" >
                    <img className='object-fill'
                    src={image}
                    alt={label}
                    />
                </CardHeader>
                <CardBody>
                    <Typography variant="h5" color="black" className="mb-2 text-black text-center " >
                    {label}
                    </Typography>
                </CardBody> 
            </Card>
        </Button>
        </Link>
    );
}
export default Tile;