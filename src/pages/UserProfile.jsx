// LIB
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
// FIREBASE
import { getAuth, updateProfile } from "firebase/auth";
import { db } from "../firebase.config";
// FIRESTORE
import { updateDoc, doc } from "firebase/firestore";
// TOAST
import { toast } from "react-toastify";

function UserProfile() {
  const auth = getAuth();
  const navigate = useNavigate();

  // WHEN TRUE ALLOWS EDITING OF FORM DATA
  const [changeDetails, setChangeDetails] = useState(false);
  // STORE USER DATA IN FORM STATE OBJECT
  const [formData, setFormData] = useState({
    username: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { username, email } = formData;

  const onLogout = () => {
    // SIGNS OUT USER FROM FIREBASE
    auth.signOut();
    // NAV HOME
    navigate("/");
    // SHOW SUCCESS MODAL
    toast.success("Logged out succesfully");
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== username) {
        await updateProfile(auth.currentUser, {
          displayName: username,
        });

        const userRef = doc(db, "users", auth.currentUser.uid);

        await updateDoc(userRef, {
          username,
        });
      }
      toast.success("Changes Confirmed");
    } catch (error) {
      toast.error("Update credentials failed");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      // e.target.id is the id given in the html and allows this function to work on any piece of html
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="relative h-screen bg-blue-300 p-8">
      <header>
        <h1 className="text-3xl">My Profile</h1>
      </header>

      <main>
        <div className="mt-6">
          <p className="mt-2 mb-2 text-xl">Personal Details</p>
          <div className="">
            <form>
              <input
                type="text"
                id="username"
                className="w-full text-xl pl-2 rounded-lg h-[40px] mb-2 outline-none border-none focus:shadow-lg focus:transition-all"
                disabled={!changeDetails}
                value={username}
                onChange={onChange}
              />
              <input
                type="text"
                id="email"
                className="w-full text-xl pl-2 rounded-lg h-[40px]  outline-none border-none focus:shadow-lg focus:transition-all"
                disabled
                value={email}
                onChange={onChange}
              />
            </form>
          </div>
          <button
            className="mt-2 p-2 bg-green-300 w-full rounded-lg hover:scale-[0.98] hover:transition-all"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails(!changeDetails);
            }}
          >
            {changeDetails ? "Confirm Changes" : "Edit Details"}
          </button>
        </div>
      </main>
      <div className="mt-8">
        <h1 className="text-xl">Join The Marketplace</h1>
        <Link to="/create-listing">
          <button className="flex items-center justify-center mt-2 p-2 bg-green-300 w-full rounded-lg hover:scale-[0.98] hover:transition-all">
            <AiFillHome className="text-3xl mr-2" />
            <h1>List your home on our marketplace</h1>
          </button>
        </Link>
      </div>
      <div className="absolute left-0 bottom-16 p-8 w-full">
        <button
          className="mt-12 sm:mt-6 w-full p-2 bg-green-300 rounded-lg hover:scale-[0.98] hover:transition-all"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
