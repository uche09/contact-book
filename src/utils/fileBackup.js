import fs from "fs";
import path from "path";
import os from "os";

// Create a CSV backup for a user's contacts.
// Returns the absolute path to the created CSV file.

export default async function createContactsCSV(userId, contacts = []) {
  const backupsDir = path.resolve(process.cwd(), "backups");
  fs.mkdirSync(backupsDir, { recursive: true });

  const timestamp = Date.now();
  const filename = `contacts_backup_user_${userId}_${timestamp}.csv`;
  const filePath = path.join(backupsDir, filename);

  const fields = [
    "name",
    "phone",
    "email",
    "physicalAddr",
    "tag",
    "createdAt",
    "updatedAt",
  ];

  const escape = (val) => {
    if (val === null || val === undefined) return "";
    const s = String(val);
    // Double quotes inside value must be escaped by doubling them per RFC4180
    return `"${s.replace(/"/g, '""')}"`;
  };

  const header = fields.join(",");
  const rows = contacts.map((contact) =>
    fields.map((f) => escape(contact[f])).join(",")
  );

  const csv = [header, ...rows].join(os.EOL);

  fs.writeFileSync(filePath, csv, "utf8");

  return filePath;
}