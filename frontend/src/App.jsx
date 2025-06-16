import React, { useState } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [existing, setExisting] = useState([]);
  const [dealedInput, setDealedInput] = useState("");
  const [dealedStatus, setDealedStatus] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const links = input.split("\n").map((link) => link.trim()).filter(Boolean);
    try {
      const res = await axios.post("http://localhost:5000/api/check-sites", { links });
      setResults(res.data.newSites || []);
      setExisting(res.data.existing || []);
    } catch (err) {
      alert("Error checking sites");
    }
  };

  const handleDealedSubmit = async (e) => {
    e.preventDefault();
    const domains = dealedInput.split("\n").map((link) => link.trim()).filter(Boolean);
    try {
      const res = await axios.post("http://localhost:5000/api/add-dealed", { domains });
      const { added = [], existing = [] } = res.data;
      let message = "";
      if (added.length > 0) message += `✅ Added: ${added.join(", ")}\n`;
      if (existing.length > 0) message += `⚠️ Already exists: ${existing.join(", ")}`;
      setDealedStatus(message.trim());
      setDealedInput("");
    } catch (err) {
      alert("Error saving dealed domains");
    }
  };

  const handleCopy = () => {
    if (results.length === 0) return;
    const textToCopy = results.join("\n");
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyStatus("✅ Copied to clipboard!");
      setTimeout(() => setCopyStatus(""), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          🚀 Outreach Domain Filter Tool
        </h1>

        {/* Check Section */}
        <form onSubmit={handleSubmit}>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            🔍 Check Domains
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="8"
            placeholder="Paste Ahrefs URLs here, one per line"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Filter New Domains
          </button>
        </form>

        {/* Results */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-green-700 font-semibold text-lg">✅ New Outreach Domains:</h3>
            {results.length > 0 && (
              <button
                onClick={handleCopy}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
              >
                Copy All
              </button>
            )}
          </div>
          <ul className="list-disc list-inside text-sm text-gray-800">
            {results.map((domain, idx) => (
              <li key={idx}>{domain}</li>
            ))}
          </ul>
          {copyStatus && (
            <p className="text-green-600 mt-2 text-sm font-medium">{copyStatus}</p>
          )}

          <h3 className="text-red-700 font-semibold text-lg mt-6 mb-2">⚠️ Already In Database:</h3>
          <ul className="list-disc list-inside text-sm text-gray-800">
            {existing.map((domain, idx) => (
              <li key={idx}>{domain}</li>
            ))}
          </ul>
        </div>

        <hr className="my-8 border-t border-gray-300" />

        {/* Add Dealed Section */}
        <form onSubmit={handleDealedSubmit}>
          <h2 className="text-xl font-bold text-gray-800 mb-2">📌 Add Dealed Domains</h2>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows="5"
            placeholder="Paste dealed root domains here"
            value={dealedInput}
            onChange={(e) => setDealedInput(e.target.value)}
          />
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition"
          >
            Save Dealed Domains
          </button>
        </form>

        {/* Dealed Status */}
        {dealedStatus && (
          <div className="mt-6 bg-green-100 text-green-800 p-4 rounded-lg border-l-4 border-green-600 whitespace-pre-line font-medium">
            {dealedStatus}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
