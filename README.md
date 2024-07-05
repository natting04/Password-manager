README:
Overview
The project focuses on developing a secure and efficient password manager to address the problem of weak and easily guessable passwords. The password manager will help users generate and store strong passwords securely, leveraging cryptographic primitives discussed in the course.
COMPONENTS
   1.Cryptographic Primitives:
   authenticated encryption: using AES-GCM to encrypt passwords.
   collision-resistant Hash Functions: using HMAC for domain names and SHA-256 for integrity checks.
   2. Library:
      subtleCrypto: JavaScript library for cryptographic operations.
   3. key management:
      PBKDF2: password-based key derivation function to derive a master key from the user's master password.
      HMAC: Used to derive sub-keys for MACing domain names and encrypting passwords.
   4.Data Structures.
     Key-Value Store (KVS): In-memory JavaScript object to store domain-password pairs.
      
   
