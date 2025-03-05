import React, { useState } from "react";
import { useLoginMutation } from "../redux/api/authAPi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [login] = useLoginMutation();

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    const data = {
      username: username,
      password: password,
    };
    await login({ ...data }).then((res) => {
      if (res) {
        if ("data" in res) {
          toast.success("Login success!");
          navigate("/");
        } else if ("data" in res.error) {
          const errorData = res.error.data as { message: string };
          toast.error(errorData.message);
        } else {
          toast.error("Unknown error!");
        }
      }
    });
    setIsLoading(false);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="dark:bg-[#343434] bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="mt-1 p-2 border rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white"
              placeholder="Enter your username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 p-2 border rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <Button type="submit" loading={isLoading}>
            <span>Login</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
