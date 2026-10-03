import React, { useState } from "react";
import assets from "../assets/assets";
const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if( currState === "Sign up" && !isDataSubmitted){
      setIsDataSubmitted(true);
      return ;
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl ">
      {/* Left side */}
      <div className="flex flex-col items-center justify-center gap-3">
        <img
          src={assets.logo_icon}
          alt="MivChat"
          className="w-33 sm:w-44 md:w-50 aspect-square object-contain drop-shadow-2xl"
        />
        <h1 className="text-5xl sm:text-6xl font-bold tracking-wide text-white">
          Miv<span className="text-[#936EFF]">Chat</span>
        </h1>
      </div>
      {/* Right side */}
      <form
        onSubmit={handleSubmit}
        className="border border-gray-600/60 bg-[#282142]/60 text-white p-8 flex flex-col gap-5 rounded-2xl shadow-2xl backdrop-blur-xl w-full max-w-md"
      >
        <h2 className="font-semibold text-2xl flex justify-between items-center text-white">
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer opacity-100 hover:opacity-100 transition-opacity"
            />
          )}
        </h2>
        {currState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setUserName(e.target.value)}
            type="text"
            placeholder="Username"
            required
            className="bg-gray-800/50 border border-gray-500 rounded-lg p-2 text-sm text-white placeholder-gray-400 outline-none focus:border-violet-500 transition-colors"
          />
        )}
        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              required
              className="bg-gray-800/50 border border-gray-500 rounded-lg p-2 text-sm text-white placeholder-gray-400 outline-none focus:border-violet-500 transition-colors"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
              className="bg-gray-800/50 border border-gray-500 rounded-lg p-2 text-sm text-white placeholder-gray-400 outline-none focus:border-violet-500 transition-colors"
            />
          </>
        )}
        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            row={4}
            placeholder="Provide a short bio..."
            required
            className="bg-gray-800/50 border border-gray-500 rounded-lg p-2 text-sm text-white placeholder-gray-400 outline-none focus:border-violet-500 transition-colors focus-ring-2"
          />
        )}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-400 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white py-3 rounded-lg text-sm font-medium shadow-md transition-all cursor-pointer mt-2"
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms" className="text-sm text-gray-300">
            Agree to the terms of use & privacy policy
          </label>
        </div>
        <div className="flex flex-col gap-2 ">
          {currState === "Sign up" ? (
            <p className="text-sm text-gray-300">
              Already have an account?{" "}
              <span
                onClick={() => setCurrState("Login")}
                className="text-violet-500 hover:underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-300">
              Create an account{" "}
              <span
                onClick={() => setCurrState("Sign up")}
                className="text-violet-500 hover:underline cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
export default LoginPage;
