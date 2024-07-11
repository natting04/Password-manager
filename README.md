README:
**OVERVIEW**

The project focuses on developing a secure and efficient password manager to address the problem of weak and easily guessable passwords. The password manager will help users generate and store strong passwords securely, leveraging cryptographic primitives discussed in the course.It demonstrates the use of various cryptographic primitives such as authenticated encryption and collision-resistant hash functions, utilizing the SubtleCrypto library for implementation.

**COMPONENTS**

  1.**Cryptographic Primitives**:
   authenticated encryption: using AES-GCM to encrypt passwords.
   collision-resistant Hash Functions: using HMAC for domain names and SHA-256 for integrity checks.
   
 2. **Library**:
      subtleCrypto: JavaScript library for cryptographic operations.
      
 3. **key management**:
      PBKDF2: password-based key derivation function to derive a master key from the user's master password.
      HMAC: Used to derive sub-keys for MACing domain names and encrypting passwords.
      
 4.**Data Structures**.
     Key-Value Store (KVS): In-memory JavaScript object to store domain-password pairs.

 **PREREQUISITES**

 1.installation on node.js
 
 2.understanding JavaScript and cryptography.

** INSTALLATION**

1.Navigating to the project directory

2.Install the required dependencies. ie npm install

**INITIALIZATION**

1.To create a new keychain with a master password

2.To load an existing keychain from a serialized representation

3.To add or update a password for a domain

4.To retrieve a password for a domain

5.To serialize the keychain for storage

**SECURITY MODEL**

The password manager is designed to be secure against attacks like:

1.**Swap Attacks**: Prevents unauthorized swapping of password entries.

2.**Rollback Attacks**: Protects against reverting to previous states of the password database.
**
**API Documentation**
**
**'static async init(password)'**

**Parameters: 'password**'(string) - The master password.

**Returns: ,Keychain'** object.

**Description**: Initializes a new keychain with the provided master password.

**'static async load(password, representation, trustedDataCheck)'**

**Parameters:**

**'password**' (string) - The master password.

**'representation'** (string) - JSON encoded serialization of the keychain.

**'trustedDataCheck'** (string) - Optional SHA-256 hash for integrity check.

**Returns: 'Keychain'** object.

**Description:** Loads an existing keychain from the provided serialization.

**'async dump()'**

**Returns:** Array of two strings - JSON encoded serialization and SHA-256 hash.

**Description:** Serializes the keychain and computes a SHA-256 hash.

**'async set(name, value)'**

**Parameters:**

**'name'**(string) - The domain name.

**'value'** (string) - The password.

**Description:** Adds or updates a password for the specified domain.

**'async get(name)'**

**Parameters:**

**'name'** (string) - The domain name.

**Returns:** The password associated with the domain.

**Description:** Retrieves the password for the specified domain.





















 

     
     
     
      
   
