import { verify } from '@noble/ed25519';
import bs58 from 'bs58';

/**
 * Verifies a signature against a message and a public key.
 * @param message - The original message that was signed, as a string.
 * @param signature - The signature in Base58 encoding.
 * @param publicKey - The public key in Base58 encoding.
 * @returns A promise that resolves to a boolean indicating whether the signature is valid.
 */
export async function verifySignature(message: string, signatureBase58: string, publicKeyBase58: string): Promise<boolean> {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const signature = bs58.decode(signatureBase58);
    const publicKeyBytes = bs58.decode(publicKeyBase58);

    return await verify(signature, messageBytes, publicKeyBytes);
  } catch (error) {
    console.error('Failed to verify signature:', error);
    return false;
  }
}
