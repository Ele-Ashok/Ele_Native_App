import db from "../config/db.js";   // 👈 fixed path


// ✅ Get single lead by ID
export const getLeadById = async (req, res) => {
   const id = req.params.id;

  db.query(
    "SELECT * FROM ele_customer_lead WHERE id = ?",
    [id],
    (err, leads) => {
      if (err) return res.status(500).json({ error: "DB error" });

      res.json({
        success: true,
        total: leads.length,
        leads,
      });
    }
  );
};


export const getCategories = (req, res) => {
  db.query("SELECT id, sub_category_name FROM ele_sub_category", (err, results) => {
    if (err) {
      console.error("❌ Error fetching categories:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

export const getAllItems = (req, res) => {
  db.query(
    "SELECT id, sub_category_item_name, sub_category_item_image FROM ele_sub_category_item",
    (err, results) => {
      if (err) {
        console.error("❌ Error fetching all items:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    }
  );
};

//  

export const getInventoryByLead = (req, res) => {
  const leadId = req.params.lead_unique_id;
  console.log(leadId);

  console.log("📌 Requested Lead ID:", leadId);

  db.query(
    `SELECT id, sub_category_item_id, quantity, cust_email 
     FROM ele_customer_inventory 
     WHERE lead_unique_id = ? AND deleted_inventory = 0`,
    [leadId],
    (err, results) => {
      if (err) {
        console.error("❌ Error fetching inventory:", err);
        return res.status(500).json({ error: "Database error" });
      }
      console.log("✅ Inventory results:", results);
      res.json(results);
    }
  );
};

// Get sub-category item by ID
export const getSubCategoryItem = (req, res) => {
  const id = req.params.id;
  console.log(id);

  db.query(
    `SELECT id, sub_category_item_name, sub_category_item_image, sub_category_id, cubic_feet, assemble_disamble, wood_crafting, wall_dismounting
     FROM ele_sub_category_item WHERE id = ?`,
    [id],
    (err, results) => {
      if (err) {
        console.error("❌ Error fetching sub category item:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results[0] || {});
    }
  );
};

// ✅ Get all leads of logged-in customer
export const getCustomerLeads = (req, res) => {
  const phone = req.params.phone;

  db.query(
    "SELECT * FROM ele_customer_lead WHERE cust_mobile = ? ORDER BY id DESC",
    [phone],
    (err, leads) => {
      if (err) return res.status(500).json({ error: "DB error" });

      res.json({
        success: true,
        total: leads.length,
        leads,
      });
    }
  );
};
