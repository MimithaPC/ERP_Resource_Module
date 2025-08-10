import { Router } from "express";
import { db_pool } from "../../db-pool.js";
 
const router = Router();

// In-memory "database"
let itemPrices = [
    { id: 1, name: "sand", unit: "m" },
    { id: 2, name: "cement", unit: "kg" }, 
];

// GET all resources
router.get("/", async (req, res) => {
    let client;
    try {
        client = await db_pool.connect();
        const result = await client.query('SELECT * from cerpschema.item_prices');
        console.log("itemPrices:", result.rows[0]);
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
            'SELECT * from cerpschema.item_prices where item_price_id = $1', 
            [req.params.aid]
        );
        console.log("itemPrices:", result.rows[0]);
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
        const { price_list_id , item_id , price, created_by, updated_by, created_at, updated_at } = req.body; 
        const result = await client.query(
            'INSERT INTO cerpschema.item_prices (price_list_id , item_id , price, created_by, updated_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [price_list_id , item_id , price, created_by, updated_by, created_at, updated_at]
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
        const {
            price_list_id,
            item_id,
            price,
            created_by,
            updated_by,
            created_at // optional, usually not updated but included per request
        } = req.body;

        const updated_at = new Date().toISOString();

        const result = await client.query(
            `UPDATE cerpschema.item_prices 
             SET price_list_id = $1,
                 item_id = $2,
                 price = $3,
                 created_by = $4,
                 updated_by = $5,
                 created_at = $6,
                 updated_at = $7
             WHERE item_price_id = $8
             RETURNING *`,
            [
                price_list_id || null,
                item_id || null,
                price || null,
                created_by || null,
                updated_by || null,
                created_at || null,
                updated_at,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Resource not found" });
        }

        const updatedItemPrice = result.rows[0];
        res.json(updatedItemPrice);

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
            'DELETE FROM cerpschema.item_prices WHERE item_price_id = $1 RETURNING *',
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
