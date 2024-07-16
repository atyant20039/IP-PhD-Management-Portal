// src/googleOAuth.js
import { GoogleOAuthProvider } from "@react-oauth/google";

const GoogleAuthProvider = ({ children }) => {
  const CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>{children}</GoogleOAuthProvider>
  );
};

export default GoogleAuthProvider;
