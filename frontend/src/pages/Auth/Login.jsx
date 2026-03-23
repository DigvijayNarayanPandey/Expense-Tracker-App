import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  // Handle Login form Submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address!");
      return;
    }

    if (!password) {
      setError("Please enter the Password");
      return;
    }

    setError("");

    //Login API call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 mid:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black dark:text-white">Welcome Back</h3>
        <p className="text-xs text-slate-900 dark:text-slate-400 mt-[5px] mb-6">
          Please enter your details to login in
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin(e);
              }
            }}
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
            autoComplete="current-password"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin(e);
              }
            }}
          />
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            LOGIN
          </button>
          <p className="text-[13px] text-slate-800 dark:text-slate-200 mt-3">
            Don't have an account{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
