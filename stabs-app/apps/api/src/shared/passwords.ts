import { scryptSync, timingSafeEqual } from "node:crypto";

function deriveHashBuffer(password: string, salt: string) {
  return scryptSync(password, salt, 64);
}

export function hashPassword(password: string, salt: string) {
  return deriveHashBuffer(password, salt).toString("hex");
}

export function verifyPassword(password: string, salt: string, expectedHash: string) {
  const actual = deriveHashBuffer(password, salt);
  const expected = Buffer.from(expectedHash, "hex");

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}
