const secretKey = "hS5d9Tn3GxV7pY4qW2fLz1jB8kR6mC0n";

async function signToken(id) {
  const encoder = new TextEncoder();
  const payload = JSON.stringify({ id });

  const secretKeyBuffer = encoder.encode(secretKey);
  const payloadBuffer = encoder.encode(payload);

  const key = await crypto
    .subtle
    .importKey("raw", secretKeyBuffer, {
      name: "HMAC",
      hash: {
        name: "SHA-256"
      }
    }, false, ["sign"]);

  const signatureBuffer = await crypto
    .subtle
    .sign("HMAC",
      key,
      payloadBuffer
    )

  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
  const payloadBase64 = btoa(payload);

  const token = `${payloadBase64}:${signatureBase64}`;

  return token;
}

async function verifyToken(token) {
  const [encodedPayload, signatureBase64] = token.split(":");

  const payload = atob(encodedPayload);
  const signatureBuffer = new Uint8Array(
    atob(signatureBase64)
    .split("")
    .map((char) => {
      return char.charCodeAt(0);
    }));

  const encoder = new TextEncoder();
  const secretKeyBuffer = encoder.encode(secretKey);
  const payloadBuffer = encoder.encode(payload);

  const key = await crypto
    .subtle
    .importKey("raw", secretKeyBuffer, {
      name: "HMAC",
      hash: {
        name: "SHA-256"
      }
    }, false, ["verify"]);

  const isValid = await crypto
    .subtle
    .verify("HMAC", key, signatureBuffer, payloadBuffer);

  return { success: isValid, payload: JSON.parse(payload) };
}

export {
  signToken,
  verifyToken
};