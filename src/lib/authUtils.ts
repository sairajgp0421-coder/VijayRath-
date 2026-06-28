/**
 * Cryptographic and authentication helpers for VijayRath Namkeen & Bakery
 */

export interface RegisteredUser {
  phone: string;
  name: string;
  passwordHash: string;
  salt: string;
  role: "user" | "admin";
}

export interface UserSession {
  phone: string;
  role: "user" | "admin";
  name: string;
  token: string;
  expiresAt: number; // timestamp
}

// Normalize phone numbers by removing spaces, non-digits, and country codes like +91 or 0
export function normalizePhone(p: string): string {
  const clean = p.replace(/\D/g, "");
  if (clean.length === 12 && clean.startsWith("91")) {
    return clean.slice(2);
  }
  if (clean.length === 11 && clean.startsWith("0")) {
    return clean.slice(1);
  }
  return clean;
}

// Generate a random 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Native crypto password hashing
export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Helper to generate salt
export function generateSalt(): string {
  const array = new Uint32Array(4);
  crypto.getRandomValues(array);
  return Array.from(array).map(n => n.toString(16)).join("");
}

// Seed admin and default user into localStorage
export async function seedUsers(): Promise<void> {
  const saved = localStorage.getItem("ss_kitchen_users");
  if (saved) return;

  const users: RegisteredUser[] = [];

  // Seed default User: Rahul Sharma (Phone: 9876543210, Password: password123)
  const userSalt = generateSalt();
  const userHash = await hashPassword("password123", userSalt);
  users.push({
    phone: "9876543210",
    name: "Rahul Sharma",
    passwordHash: userHash,
    salt: userSalt,
    role: "user"
  });

  // Seed default Admin: Admin Vikram (Phone: 9999999999, Password: adminsecure)
  const adminSalt = generateSalt();
  const adminHash = await hashPassword("adminsecure", adminSalt);
  users.push({
    phone: "9999999999",
    name: "Admin Vikram",
    passwordHash: adminHash,
    salt: adminSalt,
    role: "admin"
  });

  localStorage.setItem("ss_kitchen_users", JSON.stringify(users));
}

// Read users from localStorage
export function getRegisteredUsers(): RegisteredUser[] {
  try {
    const data = localStorage.getItem("ss_kitchen_users");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Save users to localStorage
export function saveRegisteredUsers(users: RegisteredUser[]): void {
  localStorage.setItem("ss_kitchen_users", JSON.stringify(users));
}
