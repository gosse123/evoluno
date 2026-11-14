import crypto from "node:crypto";

// Chiffrement symétrique des tokens OAuth en base de données.
// Constitution art. VI + specs/001-auth-profile/plan.md §4.
// Format stocké : iv:authTag:chiffrement (hexadécimal).

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // bytes — spécification du plan §4
const KEY_BYTES = 32;
const KEY_HEX_LENGTH = KEY_BYTES * 2; // 64 caractères hex

function getKey(): Buffer {
  const raw = process.env.ENCRYPTION_SECRET_KEY;
  if (!raw) {
    throw new Error(
      "ENCRYPTION_SECRET_KEY manquante : définissez 32 bytes en hexadécimal (openssl rand -hex 32).",
    );
  }
  if (raw.length !== KEY_HEX_LENGTH || !/^[0-9a-f]+$/i.test(raw)) {
    throw new Error(
      `ENCRYPTION_SECRET_KEY invalide : attendu ${KEY_HEX_LENGTH} caractères hexadécimaux (32 bytes).`,
    );
  }
  return Buffer.from(raw, "hex");
}

export function encryptToken(token: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export function decryptToken(encryptedData: string): string {
  const parts = encryptedData.split(":");
  if (parts.length !== 3 || parts.some((part) => part.length === 0)) {
    throw new Error(
      "Format de jeton chiffré invalide : attendu iv:authTag:chiffrement en hexadécimal.",
    );
  }
  const [ivHex, authTagHex, encryptedText] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8"); // lève une erreur si l'AuthTag ne correspond pas
  return decrypted;
}
