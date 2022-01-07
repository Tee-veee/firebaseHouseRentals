// LIB
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsFillShareFill } from "react-icons/bs";
import { FaBed, FaShower } from "react-icons/fa";
import { AiFillCar } from "react-icons/ai";
// FIREBASE
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
// FIRESTORE
import { getDoc, doc, collection } from "firebase/firestore";
// TOAST
import { toast } from "react-toastify";
// COMP
import Loading from "../components/Loading";
function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      // GET REFERENCE TO DOC
      const docRef = doc(db, "listings", params.listingID);
      // GET DOC SNAPSHOT
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        setListing(docSnapshot.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingID]);

  const copyLink = () => {
    // COPIES URL TO CLIPBOARD
    navigator.clipboard.writeText(window.location.href);
    toast.success("Copied Link");
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center bg-blue-300 md:p-8 p-4">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-blue-300 md:p-8 p-4">
      <div className="flex flex-col w-full bg-red-300">
        <div className="p-2 bg-green-300">
          <h1>{listing.name}</h1>
          <h1>{listing.location}</h1>
          <div className="flex w-full justify-between">
            <p>For {listing.type === "rent" ? "Rent" : "Sale"}</p>
            <p>
              ${listing.offer ? listing.discountedPrice : listing.regularPrice}
            </p>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <FaBed className="text-2xl pr-1" />
              <h4>{listing.bedrooms}</h4>
            </div>
            <div className="flex items-center mb-2">
              <FaShower className="text-2xl pr-1" />
              <h4>{listing.bathrooms}</h4>
            </div>
            {listing.parking && (
              <div className="flex items-center mb-2">
                <AiFillCar className="text-xl" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <p>LOCATION</p>
      </div>

      {/* MAP */}

      {/* CONTACT OWNER */}

      {auth.currentUser?.uid !== listing.userRef && (
        <Link
          to={`/contact/${listing.userRef}?listingName=${listing.name}&listingLocation=${listing.location}`}
        >
          Contact Owner
        </Link>
      )}
      {/* NOTES -- SHARE LINK */}
      <div
        className="absolute top-4 right-4 bg-white p-3 shadow-lg hover:scale-[0.96] hover:transition-all"
        onClick={copyLink}
      >
        <BsFillShareFill className="cursor-pointer " />
      </div>
    </div>
  );
}

export default Listing;
