// LIB
import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineMail } from "react-icons/ai";
// FIREBASE
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
// TOAST
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const onChange = (e) => {
    setEmail(e.target.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email was sent");
    } catch (error) {
      toast.error("Error sending Email");
    }
  };

  return (
    <div className="min-h-screen h-fit bg-blue-300 md:p-8 p-4">
      <header>
        <p className="text-3xl">Find your dream home today!</p>
      </header>

      {/* FORM DIV */}
      <form className="w-full h-full pb-4 flex flex-col ">
        {/* EMAIL */}
        <div className="relative flex items-center mt-4 ">
          <input
            type="email"
            placeholder="E-mail"
            onChange={onChange}
            className="w-full text-xl rounded-lg h-[40px] pl-12 outline-none border-none focus:shadow-lg focus:transition-all"
            id="email"
            value={email}
          />
          <AiOutlineMail className="absolute top-1 left-0 pl-1 rounded-lg left-0 h-[30px] w-[30px]" />
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
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
