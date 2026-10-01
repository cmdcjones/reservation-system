import * as fs from "fs";
import * as path from "path";

function getSafeISOTimestamp(): string {
  return new Date().toISOString().replace(/[TZ:.-]/g, "");
}

function sanitizeBaseName(baseName: string): string {
  return baseName
    .split(" ")
    .map((v) => v.toLowerCase())
    .join("_");
}

function createPrefixedFile(baseName: string, fileContent: string): void {
  const timestamp = getSafeISOTimestamp();
  const sanitizedBaseName = sanitizeBaseName(baseName);
  const fileName = `${timestamp}_${sanitizedBaseName}`;
  const filePath = path.join(import.meta.dirname, `/migrations/${fileName}.ts`);

  try {
    fs.writeFileSync(filePath, fileContent, "utf-8");
    console.log(`Successfully created file: ${fileName}`);
  } catch (error) {
    console.error("Failed to create file:", error);
  }
}

const fileContents = `// Auto-generated migration file
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code to update schema to next version
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code to update schema to previous version
}
`;

const fileName = process.argv[2];
if (!fileName || fileName.length === 0) {
  console.error(
    "Please provide a file name as an argument. Example: npx ts-node script.ts myFile.txt",
  );
  process.exit(1);
}

createPrefixedFile(fileName, fileContents);
