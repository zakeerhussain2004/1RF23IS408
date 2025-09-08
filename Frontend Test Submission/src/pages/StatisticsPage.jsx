import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Link as MuiLink,
  CircularProgress,
  Alert
} from '@mui/material';

const StatisticsPage = () => {
  // State for storing URLs, loading status, and errors
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // This function runs once when the component loads
    const fetchUrls = async () => {
      try {
        setLoading(true);
        setError('');
        // Fetch data from the new backend endpoint
        const response = await axios.get('http://localhost:8000/shorturls');
        setUrls(response.data);
      } catch (err) {
        setError('Failed to fetch URL statistics. Please make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, []); // The empty array ensures this runs only once

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        URL Statistics
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short Link</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>Expires At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.length > 0 ? (
              urls.map((url) => (
                <TableRow key={url.shortCode}>
                  <TableCell>
                    <MuiLink href={url.shortLink} target="_blank" rel="noopener">
                      {url.shortLink}
                    </MuiLink>
                  </TableCell>
                  <TableCell sx={{ wordBreak: 'break-all' }}>{url.originalUrl}</TableCell>
                  <TableCell>{url.clicks || 0}</TableCell>
                  <TableCell>{new Date(url.expiry).toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No URLs have been shortened yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default StatisticsPage;