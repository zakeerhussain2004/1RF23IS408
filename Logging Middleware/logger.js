import axios from 'axios';
import dotenv from 'dotenv';
import { STACK, LEVEL, PACKAGE } from './constants.js';

// Load environment variables from .env file
dotenv.config();

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

/**
 * Sends a log to the remote logging service.
 * @param {string} stack - The stack where the log originated (e.g., 'backend', 'frontend').
 * @param {string} level - The severity level of the log (e.g., 'info', 'error').
 * @param {string} pkg - The package/module where the log originated (e.g., 'controller', 'api').
 * @param {string} message - The descriptive log message.
 * @returns {Promise<string|null>} The logID if successful, otherwise null.
 */
export const Log = async (stack, level, pkg, message) => {
  if (!ACCESS_TOKEN) {
    console.error('Logger Error: ACCESS_TOKEN is not defined. Make sure it is set in your .env file.');
    return null;
  }

  // Basic validation against allowed values
  const allStacks = Object.values(STACK);
  const allLevels = Object.values(LEVEL);
  const allPackages = Object.values(PACKAGE);

  if (!allStacks.includes(stack) || !allLevels.includes(level) || !allPackages.includes(pkg)) {
    console.error(`Logger Validation Error: Invalid parameter provided.
      Stack: ${stack} (Allowed: ${allStacks.join(', ')})
      Level: ${level} (Allowed: ${allLevels.join(', ')})
      Package: ${pkg} (Allowed: ${allPackages.join(', ')})
    `);
    return null;
  }

  try {
    const response = await axios.post(
      LOG_API_URL,
      {
        stack: stack,
        level: level,
        package: pkg,
        message: message,
      },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200 && response.data.logID) {
      console.log(`Log created successfully: ${response.data.logID}`);
      return response.data.logID;
    }
  } catch (error) {
    console.error('Logger API Error: Failed to send log to the server.');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error Data:', error.response.data);
      console.error('Error Status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error Message:', error.message);
    }
    return null;
  }
};