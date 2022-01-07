// LIB
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
// FIREBASE
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// TOASTIFY
import { toast } from "react-toastify";
// COMP
import OAuth from "./OAuth";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredentials.user) {
        navigate("/");
      }
    } catch (error) {
      toast.error("User Credentials not recognised");
    }
  };

  return (
    // PAGE CONTAINER
    <div className="h-screen bg-blue-300 md:p-8 p-4">
      <header>
        <p className="text-3xl">Welcome Back!</p>
      </header>

      {/* NOTES -- FORM DIV */}
      <form className="w-full flex flex-col">
        {/* NOTES -- EMAIL */}
        <div className="relative flex items-center mt-4 ">
          <input
            type="email"
            placeholder="E-mail"
            onChange={handleChange}
            className="w-full mb-4 text-xl rounded-lg h-[40px] pl-12 outline-none border-none focus:shadow-lg focus:transition-all"
            id="email"
            value={email}
          />
          <AiOutlineMail className="absolute top-1 left-0 pl-1 rounded-lg left-0 h-[30px] w-[30px]" />
        </div>
        {/* NOTES -- PASSWORD */}
        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full text-xl rounded-lg h-[40px] pl-12 pr-10 outline-none border-none focus:shadow-lg focus:transition-all"
            id="password"
            value={password}
            onChange={handleChange}
          />
          <AiOutlineLock className="absolute top-1 left-2 rounded-lg left-0 h-[30px] w-[30px]" />
          <div
            className="absolute right-1 text-2xl pr-1 pb-1"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
          </div>
        </div>
        {/* NOTES -- INFO LINKS */}
        <div className="flex justify-between">
          <Link to="/sign-up" className=" mt-2">
            Create Account!
          </Link>
          <Link to="/forgot-password" className=" mt-2">
            Forgotten Password?
          </Link>
        </div>

        {/* NOTES -- SUBMIT BUTTON */}
        <button
          className="mt-12 sm:mt-6 p-2 bg-green-300 rounded-lg hover:scale-[0.98] hover:transition-all"
          onClick={onSubmit}
        >
          Sign in
        </button>
        {/* NOTES -- GOOGLE OAUTH */}
        <OAuth />
      </form>
    </div>
  );
}

export default SignIn;
