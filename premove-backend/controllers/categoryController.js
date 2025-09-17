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






// incerty changes my


// ✅ Get Inventory of a Lead
export const getCustomerInventory = (req, res) => {
  const lead_id = req.params.lead_id;

  db.query(
    `SELECT ci.id, ci.quantity, ci.lead_unique_id, sci.sub_category_item 
     FROM ele_customer_inventory ci
     JOIN ele_sub_category_item sci ON ci.sub_category_item_id = sci.id
     WHERE ci.lead_unique_id = ?
     ORDER BY ci.id DESC`,
    [lead_id],
    (err, inventory) => {
      if (err) return res.status(500).json({ error: "DB error" });

      res.json({
        success: true,
        total: inventory.length,
        inventory,
      });
    }
  );
};
// ✅ POST /api/add-inventory
// ✅ POST /api/add-inventory
export const addInventory = (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "No items provided" });
  }

  let inserted = 0;
  let processed = 0;
  let errors = [];

  items.forEach(item => {
    if (item.quantity > 0 && item.lead_unique_id) {
      db.query(
        `INSERT INTO ele_customer_inventory (sub_category_item_id, quantity, lead_unique_id, cust_email)
         VALUES (?, ?, ?, ?)`,
        [item.sub_category_item_id, item.quantity, item.lead_unique_id, item.cust_email || ""],
        (err) => {
          processed++;
          if (err) errors.push({ item, error: err.message });
          else inserted++;

          if (processed === items.length) {
            if (errors.length) return res.status(500).json({ success: false, inserted, errors });
            return res.json({ success: true, message: "Inventory added successfully", inserted });
          }
        }
      );
    } else {
      processed++;
      if (processed === items.length) {
        if (errors.length) return res.status(500).json({ success: false, inserted, errors });
        return res.json({ success: true, message: "Inventory added successfully", inserted });
      }
    }
  });
};


// ✅ POST /api/create-lead
export const createLead = (req, res) => {
  const {
    cust_name,
    cust_email,
    cust_mobile,
    moving_type,
    moving_from,
    moving_to,
    moving_date, 
    home_type_id
  } = req.body;

  if (!cust_name || !cust_mobile) {
    return res.status(400).json({
      success: false,
      message: "Customer name and mobile are required"
    });
  }

  const sql = `
    INSERT INTO ele_customer_lead 
      (cust_name, cust_email, cust_mobile, moving_type, moving_from, moving_to, moving_date, home_type_id, lead_date, lead_generate_from)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), 1)
  `;

  db.query(sql, [
      cust_name || null,
      cust_email || null,
      cust_mobile || null,
      moving_type || null,
      moving_from || null,
      moving_to || null,
      moving_date || null,
      home_type_id || null
  ], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "DB insert failed" });

    // Return the generated lead id
    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead_id: result.insertId
    });
  });
};
