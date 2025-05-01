
'use server';

import fs from 'fs/promises';
import path from 'path';

const emailsFilePath = path.join(process.cwd(), 'emails.txt');

interface SaveEmailResult {
  success: boolean;
  error?: string;
}

export async function saveEmail(email: string): Promise<SaveEmailResult> {
  // Basic server-side validation
  if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
    return { success: false, error: 'Correo electrónico inválido.' };
  }

  // Sanitize email to prevent potential injection issues in the query string
  // (Although writing to a file reduces risk compared to direct DB execution, it's good practice)
  const sanitizedEmail = email.replace(/'/g, "''"); // Escape single quotes for SQL

  const query = `INSERT INTO subscribers (email) VALUES ('${sanitizedEmail}');\n`;

  try {
    await fs.appendFile(emailsFilePath, query, 'utf8');
    console.log(`Email saved: ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Error writing email to file:', error);
    // In a production app, you might want more specific error handling or logging
    return { success: false, error: 'Error interno del servidor al guardar el correo.' };
  }
}
