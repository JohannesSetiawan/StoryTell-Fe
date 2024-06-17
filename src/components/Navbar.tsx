import { RootState, useAppSelector } from "../redux/store";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slice";
import { useNavigate } from "react-router-dom";
import ToggleTheme from "./common/ToggleTheme";

export function Navbar() {
  const user_token = useAppSelector((state: RootState) => state.user).token;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleYourStory = () => {
    navigate("/your-story");
  };

  const handleRead = () => {
    navigate("/read");
  };

  if (!user_token) {
    return (
      <div className="flex w-full justify-between gap-4 px-4 py-2 md:px-8">
        <div className="text-xl font-bold">Welcome to Storytell!</div>
        <div className="flex flex-row gap-6 items-center">
          <ToggleTheme />
          <button
            onClick={handleRead}
            className="font-bold transition-all duration-200 ease-in-out hover:text-blue-300"
          >
            Read
          </button>
          <button
            onClick={handleRegister}
            className="font-bold transition-all duration-200 ease-in-out hover:text-blue-300"
          >
            Register
          </button>
          <button
            onClick={handleLogin}
            className="font-bold transition-all duration-200 ease-in-out hover:text-blue-300"
          >
            Login
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex w-full justify-between gap-4 px-4 py-2 md:px-8">
        <div className="text-xl font-bold">Welcome Back!</div>
        <div className="flex flex-row gap-6 items-center">
          <ToggleTheme />
          <button
            onClick={handleRead}
            className="font-bold transition-all duration-200 ease-in-out hover:text-blue-300"
          >
            Read
          </button>
          <button
            onClick={handleYourStory}
            className="font-bold transition-all duration-200 ease-in-out hover:text-blue-300"
          >
            Your Story
          </button>
          <button
            onClick={handleLogout}
            className="font-bold transition-all duration-200 ease-in-out hover:text-red-300"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }
}
