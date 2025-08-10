import { Link } from 'react-router-dom';

function SideBar() {
  return (
    <div>
      <div className="bg-gray-800 w-60 py-5 font-bold text-blue-300 text-xl h-full">

        {/* ✅ Removed the logo */}

        <div className="p-10 hover:underline">
          <h1><Link to="/items">Items</Link></h1>
        </div>

        <div className="p-10 hover:underline">
          <h1><Link to="/units">Units</Link></h1>
        </div>

        <div className="p-10 hover:underline">
          <h1><Link to="/unit-conversions">Unit Conversions</Link></h1>
        </div>

        <div className="p-10 hover:underline">
          <h1><Link to="/price-lists">Price Lists</Link></h1>
        </div>

        <div className="p-10 hover:underline">
          <h1><Link to="/item-prices">Item Prices</Link></h1>
        </div>

        <div className="p-10 hover:underline">
          <h1><Link to="/report">Report</Link></h1>
        </div>

        <div className="p-10 hover:underline">
          <h1></h1>
        </div>

      </div>
    </div>
  );
}

export default SideBar;
