# File Encryption & Decryption In The Browser

An exploration into file encryption in the browser.  This is a simple tool that
can encrypt or decrypt files up to 500KB in size.

## Try it on GitHub

https://samuel-mccallum.github.io/browser-encryption-app/

## what to do

- Generate Keys, or upload keys you've previously saved
- Select a file to encrypt and upload it
- Once encrypted it will appear in the Files section
- Download the encrypted file
- On the Decrypt side, select the downloaded, encrypted file
- File will be decrypted and appear in the Files list

## How does it work

The app creates a 1024 bit RSA key pair when you "Generate Keys".  When
you upload a file, it:

 - reads the file data as a binary string
 - generates a 192 bit AES key
 - encrypts the file data with the key producing the ciphertext string
 - encrypts the AES key with the RSA public key or "encryption key" producing a ciphered key string
 - encodes a new object as a file containing file original name, cipherkey & ciphertext
 - attach the encoded data to a link for download

an RSA 1024 bit key can't encode very much data, and it's slow, so it uses AES
to do the heavy lifting and just encodes the AES key.  For decryption, given you
have the RSA private key or "decryption key" it will:

- read the file you upload,
- decode it to the ciphered AES key and ciphered file data
- decrypt the AES key with the RSA private key or "decryption key"
- use the decrypted AES key to decrypt the original data
- encode it on the link for download

## Limitations

- The JavaScript runtime in the browser is not cryptographically secure.  It can
be tampered with from the browser console, other scripts included on the page,
browser plugins or other vectors.
- File sizes are limited to 500KB.  Files of even 1 MB use loads of RAM and
cause the browser be sluggish.

## Tools used

- JSEncrypt - https://www.npmjs.com/package/jsencrypt
- AES-JS - https://www.npmjs.com/package/aes-js
- Vue CLI
- vue-worker - https://www.npmjs.com/package/vue-worker

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
