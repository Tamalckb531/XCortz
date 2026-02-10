# XCortz /generate Route Implementation Guide

## 📦 Installation

### Backend
```bash
cd backend
npm install argon2 cors
npm install -D @types/node
```

### Frontend
No new packages needed - using built-in Next.js fetch

---

## 🏗️ Backend File Structure

```
backend/src/
├── crypto/
│   ├── encryption.ts       # Core encryption utilities
│   └── fileGenerator.ts    # Passkey & vault file generators
├── routes/
│   └── generate.ts         # API endpoints
└── index.ts                # Main server (updated)
```

---

## 📝 Module Explanations

### 1. `crypto/encryption.ts` - Encryption Core

**What it does:**
- Handles ALL cryptographic operations
- Uses industry-standard algorithms (Argon2id + AES-256-GCM)

**Key Functions:**

| Function | Purpose | Returns |
|----------|---------|---------|
| `generateRandomKey()` | Creates 256-bit random key for .passkey | Base64 string |
| `generateSalt()` | Creates random salt for key derivation | Base64 string |
| `generateIV()` | Creates IV for each encryption | Base64 string |
| `deriveKey()` | Combines master key + passkey → encryption key | Buffer (32 bytes) |
| `encrypt()` | Encrypts data with AES-256-GCM | {iv, ciphertext} |
| `decrypt()` | Decrypts data (verifies auth tag) | Plaintext string |

**Security Features:**
- Argon2id: Memory-hard, resistant to GPU attacks
- AES-256-GCM: Authenticated encryption (prevents tampering)
- Unique IV per encryption
- 64MB memory cost, 3 iterations for Argon2

---

### 2. `crypto/fileGenerator.ts` - File Creation

**What it does:**
- Generates .passkey and .vault files with correct structure
- Encrypts verification text and empty password array

**Key Functions:**

`generatePasskeyFile()`:
```typescript
Returns: {
  version: "1.0",
  key: "base64-random-256-bit-key",
  created_at: "2025-02-10T..."
}
```

`generateVaultFile(masterKey, passkeyFile)`:
```typescript
Returns: {
  version: "1.0",
  salt: "random-salt",
  verification: {
    iv: "...",
    ciphertext: "encrypted-VAULT_VALID_v1"
  },
  data: {
    iv: "...",
    ciphertext: "encrypted-[]"
  }
}
```

**Process:**
1. Generate salt
2. Derive key from master+passkey+salt
3. Encrypt "VAULT_VALID_v1" (for verification)
4. Encrypt empty array [] (for passwords)
5. Return complete vault structure

---

### 3. `routes/generate.ts` - API Endpoints

**Endpoints:**

#### `POST /api/generate-passkey`
- No request body needed
- Returns: `{ success: true, data: PasskeyFile }`
- Simple: just generates random key

#### `POST /api/generate-vault`
Request:
```json
{
  "masterKey": "user's password",
  "passkeyFile": { PasskeyFile object }
}
```

Response:
```json
{
  "success": true,
  "data": { VaultFile object }
}
```

**Validation:**
- Master key required
- Master key min 8 chars
- Passkey file required and valid

---

### 4. `index.ts` - Main Server

**Changes:**
- Added CORS for frontend (`http://localhost:3001`)
- Mounted `/api` routes
- Better logging

---

## 🎨 Frontend File Structure

```
frontend/src/components/
└── Generate.tsx            # Updated with API calls
```

---

## 📝 Frontend Component Explanation

### `Generate.tsx` - Complete Flow

**State Management:**
```typescript
masterKey: string              // User input
passkeyGenerated: boolean      // Has passkey been created?
passkeyFile: PasskeyFile|null  // Stores passkey data for vault generation
vaultGenerated: boolean        // Has vault been created?
isGeneratingPasskey: boolean   // Loading state
isGeneratingVault: boolean     // Loading state
```

**Button States:**
1. **Master Key Input**
   - Empty → all buttons disabled
   - < 8 chars → shows error, buttons disabled
   - ≥ 8 chars → passkey button enabled

2. **Generate Passkey Button**
   - Disabled until master key valid
   - Calls `/api/generate-passkey`
   - Downloads .passkey file
   - Enables vault button

3. **Generate Vault Button**
   - Disabled until passkey generated
   - Calls `/api/generate-vault` with masterKey + passkeyFile
   - Downloads .vault file
   - Enables Done button

4. **Done Button**
   - Disabled until vault generated
   - Navigates to `/dashboard`

**Key Functions:**

`downloadFile(data, filename)`:
- Creates blob from JSON
- Triggers browser download
- Auto-downloads to user's Downloads folder

`handleGeneratePasskey()`:
- Fetches from API
- Stores passkeyFile in state (needed for vault generation)
- Auto-downloads file
- Shows success message

