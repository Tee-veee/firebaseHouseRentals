import { Link } from "react-router-dom";
import { FaBed, FaShower } from "react-icons/fa";
import { AiFillCar } from "react-icons/ai";

function ListingItem({ listing, id }) {
  return (
    <li>
      <Link to={`/category/${listing.type}/${id}`}>
        <div className="flex p-1 mb-2 bg-white hover:shadow-xl rounded-lg">
          <img
            src={listing.imageUrls[0]}
            alt={listing.name}
            className=" w-[200px] h-[180px] rounded-xl mr-2"
          />
          <div className="flex flex-col justify-between w-[300px] ">
            <div className="">
              <h1 className="mb-1 text-md md:text-xl">{listing.name}</h1>
              <h4 className="text-sm">{listing.location}</h4>
            </div>
            <h3 className="p-1 bg-green-300 w-fit rounded-full text-sm shadow-lg">
              {listing.offer === true
                ? "$" + listing.discountedPrice
                : "$" + listing.regularPrice}
            </h3>
            <div className="flex justify-between">
              <div className="flex items-center">
                <FaBed className="text-2xl pr-1" />
                <h4>{listing.bedrooms}</h4>
              </div>
              <div className="flex items-center">
                <FaShower className="text-2xl pr-1" />
                <h4>{listing.bathrooms}</h4>
              </div>
              {listing.parking && (
                <div className="flex items-center">
                  <AiFillCar className="text-xl" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default ListingItem;
