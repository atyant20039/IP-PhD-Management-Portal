// src/googleOAuth.js
import { GoogleOAuthProvider } from "@react-oauth/google";

const GoogleAuthProvider = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId="851432165884-736ttbd15ices1b4diav0e3a2606fhc8.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthProvider;
