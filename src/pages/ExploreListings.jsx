// LIB
import { Link } from "react-router-dom";
// ASSETS
import rentalHouse from "../assets/images/rentalHouse.jpg";
import purchaseHouse from "../assets/images/purchaseHouse.jpg";
function ExploreListings() {
  return (
    <div className="h-screen md:p-8 p-4 bg-blue-300">
      <header className="mb-4">
        <p className="text-xl md:text-2xl lg:text-3xl">
          Welcome to realEstate MarketPlace
        </p>
      </header>

      <div className="h-[84vh]">
        <div className="flex flex-col xl:h-[84vh]  xl:flex-row">
          <div className="xl:w-6/12 xl:h-[72vh]">
            <h1 className="text-xl xl:text-2xl mt-4 xl:mt-8 text-2xl mb-2 xl:mb-6 w-fit p-1 xl:p-2">
              Purhcase your forever home!
            </h1>
            <Link to="/category/sale">
              <img
                src={purchaseHouse}
                alt="Search To Buy"
                className="h-[33vh] md:h-[35vh] w-full object-cover h-[30vh]
              xl:h-full xl:w-full xl:pr-4  opacity-80 hover:opacity-100 hover:scale-[0.97] hover:transition-all cursor-pointer"
              />
            </Link>
          </div>
          <div className="xl:w-6/12 xl:h-[72vh]">
            <h1 className="text-xl xl:text-2xl mt-4 xl:mt-8 text-2xl mb-2 xl:mb-6 w-fit xl:ml-4 p-1 xl:p-2">
              Find your dream rental
            </h1>
            <Link to="/category/rent">
              <img
                src={rentalHouse}
                alt="Search Rentals"
                className="h-[33vh] md:h-[35vh] w-full object-cover h-[30vh]
              xl:h-full xl:w-full xl:pl-4 opacity-80 hover:opacity-100 hover:scale-[0.97] hover:transition-all cursor-pointer"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExploreListings;
