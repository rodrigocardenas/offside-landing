
'use server';

import fs from 'fs/promises';
import path from 'path';

// Ensure the 'data' directory exists, otherwise fs.appendFile will fail if it doesn't.
// Note: In a real production environment, consider a more robust data storage solution.
const dataDir = path.join(process.cwd(), 'data');
const emailsFilePath = path.join(dataDir, 'emails_mysql.sql'); // Changed filename for clarity

interface SaveEmailResult {
  success: boolean;
  error?: string;
}

// Function to ensure the directory exists
async function ensureDirectoryExists(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`[Server Action] Directory ensured: ${dirPath}`);
  } catch (error: any) {
    // Ignore error if directory already exists
    if (error.code !== 'EEXIST') {
      console.error(`[Server Action] Error creating directory ${dirPath}:`, error);
      throw error; // Re-throw other errors
    }
  }
}

export async function saveEmail(email: string): Promise<SaveEmailResult> {
  console.log(`[Server Action] Received email for saving: ${email}`); // Server log

  // Basic server-side validation
  if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
    console.error(`[Server Action] Validation failed: Invalid email format for "${email}"`);
    return { success: false, error: 'Correo electrónico inválido.' };
  }

  // Sanitize email to prevent potential SQL injection issues.
  // Basic escaping for single quotes. Use prepared statements in a real DB setup.
  const sanitizedEmail = email.replace(/'/g, "''");

  // Format as an SQL INSERT statement
  const query = `INSERT INTO subscribers (email, subscribed_at) VALUES ('${sanitizedEmail}', NOW());\n`;
  console.log(`[Server Action] Generated query: ${query.trim()}`); // Server log

  try {
    // Ensure the data directory exists before trying to write
    await ensureDirectoryExists(dataDir);

    // Append the query to the file
    await fs.appendFile(emailsFilePath, query, 'utf8');
    console.log(`[Server Action] Successfully appended query for ${email} to ${emailsFilePath}`); // Server log
    return { success: true };
  } catch (error) {
    console.error(`[Server Action] Error writing email query to file (${emailsFilePath}):`, error); // Detailed server error log
    // In a production app, you might want more specific error handling or logging
    return { success: false, error: 'Error interno del servidor al guardar el correo.' };
  }
}
