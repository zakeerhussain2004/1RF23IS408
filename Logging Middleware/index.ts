// Logging middleware for URL shortener application
const LOG_ENDPOINT = 'http://20.244.56.144/evaluation-service/logs';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ6YWtlZXJodXNzYWluMjAwNEBnbWFpbC5jb20iLCJleHAiOjE3NTczMTUwNTksImlhdCI6MTc1NzMxNDE1OSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjUwNWM4MzBiLTM2NjktNDA5OC04ZTJlLTFlNTY4OGMyZTdkMCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InNoZWlrIHpha2VlciBodXNzYWluIiwic3ViIjoiZjBhMjgzZDYtM2E2Ny00M2UzLTgyNDMtMzhiYzRlYTI0OGZmIn0sImVtYWlsIjoiemFrZWVyaHVzc2FpbjIwMDRAZ21haWwuY29tIiwibmFtZSI6InNoZWlrIHpha2VlciBodXNzYWluIiwicm9sbE5vIjoiNDA4IiwiYWNjZXNzQ29kZSI6IldQVnFrdyIsImNsaWVudElEIjoiZjBhMjgzZDYtM2E2Ny00M2UzLTgyNDMtMzhiYzRlYTI0OGZmIiwiY2xpZW50U2VjcmV0IjoiWnNDUFFyalRybXhGSkZNcCJ9.iIASGjBIvzvy6w2ia5APrhTOGBIx5mX45qW6pEMuNxk';

export interface LogData {
  stack: string;
  level: string;
  package: string;
  message: string;
}

/**
 * Logs a message to the evaluation service
 * @param stack - The stack identifier (e.g., "frontend", "backend")
 * @param level - The log level (e.g., "info", "error", "warn", "debug")
 * @param packageName - The package/module name
 * @param message - The log message
 */
export async function Log(stack: string, level: string, packageName: string, message: string): Promise<void> {
  const logData: LogData = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: packageName.toLowerCase(),
    message
  };

  try {
    await fetch(LOG_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify(logData)
    });
  } catch (error) {
    // Ignore network errors as per requirements
    // Still counts as a log attempt
  }
}