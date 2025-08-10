import React, { useEffect, useState } from "react";
import axios from "axios";

interface PriceList {
    price_list_id: number;
    price_list_name: string;
    location: string;
    valid_from: string;
    valid_to: string;
}

const PriceLists: React.FC = () => {
    const [priceLists, setPriceLists] = useState<PriceList[]>([]);
    const [form, setForm] = useState<Partial<PriceList>>({});
    const [editId, setEditId] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [searchField, setSearchField] = useState<"price_list_id" | "price_list_name" | "location">("price_list_name");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        axios.get("http://localhost:3000/api/pricelists")
            .then(res => setPriceLists(res.data))
            .catch(err => console.error("Error fetching price lists:", err));
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddNew = () => {
        setForm({});
        setEditId(null);
        setIsAdding(true);
    };

    const handleSave = async () => {
        if (!form.price_list_name || !form.location || !form.valid_from || !form.valid_to) {
            alert("All fields are required.");
            return;
        }

        const payload = {
            price_list_name: form.price_list_name,
            location: form.location,
            valid_from: form.valid_from,
            valid_to: form.valid_to,
        };

        try {
            if (editId !== null) {
                const res = await axios.put(`http://localhost:3000/api/pricelists/${editId}`, payload);
                if (res.data && res.data.price_list_id) {
                    setPriceLists(priceLists.map(p => p.price_list_id === editId ? res.data : p));
                }
            } else {
                const res = await axios.post("http://localhost:3000/api/pricelists", payload);
                if (res.data && res.data.price_list_id) {
                    setPriceLists([...priceLists, res.data]);
                }
            }

            setForm({});
            setEditId(null);
            setIsAdding(false);
        } catch (err) {
            console.error("Error saving price list:", err);
            alert("Error saving price list. Check console.");
        }
    };

    const handleEdit = (pl: PriceList) => {
        setForm(pl);
        setEditId(pl.price_list_id);
        setIsAdding(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/pricelists/${id}`);
            setPriceLists(priceLists.filter(p => p.price_list_id !== id));
        } catch (err) {
            console.error("Error deleting price list:", err);
        }
    };

    const filteredPriceLists = priceLists.filter(pl => {
        const value = searchValue.toLowerCase();
        if (searchField === "price_list_id") {
            return pl.price_list_id.toString().includes(value);
        } else if (searchField === "price_list_name") {
            return pl.price_list_name.toLowerCase().includes(value);
        } else if (searchField === "location") {
            return pl.location.toLowerCase().includes(value);
        }
        return true;
    });

    const totalPages = Math.ceil(filteredPriceLists.length / itemsPerPage);
    const paginatedPriceLists = filteredPriceLists.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-100 rounded-md shadow-md">
            <h1 className="text-4xl font-bold text-center mb-6 underline">Price Lists</h1>

            {/* Search */}
            <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
                <div className="flex gap-2 items-center">
                    <label className="font-medium">Search By:</label>
                    <select
                        className="border border-black px-2 py-1 rounded"
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value as "price_list_id" | "price_list_name" | "location")}
                    >
                        <option value="price_list_id">ID</option>
                        <option value="price_list_name">Name</option>
                        <option value="location">Location</option>
                    </select>
                    <input
                        className="border border-black px-3 py-1 rounded w-64"
                        type="text"
                        placeholder={`Search ${searchField}`}
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded border border-black" onClick={handleAddNew}>Add New</button>
            </div>

            {/* Form */}
            {isAdding && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input name="price_list_name" placeholder="Name" value={form.price_list_name || ""} onChange={handleInputChange} className="border border-black px-3 py-2 rounded" />
                    <input name="location" placeholder="Location" value={form.location || ""} onChange={handleInputChange} className="border border-black px-3 py-2 rounded" />
                    <input name="valid_from" type="date" value={form.valid_from || ""} onChange={handleInputChange} className="border border-black px-3 py-2 rounded" />
                    <input name="valid_to" type="date" value={form.valid_to || ""} onChange={handleInputChange} className="border border-black px-3 py-2 rounded" />
                    <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded border border-black col-span-2">Save</button>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border border-black bg-white text-sm">
                    <thead className="bg-gray-300 text-black font-bold">
                        <tr>
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">Location</th>
                            <th className="border px-4 py-2">Valid From</th>
                            <th className="border px-4 py-2">Valid To</th>
                            <th className="border px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedPriceLists.map(pl => (
                            <tr key={pl.price_list_id}>
                                <td className="border px-4 py-2">{pl.price_list_id}</td>
                                <td className="border px-4 py-2">{pl.price_list_name}</td>
                                <td className="border px-4 py-2">{pl.location}</td>
                                <td className="border px-4 py-2">{pl.valid_from}</td>
                                <td className="border px-4 py-2">{pl.valid_to}</td>
                                <td className="border px-4 py-2 text-center space-x-2">
                                    <button onClick={() => handleEdit(pl)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded border border-black">Edit</button>
                                    <button onClick={() => handleDelete(pl.price_list_id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded border border-black">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {paginatedPriceLists.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">No price lists found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Buttons */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border border-black rounded ${currentPage === 1 ? "bg-gray-300 text-gray-600" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                    Previous
                </button>
                <span className="text-gray-700 font-medium">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-4 py-2 border border-black rounded ${currentPage === totalPages || totalPages === 0 ? "bg-gray-300 text-gray-600" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PriceLists;
