import { GoogleLogin } from "react-google-login";

const GoogleLoginButton = () => {
  const handleSuccess = async () => {
    window.location.href = "http://localhost:8000/auth/google";
  };

  const handleFailure = (error) => {
    //console.log("Google login failed:", error);
  };

  return (
    <GoogleLogin
      clientId="926534521898-2ff7h26mjgj6aknsdtos1bm06g0ng8gl.apps.googleusercontent.com"
      buttonText="Login with Google"
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleLoginButton;
