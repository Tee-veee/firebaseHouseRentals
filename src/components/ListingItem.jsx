import { Link } from "react-router-dom";
import { FaBed, FaShower } from "react-icons/fa";
import { AiFillCar } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";

function ListingItem({ listing, id, onDelete, onEdit }) {
  return (
    <li>
      <Link to={`/category/${listing.type}/${id}`}>
        <div className="relative flex max-w-fit p-1 mb-2 bg-white hover:shadow-xl rounded-lg">
          <img
            src={listing.imageUrls[0]}
            alt={listing.name}
            className="min-w-[180px] max-w-[180px] min-h-[160px] max-h-[160px] rounded-xl mr-2"
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
      <div className="flex">
        {onEdit && (
          <div
            className="bg-black w-fit text-white mr-1 p-2 h-fit rounded-lg shadow-lg hover:scale-[0.97] hover:transition-all"
            onClick={() => onEdit(listing.id)}
          >
            <button className="flex items-center ">
              <FiEdit2 className="mr-2" /> Edit
            </button>
          </div>
        )}
        {onDelete && (
          <div
            className="bg-red-500 text-white p-2 h-fit rounded-lg ml-1 shadow-lg hover:scale-[0.97] hover:transition-all"
            onClick={() => onDelete(listing.id)}
          >
            <button className="flex items-center ">
              <MdDelete className="mr-2" /> Delete
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

export default ListingItem;
