const express = require("express");
const router = express.Router();
const Site = require("../models/Site");

function normalizeDomains(domains) {
  return domains
    .map((link) => {
      try {
        const url = new URL(link.startsWith("http") ? link : `http://${link}`);
        return url.hostname.replace(/^www\./, "").toLowerCase();
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

router.post("/", async (req, res) => {
  const { domains } = req.body;
  if (!Array.isArray(domains)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const normalized = normalizeDomains(domains);

  const existing = await Site.find({ domain: { $in: normalized } }).distinct("domain");
  const newDomains = normalized.filter(domain => !existing.includes(domain));

  const added = [];
  if (newDomains.length > 0) {
    const docs = newDomains.map(domain => ({
      domain,
      dealed: true,
      dealDate: new Date()
    }));

    try {
      await Site.insertMany(docs, { ordered: false });
      added.push(...newDomains);
    } catch (err) {
      console.error("Insert error:", err.message);
    }
  }

  res.json({ added, existing });
});

module.exports = router;
