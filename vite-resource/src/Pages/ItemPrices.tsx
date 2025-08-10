import React, { useEffect, useState } from "react";
import axios from "axios";

interface ItemPrice {
  item_price_id: number;
  price_list_id: number;
  item_id: number;
  price: number;
}

interface Item {
  item_id: number;
  item_name: string;
}

interface PriceList {
  price_list_id: number;
  price_list_name: string;
}

const ItemPrices: React.FC = () => {
  const [itemPrices, setItemPrices] = useState<ItemPrice[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [form, setForm] = useState<Partial<ItemPrice>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchField, setSearchField] = useState<"item_price_id" | "price_list_id" | "item_id">("item_price_id");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios.get("http://localhost:3000/api/itemprices")
      .then(res => setItemPrices(res.data))
      .catch(err => console.error("Error fetching item prices:", err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3000/api/resources")
      .then(res => setItems(res.data))
      .catch(err => console.error("Error fetching items:", err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3000/api/pricelists")
      .then(res => setPriceLists(res.data))
      .catch(err => console.error("Error fetching price lists:", err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value === "" ? undefined : parseInt(value)
    }));
  };

  const handleAddNew = () => {
    setForm({ price_list_id: undefined, item_id: undefined, price: undefined });
    setEditId(null);
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!form.price_list_id || !form.item_id || form.price === undefined) {
      alert("All fields are required.");
      return;
    }

    const payload = {
      price_list_id: form.price_list_id,
      item_id: form.item_id,
      price: form.price,
    };

    try {
      if (editId !== null) {
        const res = await axios.put(`http://localhost:3000/api/itemprices/${editId}`, payload);
        if (res.data && res.data.item_price_id) {
          setItemPrices(itemPrices.map(ip => ip.item_price_id === editId ? res.data : ip));
        }
      } else {
        const res = await axios.post("http://localhost:3000/api/itemprices", payload);
        if (res.data && res.data.item_price_id) {
          setItemPrices([...itemPrices, res.data]);
        }
      }
      setForm({});
      setEditId(null);
      setIsAdding(false);
    } catch (err) {
      console.error("Error saving item price:", err);
      alert("Error saving item price. Check console.");
    }
  };

  const handleEdit = (ip: ItemPrice) => {
    setForm(ip);
    setEditId(ip.item_price_id);
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/itemprices/${id}`);
      setItemPrices(itemPrices.filter(ip => ip.item_price_id !== id));
    } catch (err) {
      console.error("Error deleting item price:", err);
    }
  };

  const filteredItemPrices = itemPrices.filter(ip => {
    const value = searchValue.toLowerCase();
    if (searchField === "item_price_id") {
      return ip.item_price_id.toString().includes(value);
    } else if (searchField === "price_list_id") {
      const pl = priceLists.find(p => p.price_list_id === ip.price_list_id);
      return pl ? pl.price_list_name.toLowerCase().includes(value) || ip.price_list_id.toString().includes(value) : false;
    } else if (searchField === "item_id") {
      const item = items.find(i => i.item_id === ip.item_id);
      return item ? item.item_name.toLowerCase().includes(value) || ip.item_id.toString().includes(value) : false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredItemPrices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItemPrices.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, searchField, itemPrices]);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-100 rounded-md shadow-md">
      <h1 className="text-4xl font-bold text-center mb-6 underline">Item Prices</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
        <div className="flex gap-2 items-center">
          <label className="font-medium">Search By:</label>
          <select
            className="border border-black px-2 py-1 rounded"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as "item_price_id" | "price_list_id" | "item_id")}
          >
            <option value="item_price_id">Item Price ID</option>
            <option value="price_list_id">Price List</option>
            <option value="item_id">Item</option>
          </select>
          <input
            className="border border-black px-3 py-1 rounded w-64"
            type="text"
            placeholder={`Search ${searchField}`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded border border-black"
          onClick={handleAddNew}
        >
          Add New
        </button>
      </div>

      {isAdding && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            name="price_list_id"
            value={form.price_list_id || ""}
            onChange={handleInputChange}
            className="border border-black px-3 py-2 rounded"
          >
            <option value="">Select Price List</option>
            {priceLists.map(pl => (
              <option key={pl.price_list_id} value={pl.price_list_id}>
                {pl.price_list_name}
              </option>
            ))}
          </select>

          <select
            name="item_id"
            value={form.item_id || ""}
            onChange={handleInputChange}
            className="border border-black px-3 py-2 rounded"
          >
            <option value="">Select Item</option>
            {items.map(item => (
              <option key={item.item_id} value={item.item_id}>
                {item.item_name}
              </option>
            ))}
          </select>

          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price || ""}
            onChange={handleInputChange}
            className="border border-black px-3 py-2 rounded"
          />

          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded border border-black col-span-full"
          >
            Save
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border border-black bg-white text-sm">
          <thead className="bg-gray-300 text-black font-bold">
            <tr>
              <th className="border px-4 py-2">Item Price ID</th>
              <th className="border px-4 py-2">Price List</th>
              <th className="border px-4 py-2">Item</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(ip => {
              const item = items.find(i => i.item_id === ip.item_id);
              const priceList = priceLists.find(pl => pl.price_list_id === ip.price_list_id);
              return (
                <tr key={ip.item_price_id}>
                  <td className="border px-4 py-2">{ip.item_price_id}</td>
                  <td className="border px-4 py-2">{priceList ? priceList.price_list_name : `ID: ${ip.price_list_id}`}</td>
                  <td className="border px-4 py-2">{item ? item.item_name : `ID: ${ip.item_id}`}</td>
                  <td className="border px-4 py-2">{ip.price}</td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(ip)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded border border-black"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ip.item_price_id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded border border-black"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
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
            currentPage === 1 ? "bg-gray-300 text-gray-600" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-4 py-2 border border-black rounded ${
            currentPage === totalPages || totalPages === 0
              ? "bg-gray-300 text-gray-600"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ItemPrices;
