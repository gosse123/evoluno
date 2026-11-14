import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { decryptToken, encryptToken } from "./crypto";

// Clé de test : 32 bytes hexadécimaux (64 caractères).
const TEST_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

describe("encryptToken / decryptToken (AES-256-GCM)", () => {
  beforeEach(() => {
    process.env.ENCRYPTION_SECRET_KEY = TEST_KEY;
  });

  afterEach(() => {
    delete process.env.ENCRYPTION_SECRET_KEY;
  });

  it("produit un cycle aller-retour fidèle", () => {
    const token = "gho_aBcD1234secretTokenXYZ";
    expect(decryptToken(encryptToken(token))).toBe(token);
  });

  it("ne contient jamais le jeton en clair dans le chiffrement", () => {
    const token = "super-secret-token";
    const encrypted = encryptToken(token);
    expect(encrypted).not.toContain(token);
  });

  it("respecte le format iv:authTag:chiffrement en hexadécimal", () => {
    const parts = encryptToken("t").split(":");
    expect(parts).toHaveLength(3);
    for (const part of parts) {
      expect(part).toMatch(/^[0-9a-f]+$/i);
    }
    // IV de 16 bytes = 32 caractères hex
    expect(parts[0]).toHaveLength(32);
    // AuthTag GCM de 16 bytes = 32 caractères hex
    expect(parts[1]).toHaveLength(32);
  });

  it("génère un IV unique à chaque chiffrement (même jeton)", () => {
    const token = "same-token-every-time";
    const a = encryptToken(token);
    const b = encryptToken(token);
    expect(a).not.toBe(b);
  });

  it("rejette un AuthTag falsifié (détection de altération)", () => {
    const encrypted = encryptToken("tamper-me");
    const [iv, authTag, payload] = encrypted.split(":");
    const forgedTag = (authTag[0] === "0" ? "1" : "0") + authTag.slice(1);
    expect(() => decryptToken(`${iv}:${forgedTag}:${payload}`)).toThrow();
  });

  it("rejette un contenu chiffré altéré", () => {
    const encrypted = encryptToken("tamper-me");
    const [iv, authTag, payload] = encrypted.split(":");
    const forgedPayload = (payload[0] === "0" ? "1" : "0") + payload.slice(1);
    expect(() => decryptToken(`${iv}:${authTag}:${forgedPayload}`)).toThrow();
  });

  it("rejette un format malformé (moins de 3 segments)", () => {
    expect(() => decryptToken("pas-un-jeton")).toThrow(/format/i);
  });

  it("rejette un jeton vide ou un format incomplet", () => {
    expect(() => decryptToken("aa:bb")).toThrow(/format/i);
    expect(() => decryptToken("aa::cc")).toThrow(/format/i);
  });

  it("échoue avec un message explicite si ENCRYPTION_SECRET_KEY est absente", () => {
    delete process.env.ENCRYPTION_SECRET_KEY;
    expect(() => encryptToken("x")).toThrow(/ENCRYPTION_SECRET_KEY/);
  });

  it("échoue avec un message explicite si la clé n'est pas 32 bytes en hex", () => {
    process.env.ENCRYPTION_SECRET_KEY = "trop-court";
    expect(() => encryptToken("x")).toThrow(/ENCRYPTION_SECRET_KEY/);
    process.env.ENCRYPTION_SECRET_KEY = "zz".repeat(32); // non hexadécimal
    expect(() => encryptToken("x")).toThrow(/ENCRYPTION_SECRET_KEY/);
  });
});
