import create from 'zustand'
import { PublicKey } from '@solana/web3.js'

interface UserAccountStore {
  address: string | null; // Store the public address as a string
  setAddress: (publicKey: PublicKey | null) => void; // Method to set the user's address
}

// Create the store using Zustand
const useUserAccountStore = create<UserAccountStore>((set) => ({
  address: null, // Initial state is null indicating no address is set
  setAddress: (publicKey) => {
    // Convert the PublicKey object to a base58 string if not null
    const address = publicKey ? publicKey.toBase58() : null;
    set(() => ({
      address: address,
    }));
    console.log(`Address updated: `, address);
  },
}));

export default useUserAccountStore;
