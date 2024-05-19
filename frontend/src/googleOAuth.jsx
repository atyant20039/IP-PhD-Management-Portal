// src/googleOAuth.js
import { GoogleOAuthProvider } from '@react-oauth/google';

const GoogleAuthProvider = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId="844183396322-d4j1mu55m5vm2d6uonf06l7nu2gdrsri.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthProvider;