`handleGenerateVault()`:
- Sends masterKey + passkeyFile to API
- Auto-downloads vault file
- Shows success message

**User Flow:**
```
1. Enter master key → [enabled]
2. Click "Generate Passkey" → [downloads xcortz.passkey] → [enabled]
3. Click "Generate Vault" → [downloads xcortz.vault] → [enabled]
4. Click "Done" → Navigate to dashboard
```

**Status Indicators:**
- ⏳ Pending / ✅ Generated
- Shows visual progress

---

## 🚀 Running the Code

### Start Backend
```bash
cd backend
npm run dev
```
Should see: `🚀 Server is running on http://localhost:3000`

### Start Frontend
```bash
cd frontend
npm run dev
```
Opens on: `http://localhost:3001`

---

## 🔒 Security Flow Diagram

```
User enters master key "MyPassword123"
↓
Clicks "Generate Passkey"
↓
Backend: crypto.randomBytes(32) → "xyz123..." (base64)
↓
Frontend: Downloads "xcortz.passkey"
↓
User clicks "Generate Vault"
↓
Backend:
  1. Generate salt
  2. Argon2("MyPassword123" + "xyz123..." + salt) → encryption_key
  3. AES-256-GCM encrypt "VAULT_VALID_v1" → verification
  4. AES-256-GCM encrypt "[]" → data
  5. Return vault file
↓
Frontend: Downloads "xcortz.vault"
↓
User clicks "Done" → Dashboard
```

---

## 🛡️ What Makes This Secure?

1. **Three-Factor Security:**
   - Master key (what you know)
   - Passkey file (what you have)
   - Both needed to decrypt

2. **Key Derivation:**
   - Argon2id (memory-hard, GPU-resistant)
   - Unique salt per vault
   - 64MB memory cost

3. **Encryption:**
   - AES-256-GCM (authenticated)
   - Unique IV per encryption
   - Auth tag prevents tampering

4. **Verification:**
   - "VAULT_VALID_v1" encrypted separately
   - Fast check before decrypting passwords
   - Fails immediately if wrong credentials

5. **No Storage:**
   - Master key never stored
   - Backend generates files, doesn't save them
   - Files stay on user's machine only

---

## 📋 Testing Checklist

- [ ] Backend runs without errors
- [ ] CORS works (no console errors in browser)
- [ ] Master key input works
- [ ] Validation shows errors for short passwords
- [ ] Passkey button disabled until master key valid
- [ ] Vault button disabled until passkey generated
- [ ] Done button disabled until vault generated
- [ ] .passkey file downloads correctly
- [ ] .vault file downloads correctly
- [ ] Status indicators update (⏳ → ✅)
- [ ] Navigation to dashboard works

---

## 🐛 Common Issues & Fixes

**"Failed to generate passkey. Make sure backend is running"**
- Check backend is on port 3000
- Check CORS is enabled
- Check browser console for errors

**Files not downloading**
- Browser might block automatic downloads
- Check browser's download settings
- Allow downloads from localhost

**Master key validation not working**
- Check state updates in React DevTools
- Verify masterKey.length >= 8

**CORS errors**
- Verify frontend on port 3001
- Check backend CORS origin matches
- Restart both servers

---

## 🔧 File Locations in Your Project

**Backend files to create:**
```
backend/src/crypto/encryption.ts       ← Copy from outputs
backend/src/crypto/fileGenerator.ts    ← Copy from outputs
backend/src/routes/generate.ts         ← Copy from outputs
backend/src/index.ts                   ← Replace existing
```

**Frontend files to update:**
```
frontend/src/components/Generate.tsx   ← Replace existing
```

---

## ✅ What You Can Change

**Master key minimum length:**
- In `routes/generate.ts` line 51: `if (masterKey.length < 8)`
- In `Generate.tsx` line 153: `disabled={masterKey.length < 8}`

**Argon2 parameters (more/less secure):**
- In `encryption.ts` lines 61-64
- Increase `memoryCost` for more security (slower)
- Increase `timeCost` for more iterations

**Verification text:**
- In `fileGenerator.ts` line 22: `const VERIFICATION_TEXT = 'VAULT_VALID_v1'`

**File names:**
- In `Generate.tsx` line 113: `'xcortz.passkey'`
- In `Generate.tsx` line 152: `'xcortz.vault'`

**API port:**
- In `index.ts` line 19: `const PORT = 3000`
- In `Generate.tsx` lines 56, 91: `'http://localhost:3000'`

---

## 🎯 Next Steps

After implementing this:
1. Test the complete flow
2. Check downloaded files have correct structure
3. Save your .passkey and .vault files for testing /upload route
4. Move to /upload route implementation next

The files are ready to copy into your project!