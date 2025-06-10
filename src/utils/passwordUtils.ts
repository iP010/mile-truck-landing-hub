
// Browser-compatible password hashing using Web Crypto API
const ITERATIONS = 100000; // PBKDF2 iterations for security

export const hashPassword = async (password: string): Promise<string> => {
  try {
    // Generate a random salt
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // Convert password to ArrayBuffer
    const passwordBuffer = new TextEncoder().encode(password);
    
    // Import the password as a key
    const key = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    // Derive the hash using PBKDF2
    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: ITERATIONS,
        hash: 'SHA-256'
      },
      key,
      256 // 32 bytes = 256 bits
    );
    
    // Combine salt and hash
    const combined = new Uint8Array(salt.length + hashBuffer.byteLength);
    combined.set(salt);
    combined.set(new Uint8Array(hashBuffer), salt.length);
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Password hashing error:', error);
    throw new Error('Failed to hash password');
  }
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    // Decode the stored hash
    const combined = Uint8Array.from(atob(hash), c => c.charCodeAt(0));
    
    // Extract salt (first 16 bytes) and stored hash (remaining bytes)
    const salt = combined.slice(0, 16);
    const storedHash = combined.slice(16);
    
    // Convert password to ArrayBuffer
    const passwordBuffer = new TextEncoder().encode(password);
    
    // Import the password as a key
    const key = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    // Derive the hash using the same salt
    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: ITERATIONS,
        hash: 'SHA-256'
      },
      key,
      256 // 32 bytes = 256 bits
    );
    
    // Compare the hashes
    const computedHash = new Uint8Array(hashBuffer);
    
    // Constant-time comparison to prevent timing attacks
    if (storedHash.length !== computedHash.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < storedHash.length; i++) {
      result |= storedHash[i] ^ computedHash[i];
    }
    
    return result === 0;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
};

export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
