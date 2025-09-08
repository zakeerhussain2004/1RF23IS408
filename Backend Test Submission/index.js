// Add this endpoint to your backend index.js file

app.get('/shorturls', (req, res) => {
  // Converts the Map values to an array for JSON response
  const allUrls = Array.from(urlDatabase.values());
  res.status(200).json(allUrls);
});