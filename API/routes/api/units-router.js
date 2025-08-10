import { Router } from "express";
import { db_pool } from "../../db-pool.js";
 
const router = Router();

// In-memory "database"
let units = [
    { id: 1, name: "gram", symbol: "g" },
    { id: 2, name: "kilogram", symbol: "kg" }, 
];

// GET all resources
router.get("/", async (req, res) => {
    let client;
    try {
        client = await db_pool.connect();
        const result = await client.query('SELECT * from cerpschema.units');
        console.log("units:", result.rows[0]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        if (client) client.release();
    } 
});
 
// GET single user
router.get("/:aid", async (req, res) => {
    let client;
    try {
        client = await db_pool.connect();
        const result = await client.query(
            'SELECT * from cerpschema.units where unit_id  = $1', 
            [req.params.aid]
        );
        console.log("units:", result.rows[0]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        if (client) client.release();
    }
});

// POST create new res
router.post("/", async (req, res) => {
    let client;
    try {
        client = await db_pool.connect();  
        const { unit_name , unit_symbol, created_by, updated_by, created_at, updated_at } = req.body; 
        const result = await client.query(
            'INSERT INTO cerpschema.units (unit_name , unit_symbol, created_by, updated_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [unit_name , unit_symbol, created_by, updated_by, created_at, updated_at]
        );
        const newUnits = result.rows[0]; 
        res.status(201).json(newUnits);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        if (client) client.release();
    }
});

// PUT update user
router.put("/:id", async (req, res) => {
    let client;
    try {
        client = await db_pool.connect();
        const { id } = req.params;
        const { unit_name , unit_symbol , updated_by } = req.body;
        const updated_at = new Date().toISOString(); 
        const result = await client.query(
            `UPDATE cerpschema.units SET unit_name = $1, unit_symbol = $2, updated_by = $3, updated_at = $4 WHERE unit_id = $5 RETURNING *`,
            [ unit_name || null, unit_symbol || null, updated_by || null, updated_at, id ]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Resource not found" });
        }
        const updatedunits = result.rows[0]; 
        res.json(updatedunits);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        if (client) client.release();
    }
});

// DELETE user
router.delete("/:id", async (req, res) => {
    let client;
    try {
        client = await db_pool.connect();
        const { id } = req.params;
        const result = await client.query(
            'DELETE FROM cerpschema.units WHERE unit_id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Resource not found" });
        }
        res.json({ message: "Resource deleted" });
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        if (client) client.release();
    }
});

export default router;
