const express = require("express");
const router = express.Router();
const { getInvoiceById, getAllInvoices } = require("../controllers/invoiceController");

router.get("/all", getAllInvoices);
router.get("/:id", getInvoiceById);

module.exports = router;