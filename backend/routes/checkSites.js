const express = require("express");
const router = express.Router();
const Site = require("../models/Site");

router.post("/", async (req, res) => {
  const { links } = req.body;
  if (!Array.isArray(links)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const normalized = links
    .map((link) => {
      try {
        const url = new URL(link.startsWith("http") ? link : `http://${link}`);
        return url.hostname.replace(/^www\./, "").toLowerCase();
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const existing = await Site.find({
    domain: { $in: normalized },
    dealed: true,
  }).distinct("domain");

  const newSites = normalized.filter((domain) => !existing.includes(domain));

  res.json({ newSites, existing });
});

module.exports = router;
