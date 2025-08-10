import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface ItemPrice {
  item_price_id: number;
  price_list_id: number;
  item_id: number;
  price: number;
}

interface Item {
  item_id: number;
  item_name: string;
  item_type: string;
  unit_id: string;
}

interface PriceList {
  price_list_id: number;
  price_list_name: string;
  location: string;
  valid_from: string;
  valid_to: string;
}

interface Unit {
  unit_id: string;
  unit_name: string;
}

const Report: React.FC = () => {
  const [itemPrices, setItemPrices] = useState<ItemPrice[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [searchField, setSearchField] = useState<"item" | "type" | "location">("item");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios.get("http://localhost:3000/api/itemprices").then(res => setItemPrices(res.data)).catch(err => console.error("Error fetching item prices:", err));
    axios.get("http://localhost:3000/api/resources").then(res => setItems(res.data)).catch(err => console.error("Error fetching items:", err));
    axios.get("http://localhost:3000/api/pricelists").then(res => setPriceLists(res.data)).catch(err => console.error("Error fetching price lists:", err));
    axios.get("http://localhost:3000/api/units").then(res => setUnits(res.data)).catch(err => console.error("Error fetching units:", err));
  }, []);

  const filteredItemPrices = itemPrices.filter((ip) => {
    const value = searchValue.toLowerCase();
    const item = items.find((i) => i.item_id === ip.item_id);
    const priceList = priceLists.find((p) => p.price_list_id === ip.price_list_id);

    if (searchField === "item") {
      return (
        item?.item_name.toLowerCase().includes(value) ||
        (item?.item_id.toString() ?? "").includes(value)
      );
    } else if (searchField === "type") {
      return (
        item?.item_type.toLowerCase().includes(value) ||
        (item?.item_id.toString() ?? "").includes(value)
      );
    } else if (searchField === "location") {
      return (
        priceList?.location.toLowerCase().includes(value) ||
        (priceList?.price_list_id.toString() ?? "").includes(value)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filteredItemPrices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItemPrices = filteredItemPrices.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, searchField]);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleGenerateReport = () => {
    const reportData = filteredItemPrices.map((ip) => {
      const item = items.find((i) => i.item_id === ip.item_id);
      const priceList = priceLists.find((p) => p.price_list_id === ip.price_list_id);
      const unit = item ? units.find((u) => u.unit_id === item.unit_id) : undefined;

      return {
        Item: item?.item_name || ip.item_id,
        Type: item?.item_type || "-",
        Unit: unit?.unit_name || item?.unit_id || "-",
        "Price List": priceList?.price_list_name || ip.price_list_id,
        Location: priceList?.location || "-",
        "Valid From": priceList?.valid_from || "-",
        "Valid To": priceList?.valid_to || "-",
        Price: ip.price,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Item Prices Report");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Item_Prices_Report.xlsx");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-100 rounded-md shadow-md">
      <h1 className="text-4xl font-bold text-center mb-6 underline">Item Prices Report</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-center justify-start">
        <div className="flex gap-2 items-center">
          <label className="font-medium">Search By:</label>
          <select
            className="border border-black px-2 py-1 rounded"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as typeof searchField)}
          >
            <option value="item">Item</option>
            <option value="type">Type</option>
            <option value="location">Location</option>
          </select>
          <input
            className="border border-black px-3 py-1 rounded w-64"
            type="text"
            placeholder={`Search by ${searchField.charAt(0).toUpperCase() + searchField.slice(1)}`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-black bg-white text-sm">
          <thead className="bg-gray-300 text-black font-bold">
            <tr>
              <th className="border px-4 py-2">Item</th>
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Unit</th>
              <th className="border px-4 py-2">Price List</th>
              <th className="border px-4 py-2">Location</th>
              <th className="border px-4 py-2">Valid From</th>
              <th className="border px-4 py-2">Valid To</th>
              <th className="border px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItemPrices.map((ip) => {
              const priceList = priceLists.find(p => p.price_list_id === ip.price_list_id);
              const item = items.find(i => i.item_id === ip.item_id);
              const unit = item ? units.find(u => u.unit_id === item.unit_id) : undefined;

              return (
                <tr key={ip.item_price_id}>
                  <td className="border px-4 py-2">{item?.item_name || ip.item_id}</td>
                  <td className="border px-4 py-2">{item?.item_type || "-"}</td>
                  <td className="border px-4 py-2">{unit?.unit_name || item?.unit_id || "-"}</td>
                  <td className="border px-4 py-2">{priceList?.price_list_name || ip.price_list_id}</td>
                  <td className="border px-4 py-2">{priceList?.location || "-"}</td>
                  <td className="border px-4 py-2">{priceList?.valid_from || "-"}</td>
                  <td className="border px-4 py-2">{priceList?.valid_to || "-"}</td>
                  <td className="border px-4 py-2">{ip.price}</td>
                </tr>
              );
            })}
            {paginatedItemPrices.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No item prices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 border border-black rounded ${
            currentPage === 1 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium">Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-4 py-2 border border-black rounded ${
            currentPage === totalPages || totalPages === 0 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Next
        </button>
      </div>

      <div className="flex justify-center mt-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded border border-black w-full"
          onClick={handleGenerateReport}
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default Report;
