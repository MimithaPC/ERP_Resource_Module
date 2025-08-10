import { Router } from "express";
import { db_pool } from "../../db-pool.js";
 
const router = Router();

// In-memory "database"
let unitConversions = [
    { id: 1, rate: "1000g" },
    { id: 2, rate: "1kg" }, 
];

// GET all resources
router.get("/", async (req, res) => {
    let client;
    try {
        client = await db_pool.connect();
        const result = await client.query('SELECT * from cerpschema.unit_conversions');
        console.log("unitConversions:", result.rows[0]);
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
            'SELECT * from cerpschema.unit_conversions where conversion_id  = $1', 
            [req.params.aid]
        );
        console.log("unitConversions:", result.rows[0]);
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
        const { from_unit_id , to_unit_id, conversion_rate, created_by, updated_by, created_at, updated_at } = req.body; 
        const result = await client.query(
            'INSERT INTO cerpschema.unit_conversions (from_unit_id , to_unit_id, conversion_rate, created_by, updated_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [from_unit_id , to_unit_id, conversion_rate, created_by, updated_by, created_at, updated_at]
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
        const { from_unit_id , to_unit_id, conversion_rate, updated_by } = req.body;
        const updated_at = new Date().toISOString(); 
        const result = await client.query(
            `UPDATE cerpschema.unit_conversions SET from_unit_id = $1, to_unit_id = $2, conversion_rate =$3, updated_by = $4, updated_at = $5 WHERE conversion_id  = $6 RETURNING *`,
            [ from_unit_id || null, to_unit_id || null, conversion_rate || null, updated_by || null, updated_at, id ]
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
            'DELETE FROM cerpschema.unit_conversions WHERE conversion_id  = $1 RETURNING *',
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
