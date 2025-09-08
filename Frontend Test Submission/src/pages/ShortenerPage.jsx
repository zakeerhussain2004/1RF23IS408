import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
  IconButton
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const ShortenerPage = () => {
  // 1. State is now an array of objects
  const [inputs, setInputs] = useState([{ id: 1, longUrl: '', customShortcode: '' }]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Function to handle changes in any input field
  const handleInputChange = (id, event) => {
    const newInputs = inputs.map(input => {
      if (id === input.id) {
        return { ...input, [event.target.name]: event.target.value };
      }
      return input;
    });
    setInputs(newInputs);
  };

  // 3. Function to add a new URL input field (up to 5)
  const handleAddUrl = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { id: Date.now(), longUrl: '', customShortcode: '' }]);
    }
  };

  // 4. Function to remove a URL input field
  const handleRemoveUrl = (id) => {
    const newInputs = inputs.filter(input => input.id !== id);
    setInputs(newInputs);
  };

  // 5. Updated submission logic to handle multiple API calls
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResults([]);
    setLoading(true);

    const urlsToShorten = inputs.filter(input => input.longUrl.trim() !== '');

    if (urlsToShorten.length === 0) {
      setError('Please enter at least one URL to shorten.');
      setLoading(false);
      return;
    }

    // Use Promise.all to send all requests concurrently
    const promises = urlsToShorten.map(input =>
      axios.post('http://localhost:8000/shorturls', {
        url: input.longUrl,
        shortcode: input.customShortcode || undefined,
      }).then(response => ({
          status: 'success',
          originalUrl: input.longUrl,
          shortLink: response.data.shortLink
      })).catch(err => ({
          status: 'error',
          originalUrl: input.longUrl,
          message: err.response?.data?.message || 'An error occurred.'
      }))
    );

    const responses = await Promise.all(promises);
    setResults(responses);
    setLoading(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create Short Links
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {inputs.map((input, index) => (
          <Box key={input.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              name="longUrl"
              label={`URL #${index + 1}`}
              variant="outlined"
              fullWidth
              required
              value={input.longUrl}
              onChange={(e) => handleInputChange(input.id, e)}
              sx={{ mr: 1 }}
            />
            <TextField
              name="customShortcode"
              label="Custom Code (Optional)"
              variant="outlined"
              value={input.customShortcode}
              onChange={(e) => handleInputChange(input.id, e)}
              sx={{ mr: 1, minWidth: '200px' }}
            />
            {inputs.length > 1 && (
              <IconButton onClick={() => handleRemoveUrl(input.id)} color="error">
                <RemoveCircleOutlineIcon />
              </IconButton>
            )}
          </Box>
        ))}

        <Button
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddUrl}
          disabled={inputs.length >= 5}
          sx={{ mb: 2 }}
        >
          Add another URL
        </Button>

        <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten All URLs'}
        </Button>
      </Box>

      {/* Display Results */}
      <Box sx={{ mt: 4 }}>
        {results.map((result, index) => (
          <Alert
            key={index}
            severity={result.status === 'success' ? 'success' : 'error'}
            sx={{ mb: 1, wordBreak: 'break-all' }}
          >
            <strong>{result.originalUrl}</strong>: {result.status === 'success' ? result.shortLink : result.message}
          </Alert>
        ))}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>
    </Paper>
  );
};

export default ShortenerPage;