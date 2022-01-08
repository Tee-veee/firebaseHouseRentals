// LIB
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// FIRESTORE
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase.config";
// TOAST
import { toast } from "react-toastify";
// COMP
import Loading from "../components/Loading";
import ListingItem from "../components/ListingItem";

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "listings");

        // QUERY LISTINGS REF
        const que = query(
          listingsRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc")
        );

        // QUERY SNAP
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
      } catch (error) {
        toast.error("Could not fetch listings");
      }
    };
    fetchListings();
  }, [params.categoryName]);

  return (
    <div className="min-h-screen bg-blue-300 md:p-8 p-4">
      <header>
        <p className="text-3xl">
          {params.categoryName === "rent"
            ? "Places for Rent"
            : "Places for Sale"}
        </p>
      </header>

      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-blue-300 md:p-8 p-4">
          <Loading />
        </div>
      ) : listings && listings.length > 0 ? (
        // CSS FOR CATEGORY LIST
        <main className="w-full h-fit mt-2">
          <ul className="mb-12 ">
            {listings.map((listing) => {
              return (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              );
            })}
          </ul>
        </main>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
}

export default Category;
