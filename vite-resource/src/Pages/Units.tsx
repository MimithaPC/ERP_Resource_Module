import React, { useEffect, useState } from "react";
import axios from "axios";

interface Unit {
    unit_id: number;
    unit_name: string;
    unit_symbol: string;
}

const Units: React.FC = () => {
    const [units, setUnits] = useState<Unit[]>([]);
    const [form, setForm] = useState<Partial<Unit>>({});
    const [editId, setEditId] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [searchField, setSearchField] = useState<"unit_id" | "unit_name" | "unit_symbol">("unit_name");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        axios.get("http://localhost:3000/api/units")
            .then(res => setUnits(res.data))
            .catch(err => console.error("Error fetching units:", err));
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
        if (!form.unit_name || !form.unit_symbol) {
            alert("All fields are required.");
            return;
        }

        const payload = {
            unit_name: form.unit_name,
            unit_symbol: form.unit_symbol,
        };

        try {
            if (editId !== null) {
                const res = await axios.put(`http://localhost:3000/api/units/${editId}`, payload);
                if (res.data && res.data.unit_id) {
                    setUnits(units.map(u => u.unit_id === editId ? res.data : u));
                }
            } else {
                const res = await axios.post("http://localhost:3000/api/units", payload);
                if (res.data && res.data.unit_id) {
                    setUnits([...units, res.data]);
                }
            }

            setForm({});
            setEditId(null);
            setIsAdding(false);
        } catch (err) {
            console.error("Error saving unit:", err);
            alert("Error saving unit. Check console.");
        }
    };

    const handleEdit = (unit: Unit) => {
        setForm(unit);
        setEditId(unit.unit_id);
        setIsAdding(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/units/${id}`);
            setUnits(units.filter(u => u.unit_id !== id));
        } catch (err) {
            console.error("Error deleting unit:", err);
        }
    };

    const filteredUnits = units.filter(unit => {
        const value = searchValue.toLowerCase();
        if (searchField === "unit_id") {
            return unit.unit_id.toString().includes(value);
        } else if (searchField === "unit_name") {
            return unit.unit_name.toLowerCase().includes(value);
        } else if (searchField === "unit_symbol") {
            return unit.unit_symbol.toLowerCase().includes(value);
        }
        return true;
    });

    const totalPages = Math.ceil(filteredUnits.length / pageSize);
    const paginatedUnits = filteredUnits.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-md shadow-md">
            <h1 className="text-4xl font-bold text-center mb-6 underline">Units</h1>

            {/* Search */}
            <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
                <div className="flex gap-2 items-center">
                    <label className="font-medium">Search By:</label>
                    <select
                        className="border border-black px-2 py-1 rounded"
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value as "unit_id" | "unit_name" | "unit_symbol")}
                    >
                        <option value="unit_id">ID</option>
                        <option value="unit_name">Name</option>
                        <option value="unit_symbol">Symbol</option>
                    </select>
                    <input
                        className="border border-black px-3 py-1 rounded w-64"
                        type="text"
                        placeholder={`Search ${searchField}`}
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            setCurrentPage(1); // reset to page 1 on search
                        }}
                    />
                </div>

                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded border border-black" onClick={handleAddNew}>Add New</button>
            </div>

            {/* Form */}
            {isAdding && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input name="unit_name" placeholder="Unit Name" value={form.unit_name || ""} onChange={handleInputChange} className="border border-black px-3 py-2 rounded" />
                    <input name="unit_symbol" placeholder="Unit Symbol" value={form.unit_symbol || ""} onChange={handleInputChange} className="border border-black px-3 py-2 rounded" />
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
                            <th className="border px-4 py-2">Symbol</th>
                            <th className="border px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUnits.map(unit => (
                            <tr key={unit.unit_id}>
                                <td className="border px-4 py-2">{unit.unit_id}</td>
                                <td className="border px-4 py-2">{unit.unit_name}</td>
                                <td className="border px-4 py-2">{unit.unit_symbol}</td>
                                <td className="border px-4 py-2 text-center space-x-2">
                                    <button onClick={() => handleEdit(unit)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded border border-black">Edit</button>
                                    <button onClick={() => handleDelete(unit.unit_id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded border border-black">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {paginatedUnits.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-gray-500">No units found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
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

export default Units;
