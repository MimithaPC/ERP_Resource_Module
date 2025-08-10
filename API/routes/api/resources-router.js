import { Router } from "express";
import { db_pool } from "../../db-pool.js";
 
const router = Router();

// In-memory "database"
let resources = [
    { id: 1, name: "sand", unit: "m" },
    { id: 2, name: "cement", unit: "kg" }, 
];

// GET all resources
router.get("/", async (req, res) => {
    let client;
    try {
        client = await db_pool.connect();
        const result = await client.query('SELECT * from cerpschema.items');
        console.log("resources:", result.rows[0]);
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
            'SELECT * from cerpschema.items where item_id = $1', 
            [req.params.aid]
        );
        console.log("resources:", result.rows[0]);
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
        const { item_name, item_type, unit_id, description, created_by, updated_by, created_at, updated_at } = req.body; 
        const result = await client.query(
            'INSERT INTO cerpschema.items (item_name, item_type, unit_id, description, created_by, updated_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [item_name, item_type, unit_id, description, created_by, updated_by, created_at, updated_at]
        );
        const newResource = result.rows[0]; 
        res.status(201).json(newResource);
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
        const { item_name, item_type, unit_id, description, updated_by } = req.body;
        const updated_at = new Date().toISOString(); 
        const result = await client.query(
            `UPDATE cerpschema.items SET item_name = $1, item_type = $2, unit_id = $3, description = $4, updated_by = $5, updated_at = $6 WHERE item_id = $7 RETURNING *`,
            [ item_name || null, item_type || null, unit_id || null, description || null, updated_by || null, updated_at, id ]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Resource not found" });
        }
        const updatedResource = result.rows[0]; 
        res.json(updatedResource);
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
            'DELETE FROM cerpschema.items WHERE item_id = $1 RETURNING *',
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
