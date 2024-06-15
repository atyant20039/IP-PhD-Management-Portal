import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';

import {
  Alert,
  Button,
  Card,
  CardBody,

} from "@material-tailwind/react";

// Import the background image
import backgroundImage from "../assets/bgimage.png";

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = (response) => {
    console.log(response);
    onLoginSuccess(response);
    navigate('/');
  };

  const handleLoginError = (error) => {
    console.log(error);
    console.error('Login Failed:', error);
  };

  return (
    <div
      className="login-page relative h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <Card>
        <CardBody>
          <h1 className="text-3xl text-center mb-6">Login</h1>
          {/* Add your login form here */}
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
            render={({ onClick }) => (
              <Button onClick={onClick} color="blue" ripple="light">
                Login with Google
              </Button>
            )}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;
