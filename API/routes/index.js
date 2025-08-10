import { Router } from "express";

import resourceRouter from "./api/resources-router.js";
import priceListsRouter from "./api/pricelists-router.js";
import itemPricesRouter from "./api/itemprices-router.js";
import unitConversionsRouter from "./api/unitconversions-router.js"; 
import unitsRouter from "./api/units-router.js";

const router = Router();

// Basic route
router.get("/", (req, res) => {
  res.send("Welcome to the ESM Node.js App with Router!");
});

// API routes
router.use("/api/resources", resourceRouter);
router.use("/api/pricelists", priceListsRouter);
router.use("/api/itemprices", itemPricesRouter);
router.use("/api/unitconversions", unitConversionsRouter);
router.use("/api/units", unitsRouter);

// 404 handler
router.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;