// LIB
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
// FIREBASE
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
// TOAST
import { toast } from "react-toastify";

function Contact() {
  const [message, setMessage] = useState("");
  const [owner, setOwner] = useState("");

  // NOTES -- USE SEARCH PARAMS GIVES ME ACCESS TOO ANY SEARCH QUERIES
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  const handleChange = (e) => {};

  useEffect(() => {
    const getOwner = async () => {
      const docRef = doc(db, "users", params.ownerID);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        setOwner(docSnapshot.data());
      } else {
        toast.error("Could not get owner credentials");
      }
    };

    getOwner();
    console.log(owner);
  }, [params.ownerID]);

  return (
    <div className="h-screen md:p-8 p-4 bg-blue-300">
      <header className="mb-4">
        <p className="text-xl md:text-2xl lg:text-3xl">
          Contact -{" "}
          <span className="text-lg md:text-xl lg:text-2xl">
            {owner.username}
          </span>
        </p>
      </header>

      {owner !== null && (
        <form>
          <div className="flex flex-col">
            <label className="mb-2">Message</label>
            <textarea
              name="message"
              id="message"
              cols="10"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="outline-none border-none focus:shadow-lg hover:transition-all p-2"
            ></textarea>
          </div>

          <div className="flex items-center justify-center mt-4 w-full">
            <a
              href={`mailto:${owner.email}?Subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
              className="w-full"
            >
              <button
                type="button"
                className="w-full p-2 bg-green-300 rounded-lg hover:scale-[0.98] hover:transition-all"
              >
                Send Message
              </button>
            </a>
          </div>
        </form>
      )}
    </div>
  );
}

export default Contact;
