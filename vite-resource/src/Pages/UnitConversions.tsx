import React, { useEffect, useState } from "react";
import axios from "axios";

interface UnitConversion {
    conversion_id: number;
    from_unit_id: number;
    to_unit_id: number;
    conversion_rate: number;
}

interface Unit {
    unit_id: number;
    unit_name: string;
}

const UnitConversions: React.FC = () => {
    const [conversions, setConversions] = useState<UnitConversion[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [form, setForm] = useState<Partial<UnitConversion>>({});
    const [editId, setEditId] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [searchField, setSearchField] = useState<"conversion_id" | "from_unit_id" | "to_unit_id">("conversion_id");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        axios.get("http://localhost:3000/api/unitconversions")
            .then(res => setConversions(res.data))
            .catch(err => console.error("Error fetching conversions:", err));

        axios.get("http://localhost:3000/api/units")
            .then(res => setUnits(res.data))
            .catch(err => console.error("Error fetching units:", err));
    }, []);

    const getUnitName = (unitId: number): string => {
        const unit = units.find(u => u.unit_id === unitId);
        return unit ? unit.unit_name : `ID ${unitId}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddNew = () => {
        setForm({});
        setEditId(null);
        setIsAdding(true);
    };

    const handleSave = async () => {
        if (
            form.from_unit_id === undefined ||
            form.to_unit_id === undefined ||
            form.conversion_rate === undefined
        ) {
            alert("All fields are required.");
            return;
        }

        const payload = {
            from_unit_id: Number(form.from_unit_id),
            to_unit_id: Number(form.to_unit_id),
            conversion_rate: Number(form.conversion_rate),
        };

        try {
            if (editId !== null) {
                const res = await axios.put(`http://localhost:3000/api/unitconversions/${editId}`, payload);
                if (res.data && res.data.conversion_id) {
                    setConversions(conversions.map(c => c.conversion_id === editId ? res.data : c));
                }
            } else {
                const res = await axios.post("http://localhost:3000/api/unitconversions", payload);
                if (res.data && res.data.conversion_id) {
                    setConversions([...conversions, res.data]);
                }
            }

            setForm({});
            setEditId(null);
            setIsAdding(false);
        } catch (err) {
            console.error("Error saving conversion:", err);
            alert("Error saving conversion. Check console.");
        }
    };

    const handleEdit = (c: UnitConversion) => {
        setForm(c);
        setEditId(c.conversion_id);
        setIsAdding(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/unitconversions/${id}`);
            setConversions(conversions.filter(c => c.conversion_id !== id));
        } catch (err) {
            console.error("Error deleting conversion:", err);
        }
    };

    const filteredConversions = conversions.filter(c => {
        const value = searchValue.toLowerCase();
        if (searchField === "conversion_id") {
            return c.conversion_id.toString().includes(value);
        } else if (searchField === "from_unit_id") {
            return getUnitName(c.from_unit_id).toLowerCase().includes(value);
        } else if (searchField === "to_unit_id") {
            return getUnitName(c.to_unit_id).toLowerCase().includes(value);
        }
        return true;
    });

    const totalPages = Math.ceil(filteredConversions.length / itemsPerPage);
    const paginatedConversions = filteredConversions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-100 rounded-md shadow-md">
            <h1 className="text-4xl font-bold text-center mb-6 underline">Unit Conversions</h1>

            {/* Search */}
            <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
                <div className="flex gap-2 items-center">
                    <label className="font-medium">Search By:</label>
                    <select
                        className="border border-black px-2 py-1 rounded"
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value as typeof searchField)}
                    >
                        <option value="conversion_id">Conversion ID</option>
                        <option value="from_unit_id">From Unit</option>
                        <option value="to_unit_id">To Unit</option>
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
                    <select
                        name="from_unit_id"
                        value={form.from_unit_id ?? ""}
                        onChange={handleInputChange}
                        className="border border-black px-3 py-2 rounded"
                    >
                        <option value="">Select From Unit</option>
                        {units.map(unit => (
                            <option key={unit.unit_id} value={unit.unit_id}>
                                {unit.unit_name}
                            </option>
                        ))}
                    </select>

                    <select
                        name="to_unit_id"
                        value={form.to_unit_id ?? ""}
                        onChange={handleInputChange}
                        className="border border-black px-3 py-2 rounded"
                    >
                        <option value="">Select To Unit</option>
                        {units.map(unit => (
                            <option key={unit.unit_id} value={unit.unit_id}>
                                {unit.unit_name}
                            </option>
                        ))}
                    </select>

                    <input
                        name="conversion_rate"
                        placeholder="Conversion Rate"
                        value={form.conversion_rate ?? ""}
                        onChange={handleInputChange}
                        className="border border-black px-3 py-2 rounded"
                    />

                    <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded border border-black col-span-2">Save</button>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border border-black bg-white text-sm">
                    <thead className="bg-gray-300 text-black font-bold">
                        <tr>
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">From Unit</th>
                            <th className="border px-4 py-2">To Unit</th>
                            <th className="border px-4 py-2">Rate</th>
                            <th className="border px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedConversions.map(c => (
                            <tr key={c.conversion_id}>
                                <td className="border px-4 py-2">{c.conversion_id}</td>
                                <td className="border px-4 py-2">{getUnitName(c.from_unit_id)}</td>
                                <td className="border px-4 py-2">{getUnitName(c.to_unit_id)}</td>
                                <td className="border px-4 py-2">{c.conversion_rate}</td>
                                <td className="border px-4 py-2 text-center space-x-2">
                                    <button onClick={() => handleEdit(c)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded border border-black">Edit</button>
                                    <button onClick={() => handleDelete(c.conversion_id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded border border-black">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {paginatedConversions.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-500">No unit conversions found.</td>
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

export default UnitConversions;
