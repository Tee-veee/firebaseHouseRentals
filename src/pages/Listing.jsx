// LIB
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BsFillShareFill,
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
} from "react-icons/bs";
import { FaBed, FaShower } from "react-icons/fa";
import { AiFillCar, AiOutlineMail } from "react-icons/ai";
// FIREBASE
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
// FIRESTORE
import { getDoc, doc, collection } from "firebase/firestore";
// TOAST
import { toast } from "react-toastify";
// REACT LEAFLET
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
// COMP
import Loading from "../components/Loading";
function Listing() {
  const [url, setUrl] = useState("");
  const [currIndex, setCurrIndex] = useState(0);
  const [imgUrlLen, setImgUrlLen] = useState("");
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

  useEffect(() => {
    const getUrl = async () => {
      setUrl(listing?.imageUrls[currIndex]);
      setImgUrlLen(listing?.imageUrls.length);
    };
    getUrl();
  }, [listing]);

  const copyLink = () => {
    // COPIES URL TO CLIPBOARD
    navigator.clipboard.writeText(window.location.href);
    toast.success("Copied Link");
  };

  const setIndex = (dir) => {
    switch (dir) {
      case "left":
        if (currIndex === 0) {
          setCurrIndex(listing.imageUrls.length - 1);
          setUrl(listing?.imageUrls[currIndex]);
          return;
        } else {
          setCurrIndex(currIndex - 1);
          setUrl(listing?.imageUrls[currIndex]);
          return;
        }
      case "right":
        if (currIndex === listing.imageUrls.length - 1) {
          setCurrIndex(0);
          setUrl(listing?.imageUrls[currIndex]);
          return;
        } else {
          setCurrIndex(currIndex + 1);
          setUrl(listing?.imageUrls[currIndex]);
          return;
        }
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
    <div className="relative min-h-screen bg-blue-300">
      {/* NOTES -- HERO */}
      <div
        className="relative h-[40vh] mb-4"
        style={{
          backgroundImage: `url(${url})`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
        }}
      >
        {imgUrlLen > 1 && (
          <>
            <div
              className="absolute top-20 left-12"
              onClick={() => setIndex("left")}
            >
              <BsFillArrowLeftCircleFill
                fill="white"
                className=" bg-black rounded-full text-4xl"
              />
            </div>
            <div
              className="absolute top-20 right-12"
              onClick={() => setIndex("right")}
            >
              <BsFillArrowRightCircleFill
                fill="white"
                className="bg-black rounded-full text-4xl"
              />
            </div>
          </>
        )}
      </div>
      <div className="p-4 flex flex-col bg-white w-full">
        <div className="p-2">
          <div className="flex w-full justify-between">
            <h1 className="text-3xl">{listing.name}</h1>
            <div className="p-2 bg-black h-fit text-white rounded-lg">
              <p className="text-sm md:text-xl">
                {listing.type === "rent" ? "Rent" : "Sale"}
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between mt-4">
            <h1 className="text-xl">{listing.location}</h1>
            <div className="p-2 h-fit bg-green-300 rounded-lg ">
              <p className="text-sm md:text-xl">
                $
                {listing.offer ? listing.discountedPrice : listing.regularPrice}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex items-center mr-2  ">
              <FaBed className="text-2xl pr-1" />
              <h4>{listing.bedrooms}</h4>
            </div>
            <div className="flex items-center mr-2">
              <FaShower className="text-2xl pr-1" />
              <h4>{listing.bathrooms}</h4>
            </div>
            {listing.parking && (
              <div className="flex items-center mr-2">
                <AiFillCar className="text-xl" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAP */}
      <div className="mb-12 pb-4 mt-4 px-4  w-full h-[170px] md:h-[250px] ">
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          center={[listing.geolocation.lat, listing.geolocation.lng]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
          />

          <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
            <Popup>{listing.location}</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* NOTES -- CONTACT OWNER */}
      {auth.currentUser?.uid !== listing.userRef && (
        <Link
          to={`/contact/${listing.userRef}?listingName=${listing.name}&listingLocation=${listing.location}`}
        >
          <div className="absolute top-20 right-4 bg-white p-3 shadow-lg hover:scale-[0.96] hover:transition-all">
            <AiOutlineMail className="cursor-pointer " />
          </div>
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
