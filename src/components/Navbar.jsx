import { useNavigate, useLocation } from "react-router-dom";
import { MdOutlineExplore, MdOutlineLocalOffer } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // CHECKS IF THE ROUTE (PARAM) is === TO THE CURR LOCATION.PATHNAME
  const currPageMatch = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <nav className=" flex items-center bg-gray-300 absolute bottom-0">
      <ul className="flex py-1 items-center w-screen justify-around">
        <li
          className="flex flex-col items-center"
          onClick={() => navigate("/")}
        >
          <MdOutlineExplore
            fill={currPageMatch("/") ? "cornflowerblue" : "black"}
            className="text-2xl"
          />
          <p>Explore</p>
        </li>
        <li
          onClick={() => navigate("/offers")}
          className="flex flex-col items-center"
        >
          <MdOutlineLocalOffer
            fill={currPageMatch("/offers") ? "cornflowerblue" : "black"}
            className="text-2xl"
          />
          <p>Offers</p>
        </li>
        <li
          onClick={() => navigate("/profile")}
          className="flex flex-col items-center"
        >
          <FaRegUser
            fill={currPageMatch("/profile") ? "cornflowerblue" : "black"}
            className="text-2xl"
          />
          <p>Profile</p>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
