import crypto from "crypto";

/**
 * Generate a secure random token for email verification or password reset
 * @returns {string} A 32-byte hex token
 */
export function generateSecureToken() {
    return crypto.randomBytes(32).toString("hex");
}

/**
 * Generate a token expiration date
 * @param {number} hours - Number of hours until expiration
 * @returns {Date} Expiration date
 */
export function generateTokenExpiration(hours = 24) {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
}
