// LIB
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase.config";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { AiOutlineMail, AiOutlineLock, AiOutlineUser } from "react-icons/ai";
// FIREBASE LIB
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
// TOAST
import { toast } from "react-toastify";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// COMP
import OAuth from "./OAuth";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { username, email, password } = formData;

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      // e.target.id is the id given in the html and allows this function to work on any piece of html
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      // returns a promise with userCredtentials from form data
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // set new user to userCredentials and call firebase updateProfile on the current user.
      const user = userCredentials.user;
      updateProfile(auth.currentUser, {
        displayName: username,
      });

      // CREATE A COPY OF FORM DATA
      const formDataCopy = { ...formData };
      // REMOVE PW SO ITS NOT UPLOADED TO DB
      delete formDataCopy.password;
      // ADD TIMESTAMP TO <<formDataCopy>> OBJECT
      formDataCopy.timestamp = serverTimestamp();

      // CALL <<setDoc>> FUNCTION FROM FIERBASE, CREATE A NEW DOCUMENT WITH PARAMATERS <<DATABASE, COLLECTION NAME, UID>> AND THEN 2nd PARAM IS DATA BEING PASSED
      await setDoc(doc(db, "users", user.uid), formDataCopy);

      navigate("/");
    } catch (error) {
      toast.error("Error with registration");
    }
  };

  return (
    // PAGE CONTAINER
    <div className="min-h-screen h-fit bg-blue-300 md:p-8 p-4">
      <header>
        <p className="text-3xl">Find your dream home today!</p>
      </header>

      {/* FORM DIV */}
      <form className="w-full h-full pb-4 flex flex-col ">
        {/* USERNAME */}
        <div className="relative flex items-center mt-4 ">
          <input
            type="text"
            placeholder="Username"
            onChange={handleChange}
            className="w-full  text-xl rounded-lg h-[40px] pl-12 outline-none border-none focus:shadow-lg focus:transition-all"
            id="username"
            value={username}
          />
          <AiOutlineUser className="absolute top-1 left-0 pl-1 rounded-lg left-0 h-[30px] w-[30px]" />
        </div>
        {/* EMAIL */}
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
        {/* PASSWORD */}
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
        <div className="flex justify-end">
          <Link to="/sign-in" className=" mt-2">
            Already have an account?
          </Link>
        </div>
        <button
          className="mt-12 sm:mt-4 p-2 bg-green-300 rounded-lg hover:scale-[0.98] hover:transition-all"
          onClick={onSubmit}
        >
          Create Account
        </button>
        {/* NOTES -- GOOGLE OAUTH */}
        <OAuth />
      </form>
    </div>
  );
}

export default SignUp;
