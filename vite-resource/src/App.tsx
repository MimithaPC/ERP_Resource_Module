import Items from "./Pages/Items";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import Units from "./Pages/Units";
import UnitConversions from "./Pages/UnitConversions";
import PriceLists from "./Pages/PriceLists";
import ItemPrices from "./Pages/ItemPrices";
import Home from "./Pages/Home";
import SideBar from "./Components/SideBar";
import NaveBar from "./Components/NavBar";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";
import Login from "./Pages/Login";
import Footer from "./Components/Footer";
import Features from "./Pages/Features";
import Report from "./Pages/Report";
import Reviews from "./Pages/Reviews";
import Projects from "./Pages/Projects";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

 const handleLogin = (email: string, password: string) => {
  const validCredentials = [
    { email: "mimitha@gmail.com", password: "mimi@123" },
    { email: "hashitha@gmail.com", password: "hashi@123" },
    { email: "chandarathna@gmail.com", password: "chan@123" },
  ];

  const isValid = validCredentials.some(
    (cred) => cred.email === email && cred.password === password
  );

  if (isValid) {
    setIsLoggedIn(true);
  } else {
    alert("Invalid email or password.");
  }
};

  return (

    <div className="bg-gray-100">
        <Router>
        <div className="flex flex-col min-h-screen">
            <NaveBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <div className="flex flex-1">
            {isLoggedIn && <SideBar />}
            <div className="flex-1 p-4">
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/features" element={<Features />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/projects" element={<Projects />} />
                <Route
                    path="/login"
                    element={<Login onLogin={handleLogin} />}
                />

                {isLoggedIn ? (
                    <>
                    <Route path="/items" element={<Items />} />
                    <Route path="/units" element={<Units />} />
                    <Route path="/unit-conversions" element={<UnitConversions />} />
                    <Route path="/price-lists" element={<PriceLists />} />
                    <Route path="/item-prices" element={<ItemPrices />} />
                    <Route path="/report" element={<Report />} />
                    </>
                ) : (
                    <Route path="*" element={<Navigate to="/login" replace />} />
                )}
                </Routes>
            </div>
            </div>
            <footer className="bg-gray-800 text-white text-center py-4">
            <Footer/>
            </footer>
        </div>
        </Router>
    </div>
  );
}

export default App;
