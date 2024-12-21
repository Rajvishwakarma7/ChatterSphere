import axios from "axios";
import { useFormik } from "formik";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider/AuthProvider";
const Login = () => {
  const BaseUrl = process.env.REACT_APP_URL;
  const { login } = useAuth();

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      let errors = {};

      if (!values.email) {
        errors.email = "Please Enter Email";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }
      if (!values.password) {
        errors.password = "Please Enter Password";
      } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }

      return errors;
    },

    onSubmit: (data) => {
      // console.log(data);
      apiCall(data);
    },
  });

  function apiCall(data) {
    axios
      .post(`${BaseUrl}/user/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          if (res.data && res.data.hasOwnProperty("token")) {
            login(() => {
              localStorage.setItem(
                "userInfo",
                JSON.stringify({
                  loginInf: res.data,
                  tokenInfo: res.data.token,
                })
              );
              navigate("/home");
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${require("../../assests/loginbg.jpg")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter your email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            ) : null}
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter your password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
            <div>
              <span className="pe-2"> Don't have an account?</span>
              <Link
                to="/register"
                className="inline-block align-baseline font-bold  text-md text-blue-500 hover:text-blue-800"
              >
                Sign up
              </Link>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <span className="text-gray-500 text-sm">or</span>
          </div>

          <div className="mt-4">
            <button
              type="button"
              className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring focus:border-blue-300"
              onClick={() => alert("Google Login Clicked!")}
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google Logo"
                className="w-5 h-5 mr-2"
              />
              Continue with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
