import React, { useEffect, useState } from "react";
import axios from "axios";

interface Item {
    item_id: number;
    item_name: string;
    item_type: string;
    unit_id: string;
    description: string;
}

interface Unit {
    unit_id: string;
    unit_name: string;
}

const Items: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [form, setForm] = useState<Partial<Item>>({});
    const [editId, setEditId] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [searchField, setSearchField] = useState<"item_id" | "item_name" | "item_type">("item_name");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        axios.get("http://localhost:3000/api/resources")
            .then(res => setItems(res.data))
            .catch(err => console.error("Error fetching items:", err));

        axios.get("http://localhost:3000/api/units")
            .then(res => setUnits(res.data))
            .catch(err => console.error("Error fetching units:", err));
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddNew = () => {
        setForm({});
        setEditId(null);
        setIsAdding(true);
    };

    const handleSave = async () => {
        if (!form.item_name || !form.item_type || !form.unit_id || !form.description) {
            alert("All fields are required.");
            return;
        }

        const payload = {
            item_name: form.item_name,
            item_type: form.item_type,
            unit_id: form.unit_id,
            description: form.description,
        };

        try {
            if (editId !== null) {
                const res = await axios.put(`http://localhost:3000/api/resources/${editId}`, payload);
                if (res.data && res.data.item_id) {
                    setItems(items.map(i => i.item_id === editId ? res.data : i));
                }
            } else {
                const res = await axios.post("http://localhost:3000/api/resources", payload);
                if (res.data && res.data.item_id) {
                    setItems([...items, res.data]);
                }
            }

            setForm({});
            setEditId(null);
            setIsAdding(false);
        } catch (err) {
            console.error("Error saving item:", err);
            alert("Error saving item. Check console.");
        }
    };

    const handleEdit = (item: Item) => {
        setForm(item);
        setEditId(item.item_id);
        setIsAdding(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/resources/${id}`);
            setItems(items.filter(i => i.item_id !== id));
        } catch (err) {
            console.error("Error deleting item:", err);
        }
    };

    const filteredItems = items.filter(i => {
        const value = searchValue.toLowerCase();
        if (searchField === "item_id") {
            return i.item_id.toString().includes(value);
        } else if (searchField === "item_name") {
            return i.item_name.toLowerCase().includes(value);
        } else if (searchField === "item_type") {
            return i.item_type.toLowerCase().includes(value);
        }
        return true;
    });

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage => currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage => currentPage + 1);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-100 rounded-md shadow-md">
            <h1 className="text-4xl font-bold text-center mb-6 underline">Items</h1>

            {/* Search */}
            <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
                <div className="flex gap-2 items-center">
                    <label className="font-medium">Search By:</label>
                    <select
                        className="border border-black px-2 py-1 rounded"
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value as "item_id" | "item_name" | "item_type")}
                    >
                        <option value="item_id">ID</option>
                        <option value="item_name">Name</option>
                        <option value="item_type">Type</option>
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
                    <input name="item_name" placeholder="Name" value={form.item_name || ""} onChange={handleInputChange} className="border border-black px-3 py-2 rounded" />
                    <select
                        name="item_type"
                        value={form.item_type || ""}
                        onChange={handleInputChange}
                        className="border border-black px-3 py-2 rounded"
                        >
                        <option value="">Select Type</option>
                        <option value="Materials">Materials</option>
                        <option value="Labors">Labors</option>
                        <option value="Tools">Tools</option>
                        <option value="Machineries">Machineries</option>
                        </select>
                    <select
                        name="unit_id"
                        value={form.unit_id || ""}
                        onChange={handleInputChange}
                        className="border border-black px-3 py-2 rounded"
                    >
                        <option value="">Select Unit</option>
                        {units.map(unit => (
                            <option key={unit.unit_id} value={unit.unit_id}>
                                {unit.unit_name}
                            </option>
                        ))}
                    </select>
                    <input name="description" placeholder="Description" value={form.description || ""} onChange={handleInputChange} className="border border-black px-3 py-2 rounded" />
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
                            <th className="border px-4 py-2">Type</th>
                            <th className="border px-4 py-2">Unit</th>
                            <th className="border px-4 py-2">Description</th>
                            <th className="border px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedItems.map(item => (
                            <tr key={item.item_id}>
                                <td className="border px-4 py-2">{item.item_id}</td>
                                <td className="border px-4 py-2">{item.item_name}</td>
                                <td className="border px-4 py-2">{item.item_type}</td>
                                <td className="border px-4 py-2">
                                    {units.find(u => u.unit_id === item.unit_id)?.unit_name || item.unit_id}
                                </td>
                                <td className="border px-4 py-2">{item.description}</td>
                                <td className="border px-4 py-2 text-center space-x-2">
                                    <button onClick={() => handleEdit(item)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded border border-black">Edit</button>
                                    <button onClick={() => handleDelete(item.item_id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded border border-black">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {paginatedItems.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">No items found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
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
        </div>
    );
};

export default Items;
