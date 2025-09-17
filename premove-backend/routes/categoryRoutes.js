import express from "express";
import {
  getCategories,
  getAllItems,
  // getSubCategoryItems,
  getInventoryByLead,
  getSubCategoryItem,
  getCustomerLeads,
  getLeadById,
  getCustomerInventory,
  addInventory,
  createLead,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/all-items", getAllItems);
// router.get("/sub-category-items/:sub_category_id", getSubCategoryItems);
router.get("/inventory/:lead_unique_id", getInventoryByLead);
router.get("/sub-category-item/:id", getSubCategoryItem);
router.get("/customer/leads/:phone", getCustomerLeads);
// ✅ Lead & Inventory Routes
router.get("/leads/:id", getLeadById);
router.get("/inventory/:lead_id", getCustomerInventory);
router.post("/add-inventory", addInventory);
router.post("/create-lead", createLead);


export default router;
 