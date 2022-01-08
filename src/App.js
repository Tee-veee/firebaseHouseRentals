import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// TOASTIFY
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// PAGES
import ExploreListings from "./pages/ExploreListings";
import OfferListings from "./pages/OfferListings";
import UserProfile from "./pages/UserProfile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Category from "./pages/Category";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
// COMP
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <main className="relative min-h-screen h-fit font-defaultFont  overflow-x-hidden">
        <Router>
          <Routes>
            <Route path="/" element={<ExploreListings />} />
            <Route path="/offers" element={<OfferListings />} />
            <Route path="/category/:categoryName" element={<Category />} />
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="/profile" element={<UserProfile />} />
            </Route>
            <Route path="/create-listing" element={<CreateListing />} />
            <Route
              path="/category/:categoryName/:listingID"
              element={<Listing />}
            />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/contact/:ownerID" element={<Contact />} />
            <Route path="/edit-listing/:listingID" element={<EditListing />} />
          </Routes>
          <Navbar />
        </Router>
        <ToastContainer autoClose={2000} position="bottom-right" />
      </main>
    </>
  );
}

export default App;
