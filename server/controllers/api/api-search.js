const Workspace = require("../../models/Workspace");
const Property = require("../../models/Property");

async function getSearchData(req, res) {
  try {
    const searchQuery = req.query.query;
    if (!searchQuery) return res.status(400).json({ error: "Query is required" });

    // Lấy tất cả workspace và populate property_id để lấy địa chỉ
    const workspaces = await Workspace.find().lean(); // lean() trả về plain object

    // Lấy tất cả property liên quan
    const propertyIds = workspaces.map(ws => ws.property_id);
    const properties = await Property.find({ _id: { $in: propertyIds } }).lean();

    // Map property_id → Address
    const pMap = new Map();
    properties.forEach(p => {
      pMap.set(p.property_id, `${p.Address_line1}, ${p.city}, ${p.province}`);
    });

    // Lọc workspace theo tên hoặc địa chỉ chứa searchQuery (case-insensitive)
    let searchResult = workspaces
      .map(ws => ({ ...ws, Address: pMap.get(ws.property_id) || "" }))
      .filter(ws => 
        ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ws.Address.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Chỉ lấy tối đa 4 kết quả
    searchResult = searchResult.slice(0, 4);

    res.json(searchResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error." });
  }
}

module.exports = getSearchData;
