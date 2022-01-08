// LIB
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";

// COMP
import ListingItem from "../components/ListingItem";
import Loading from "../components/Loading";
// FIREBASE
import { getAuth, updateProfile } from "firebase/auth";
import { db } from "../firebase.config";
// FIRESTORE
import {
  updateDoc,
  doc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
// TOAST
import { toast } from "react-toastify";

function UserProfile() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");

      // NOTES -- QUERY FOR DB
      const que = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(que);

      const listings = [];

      querySnapshot.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };
    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onLogout = () => {
    // SIGNS OUT USER FROM FIREBASE
    auth.signOut();

    navigate("/");
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

  const onDelete = async (listingID) => {
    if (window.confirm("Are you sure you want to delete")) {
      await deleteDoc(doc(db, "listings", listingID));
      const updatedList = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedList);
      toast.success("Succesfully deleted listing");
      navigate("/profile");
      return;
    }
  };

  const onEdit = (listingID) => {
    if (window.confirm("Edit this listing")) {
      navigate(`/edit-listing/${listingID}`);
    }
  };

  if (loading) {
    return (
      <div className="h-fit min-h-screen flex items-center justify-center bg-blue-300 md:p-8 p-4">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-4 h-fit bg-blue-300 md:p-8">
      <header className="flex justify-between">
        <h1 className="text-3xl">My Profile</h1>
        <button
          className=" w-4/12 p-2 bg-green-300 rounded-lg hover:scale-[0.98] hover:transition-all"
          onClick={onLogout}
        >
          Logout
        </button>
      </header>

      <main>
        <div className="mt-2 ">
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
      <div className="mt-4">
        <h1 className="text-xl">Join The Marketplace</h1>
        <Link to="/create-listing">
          <button className="flex items-center justify-center mt-2 p-2 bg-green-300 w-full rounded-lg hover:scale-[0.98] hover:transition-all">
            <AiFillHome className="text-3xl mr-2" />
            <h1>List your home on our marketplace</h1>
          </button>
        </Link>
      </div>

      {!loading && listings?.length > 0 && (
        <div className="mt-4 pb-16">
          <h1 className="text-xl mb-2 ">Your Listings</h1>
          <ul>
            {listings.map((listing) => {
              return (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
