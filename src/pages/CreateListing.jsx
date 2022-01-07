// LIB
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// FIREBASE
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase.config";
// FIREBASE STORAGE
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
// FIRESTORE
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// UUID
import { v4 as uuidv4 } from "uuid";
// TOAST
import { toast } from "react-toastify";
// COMP
import Loading from "../components/Loading";

const geoCodingApi = process.env.REACT_APP_GEOCODING_API;

function CreateListing() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: "",
    bathrooms: "",
    parking: true,
    furnished: false,
    address: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
          console.log(user);
        } else {
          navigate("/sign-in");
        }
      });
    }

    return () => (isMounted.current = false);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onMutate = (e) => {
    let bool = null;

    // CHECK IF (e) IS OF TYPE BOOL
    if (e.target.value === "true") {
      bool = true;
    }
    if (e.target.value === "false") {
      bool = false;
    }

    // CHECK IF (e) IS OF TYPE FILE
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: bool ?? e.target.value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (images.length > 6) {
      setLoading(false);
      toast.error("Max 6 images");
      return;
    }

    let geolocation = {};
    let location;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${geoCodingApi}`
    );

    const data = await response.json();

    geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
    geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

    location =
      data.status === "ZERO_RESULTS"
        ? undefined
        : data.results[0]?.formatted_address;

    if (location === undefined || location.includes("undefined")) {
      setLoading(false);
      toast.error("Please enter a correct address");
      return;
    }

    // STORE IMAGE FROM FIREBASE
    const storeImage = async (image) => {
      // RETURN PROMISE
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        // REFRENCE TO STORAGE
        const storageRef = ref(storage, "images/" + fileName);

        // UPLOAD TAKES STORAGEREF AS PARAM AND THE FILE -- IN THIS CASE THE IMAGE
        const uploadTask = uploadBytesResumable(storageRef, image);

        // UPLOAD TASK TRACKS STATE CHANGE
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // UNUSED VAR FOR UI, TO SHOW ON A PROGRESS BAR
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            // CONTROLS STATE CHANGE
            switch (snapshot.state) {
              case "paused":
                break;
              case "running":
                break;
              default:
                break;
            }
          },
          (error) => {
            // PROMISE REJECT
            reject(error);
          },
          () => {
            // UPLOADS AND RETURNS DOWNLOAD URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              // PROMISE RESOLVE RETURNS LINK TO URL IN STORAGE
              resolve(downloadURL);
            });
          }
        );
      });
    };

    // LOOP OVER ALL IMAGES AND RUN ASYNC STORE IMAGE FUNCTION
    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      console.log(error);
      setLoading(false);
      toast.error("Problem with 1 or more images");
      return;
    });

    // CREATE COPY OF FORM DATA ADDING DATA WE JUST EXTRACTED + TIMESTAMP
    const formDataCopy = {
      ...formData,
      imageUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    // DELETE UNUSED FORM DATA && ADD LOCATION
    formDataCopy.location = address;
    delete formDataCopy.images;
    delete formDataCopy.address;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    // ADD TO DOCUMENT, COLLECTION, DB, COLLECTION-NAME, DATA TO BED ADDED.
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing created");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center bg-blue-300 md:p-8 p-4">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 bg-blue-300 md:p-8 p-4">
      <header>
        <p className="text-3xl mb-4">Create Listing</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className="mb-1">Sell / Rent</label>
          {/* NOTES -- BUTTONS */}
          <div className="flex">
            <button
              type="button"
              className={`w-full p-2 rounded-lg hover:scale-[0.98] hover:transition-all ${
                type === "sale" ? "bg-green-300" : "bg-white"
              } mr-1`}
              id="type"
              value="sale"
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              type="button"
              className={`w-full p-2 rounded-lg hover:scale-[0.98] hover:transition-all ${
                type === "rent" ? "bg-green-300" : "bg-white"
              } ml-1`}
              id="type"
              value="rent"
              onClick={onMutate}
            >
              Rent
            </button>
          </div>
          {/* NOTES -- PROPERTY NAME */}
          <div className="flex flex-col mt-4">
            <label htmlFor="">Property Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={onMutate}
              className="w-full mb-4 mt-1 text-xl rounded-lg h-[40px] pl-4 outline-none border-none focus:shadow-lg focus:transition-all"
              placeholder="Property Name"
              required
            />
          </div>
          {/* NOTES -- ADDRESS */}
          <div className="flex flex-col">
            <label htmlFor="">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={onMutate}
              className="w-full mb-4 mt-1 text-xl rounded-lg h-[40px] pl-4 outline-none border-none focus:shadow-lg focus:transition-all"
              placeholder="Address"
              required
            />
          </div>
          {/* NOTES -- BED && BATH */}
          <div className="flex w-full  mr-4">
            <div className="flex flex-col pr-4 w-3/12">
              <label htmlFor="">Bedrooms</label>
              <input
                type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={onMutate}
                min="1"
                max="25"
                className="w-full mb-4 mt-1 text-xl rounded-lg h-[40px] pl-4 outline-none border-none focus:shadow-lg focus:transition-all"
                required
              />
            </div>
            <div className="flex flex-col w-3/12 pl-4">
              <label htmlFor="">Bathrooms</label>
              <input
                type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={onMutate}
                min="1"
                max="25"
                className="w-full mb-4 mt-1 text-xl rounded-lg h-[40px] pl-4 outline-none border-none focus:shadow-lg focus:transition-all"
                required
              />
            </div>
          </div>
          {/* NOTES -- PARKING */}
          <div className="flex w-full  mr-4">
            <div className="flex flex-col w-full">
              <label htmlFor="">Parking</label>
              <div className="flex">
                <button
                  className={`w-full p-2 mt-1 rounded-lg hover:scale-[0.98] hover:transition-all ${
                    parking ? "bg-green-300" : "bg-white"
                  } mr-1`}
                  type="button"
                  id="parking"
                  value={true}
                  onClick={onMutate}
                >
                  Yes
                </button>
                <button
                  className={`w-full p-2 mt-1 rounded-lg hover:scale-[0.98] hover:transition-all ${
                    !parking ? "bg-green-300" : "bg-white"
                  } ml-1`}
                  type="button"
                  id="parking"
                  value={false}
                  onClick={onMutate}
                >
                  No
                </button>
              </div>
            </div>
          </div>
          {/* NOTES -- FURNISHED */}
          <div className="flex w-full mt-4 mr-4">
            <div className="flex flex-col w-full">
              <label htmlFor="">Furnished</label>
              <div className="flex">
                <button
                  className={`w-full p-2 mt-1 rounded-lg hover:scale-[0.98] hover:transition-all ${
                    furnished ? "bg-green-300" : "bg-white"
                  } mr-1`}
                  type="button"
                  id="furnished"
                  value={true}
                  onClick={onMutate}
                >
                  Yes
                </button>
                <button
                  className={`w-full p-2 mt-1 rounded-lg hover:scale-[0.98] hover:transition-all ${
                    !furnished ? "bg-green-300" : "bg-white"
                  } ml-1`}
                  type="button"
                  id="furnished"
                  value={false}
                  onClick={onMutate}
                >
                  No
                </button>
              </div>
            </div>
          </div>
          {/* NOTES -- OFFER */}
          <div className="flex w-full mt-4 mr-4">
            <div className="flex flex-col w-full">
              <label htmlFor="">Offer</label>
              <div className="flex">
                <button
                  className={`w-full p-2 mt-1 rounded-lg hover:scale-[0.98] hover:transition-all ${
                    offer ? "bg-green-300" : "bg-white"
                  } mr-1`}
                  type="button"
                  id="offer"
                  value={true}
                  onClick={onMutate}
                >
                  Yes
                </button>
                <button
                  className={`w-full p-2 mt-1 rounded-lg hover:scale-[0.98] hover:transition-all ${
                    !offer ? "bg-green-300" : "bg-white"
                  } ml-1`}
                  type="button"
                  id="offer"
                  value={false}
                  onClick={onMutate}
                >
                  No
                </button>
              </div>
            </div>
          </div>
          {!offer && (
            // {/* NOTES -- PRICE -- NOT OFFER */}
            <div className="flex w-full mt-4">
              <div className="flex flex-col w-6/12">
                <label htmlFor="">Price</label>
                <input
                  type="number"
                  id="regularPrice"
                  value={regularPrice}
                  onChange={onMutate}
                  min="1"
                  max="99999999999"
                  className="w-full mb-4 mt-1 text-xl rounded-lg h-[40px] pl-4 outline-none border-none focus:shadow-lg focus:transition-all"
                  required
                />
              </div>
              {formData.type === "rent" && (
                <div className="flex items-center justify-center ml-2">
                  <p className="text-xl mt-2">$/Month</p>
                </div>
              )}
            </div>
          )}
          {offer && (
            // {/* NOTES -- PRICE -- OFFER */}
            <div className="flex w-full mt-4">
              <div className="flex flex-col w-6/12">
                <label htmlFor="">Offer Price</label>
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onMutate}
                  min="1"
                  max="99999999999"
                  className="w-full mb-4 mt-1 text-xl rounded-lg h-[40px] pl-4 outline-none border-none focus:shadow-lg focus:transition-all"
                  required
                />
              </div>
              {formData.type === "rent" && (
                <div className="flex items-center justify-center ml-2">
                  <p className="text-xl mt-2">$/Month</p>
                </div>
              )}
            </div>
          )}
          {/* NOTES -- IMAGES */}
          <div className="flex w-full ">
            <div className="flex flex-col w-full">
              <label htmlFor="">Upload Images</label>
              <p className="text-sm mb-1">
                The first image will be the cover photo (max 6)
              </p>
              <div className="flex">
                <input
                  className={`w-full p-2 mt-1 rounded-lg bg-green-300 hover:scale-[0.98] hover:transition-all`}
                  type="file"
                  id="images"
                  max="6"
                  accept=".jpg,.png,.jpeg"
                  multiple
                  required
                  onChange={onMutate}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-8 md:mt-20 mb-2">
            <button
              className="text-2xl w-10/12  p-2 bg-green-300 rounded-lg hover:scale-[0.98] hover:transition-all"
              type="submit"
            >
              Confirm Listing
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateListing;
