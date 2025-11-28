async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) =>
      b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

async function comparePassword(password, hashed) {
  const hashedPassword = await hashPassword(password);

  return hashedPassword === hashed;
}

export {
  hashPassword,
  comparePassword
}