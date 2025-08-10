import { Link } from "react-router-dom";
import Logo from '../assets/Logo.png'; 

interface NavBarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const NavBar: React.FC<NavBarProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <nav className="bg-gray-800 font-bold text-blue-300 text-xl p-14 flex justify-between items-center">
      {/* Left section with logo and links */}
      <div className="flex items-center gap-20">
        {/* ✅ Add logo */}
        <img src={Logo} alt="Logo" className="h-20 w-auto" />

        {/* Navigation links */}
        <div className="flex gap-10">
          <Link className="hover:underline ml-15" to="/">Home</Link>
          <Link className="hover:underline ml-15" to="/about">About Us</Link>
          <Link className="hover:underline ml-15" to="/contact">Contact Us</Link>
          <Link className="hover:underline ml-15" to="/features">Features</Link>
          <Link className="hover:underline ml-15" to="/reviews">Reviews</Link>
           <Link className="hover:underline ml-15" to="/projects">Projects</Link>
        </div>
      </div>

      {/* Right section: Login/Logout */}
      <div>
        {isLoggedIn ? (
          <button onClick={() => setIsLoggedIn(false)} className="bg-red-500 text-red-950 px-4 py-2 rounded-full">
            Logout
          </button>
        ) : (
          <Link to="/login" className="bg-green-500 text-green-950 px-4 py-2 rounded-full">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
