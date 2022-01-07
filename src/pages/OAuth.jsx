// LIB
import { useLocation, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
// FIREBASE
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { db } from "../firebase.config";
// FIRESTORE
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
// TOAST
import { toast } from "react-toastify";

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async (e) => {
    e.preventDefault();
    try {
      // NOTES -- AUTH USER FROM GOOGLE
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      // TAKES AUTH AND PROVIDER AS PARAMS, COULD BE GITHUB PROVIDER, FB PROVIDER, IG PROVIDER ETC.
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log(user);

      // CHECK DB FOR USER
      // NOTES -- DOCREF PARAMS === database being used, collection to look at, then checking for user.uid
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // IF USER DOESNT EXIST IN DB, CREATE USER
      if (!docSnap.exists()) {
        // NOTES -- SETDOC PARAMS === FIRST GROUP -- database being used, collection to pass data into, unique ID. SECOND GROUP -- DATA BEING ADDED TO DATABASE
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Couldn't authenitcate Google details");
    }
  };

  return (
    <div className="w-full flex mt-12 flex-col items-center justify-center">
      <h1 className="text-2xl">
        Sign {location.pathname === "/sign-up" ? "up" : "in"} with Google
      </h1>
      <button className="p-2" onClick={onGoogleClick}>
        <FcGoogle className="mt-2 p-2 h-[60px] w-[60px] bg-white rounded-full shadow-lg hover:scale-[.96]  hover:transition-all hover:shadow-xl" />
      </button>
    </div>
  );
}

export default OAuth;
