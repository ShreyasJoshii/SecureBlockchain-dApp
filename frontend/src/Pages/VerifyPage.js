// // pages/VerifyPage.js (With Fixes: Correct Filename + Key Detection)

// import React, { useState } from "react";
// import { Button, Form, Container, Card, Alert, Spinner } from "react-bootstrap";
// import Web3 from "web3";
// import ContractABI from "../contracts/SecureMessage.json";

// function VerifyPage() {
//   const [hash, setHash] = useState("");
//   const [result, setResult] = useState(null);
//   const [status, setStatus] = useState({ message: "", variant: "info" });
//   const [loading, setLoading] = useState(false);
//   const [decryptKey, setDecryptKey] = useState("");

//   const handleVerify = async () => {
//     setStatus({ message: "", variant: "info" });
//     setResult(null);

//     if (!hash.trim()) {
//       setStatus({ message: "❌ Please enter a hash to verify.", variant: "danger" });
//       return;
//     }

//     try {
//       setLoading(true);
//       const web3 = new Web3(window.ethereum);
//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = ContractABI.networks[networkId];
//       const contract = new web3.eth.Contract(ContractABI.abi, deployedNetwork.address);

//       const data = await contract.methods.getMessage(hash).call();
//       setResult(data);
//     } catch (err) {
//       console.error("Verification failed:", err);
//       setStatus({ message: "⚠️ Hash not found on blockchain.", variant: "danger" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const decryptFile = async (encrypted, keyText) => {
//     const encryptedBytes = new Uint8Array(encrypted);
//     const salt = encryptedBytes.slice(0, 16);
//     const iv = encryptedBytes.slice(16, 28);
//     const data = encryptedBytes.slice(28);

//     const keyMaterial = await window.crypto.subtle.importKey(
//       "raw",
//       new TextEncoder().encode(keyText),
//       "PBKDF2",
//       false,
//       ["deriveKey"]
//     );

//     const key = await window.crypto.subtle.deriveKey(
//       {
//         name: "PBKDF2",
//         salt,
//         iterations: 100000,
//         hash: "SHA-256"
//       },
//       keyMaterial,
//       { name: "AES-GCM", length: 256 },
//       false,
//       ["decrypt"]
//     );

//     const decrypted = await window.crypto.subtle.decrypt(
//       { name: "AES-GCM", iv },
//       key,
//       data
//     );

//     return new Blob([decrypted]);
//   };

//   const handleDownload = async () => {
//     if (!hash) return;
//     try {
//       const res = await fetch(`http://localhost:5000/download/${hash}`);
//       const buffer = await res.arrayBuffer();

//       let fileBlob;
//       if (result[6] && result[6].trim().length > 0) {
//         if (!decryptKey) {
//           setStatus({ message: "❗ Enter decryption key to unlock file.", variant: "warning" });
//           return;
//         }
//         fileBlob = await decryptFile(buffer, decryptKey);
//       } else {
//         fileBlob = new Blob([buffer]);
//       }

//       const url = window.URL.createObjectURL(fileBlob);
//       const link = document.createElement("a");
//       link.href = url;
//       let ext = "bin";
//       if (result[5]) {
//         const parts = result[5].split("/");
//         ext = parts.length > 1 ? parts[1] : parts[0];
//         if (ext === "jpeg") ext = "jpg";
//       }
//       link.download = `file.${ext}`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (err) {
//       console.error("Download failed:", err);
//       setStatus({ message: "❌ Failed to download or decrypt file.", variant: "danger" });
//     }
//   };

//   return (
//     <Container className="pt-5">
//       <Card className="p-4 shadow">
//         <h3>🔍 Verify a Shared Hash</h3>
//         <Form>
//           <Form.Group controlId="formHash" className="mb-3">
//             <Form.Label>Enter File or Message Hash</Form.Label>
//             <Form.Control
//               type="text"
//               value={hash}
//               onChange={(e) => setHash(e.target.value)}
//               placeholder="Paste the hash to verify"
//             />
//           </Form.Group>
//           <Button variant="success" onClick={handleVerify} disabled={loading}>
//             {loading ? <Spinner animation="border" size="sm" /> : "Verify"}
//           </Button>
//         </Form>

//         {status.message && (
//           <Alert className="mt-3" variant={status.variant}>
//             {status.message}
//           </Alert>
//         )}

//         {result && (
//           <Card className="mt-4 p-3">
//             <h5>✅ Hash Verified</h5>
//             <p><strong>Sender:</strong> {result[0]}</p>
//             <p><strong>Receiver:</strong> {result[1]}</p>
//             <p><strong>Hash:</strong> {result[2]}</p>
//             <p><strong>Description:</strong> {result[3]}</p>
//             <p><strong>Timestamp:</strong> {result[4] > 0 ? new Date(Number(result[4]) * 1000).toLocaleString() : "Not set"}</p>
//             <p><strong>File Type:</strong> {result[5] || "Unknown"}</p>
//                         {result[6] && result[6].trim().length > 0 && (
//               <Form.Group controlId="decryptKey" className="mb-2">
//                 <Form.Label>🔑 Enter Key to Decrypt</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={decryptKey}
//                   onChange={(e) => setDecryptKey(e.target.value)}
//                   placeholder="Decryption key required for this file"
//                 />
//               </Form.Group>
//             )}

//             <Button variant="primary" onClick={handleDownload}>Download File</Button>
//           </Card>
//         )}
//       </Card>
//     </Container>
//   );
// }

// export default VerifyPage;


// pages/VerifyPage.js (Updated to fetch file from IPFS via Pinata)

// pages/VerifyPage.js (Updated to hide encryption key display)

// import React, { useState } from "react";
// import { Button, Form, Container, Card, Alert, Spinner } from "react-bootstrap";
// import Web3 from "web3";
// import ContractABI from "../contracts/SecureMessage.json";

// function VerifyPage() {
//   const [hash, setHash] = useState("");
//   const [result, setResult] = useState(null);
//   const [status, setStatus] = useState({ message: "", variant: "info" });
//   const [loading, setLoading] = useState(false);
//   const [decryptKey, setDecryptKey] = useState("");

//   const handleVerify = async () => {
//     setStatus({ message: "", variant: "info" });
//     setResult(null);

//     if (!hash.trim()) {
//       setStatus({ message: "❌ Please enter a hash to verify.", variant: "danger" });
//       return;
//     }

//     try {
//       setLoading(true);
//       const web3 = new Web3(window.ethereum);
//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = ContractABI.networks[networkId];
//       const contract = new web3.eth.Contract(ContractABI.abi, deployedNetwork.address);

//       const data = await contract.methods.getMessage(hash).call();
//       setResult(data);
//     } catch (err) {
//       console.error("Verification failed:", err);
//       setStatus({ message: "⚠️ Hash not found on blockchain.", variant: "danger" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const decryptFile = async (encrypted, keyText) => {
//     const encryptedBytes = new Uint8Array(encrypted);
//     const salt = encryptedBytes.slice(0, 16);
//     const iv = encryptedBytes.slice(16, 28);
//     const data = encryptedBytes.slice(28);

//     const keyMaterial = await window.crypto.subtle.importKey(
//       "raw",
//       new TextEncoder().encode(keyText),
//       "PBKDF2",
//       false,
//       ["deriveKey"]
//     );

//     const key = await window.crypto.subtle.deriveKey(
//       {
//         name: "PBKDF2",
//         salt,
//         iterations: 100000,
//         hash: "SHA-256"
//       },
//       keyMaterial,
//       { name: "AES-GCM", length: 256 },
//       false,
//       ["decrypt"]
//     );

//     const decrypted = await window.crypto.subtle.decrypt(
//       { name: "AES-GCM", iv },
//       key,
//       data
//     );

//     return new Blob([decrypted]);
//   };

//   const handleDownload = async () => {
//     if (!hash) return;
//     try {
//       const res = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
//       const buffer = await res.arrayBuffer();

//       let fileBlob;
//       if (result[6] && result[6].trim().length > 0) {
//         if (!decryptKey) {
//           setStatus({ message: "❗ Enter decryption key to unlock file.", variant: "warning" });
//           return;
//         }
//         fileBlob = await decryptFile(buffer, decryptKey);
//       } else {
//         fileBlob = new Blob([buffer]);
//       }

//       const url = window.URL.createObjectURL(fileBlob);
//       const link = document.createElement("a");
//      // MIME to Extension Map
// const mimeMap = {
//   "application/pdf": "pdf",
//   "text/plain": "txt",
//   "image/jpeg": "jpg",
//   "image/png": "png",
//   "image/gif": "gif",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
//   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
//   "application/msword": "doc",
//   "application/vnd.ms-excel": "xls"
// };

// const mimeType = result[5] || "application/octet-stream";
// const ext = mimeMap[mimeType] || "bin";
// link.download = `file.${ext}`;

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (err) {
//       console.error("Download failed:", err);
//       setStatus({ message: "❌ Failed to download or decrypt file.", variant: "danger" });
//     }
//   };

//   return (
//     <Container className="pt-5">
//       <Card className="p-4 shadow">
//         <h3>🔍 Verify a Shared Hash</h3>
//         <Form>
//           <Form.Group controlId="formHash" className="mb-3">
//             <Form.Label>Enter File or Message Hash</Form.Label>
//             <Form.Control
//               type="text"
//               value={hash}
//               onChange={(e) => setHash(e.target.value)}
//               placeholder="Paste the hash to verify"
//             />
//           </Form.Group>
//           <Button variant="success" onClick={handleVerify} disabled={loading}>
//             {loading ? <Spinner animation="border" size="sm" /> : "Verify"}
//           </Button>
//         </Form>

//         {status.message && (
//           <Alert className="mt-3" variant={status.variant}>
//             {status.message}
//           </Alert>
//         )}

//         {result && (
//           <Card className="mt-4 p-3">
//             <h5>✅ Hash Verified</h5>
//             <p><strong>Sender:</strong> {result[0]}</p>
//             <p><strong>Receiver:</strong> {result[1]}</p>
//             <p><strong>Hash:</strong> {result[2]}</p>
//             <p><strong>Description:</strong> {result[3]}</p>
//             <p><strong>Timestamp:</strong> {result[4] > 0 ? new Date(Number(result[4]) * 1000).toLocaleString() : "Not set"}</p>
//             <p><strong>File Type:</strong> {result[5] || "Unknown"}</p>

//             {result[6] && result[6].trim().length > 0 && (
//               <Form.Group controlId="decryptKey" className="mb-2">
//                 <Form.Label>🔑 Enter Key to Decrypt</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={decryptKey}
//                   onChange={(e) => setDecryptKey(e.target.value)}
//                   placeholder="Decryption key required for this file"
//                 />
//               </Form.Group>
//             )}

//             <Button variant="primary" onClick={handleDownload}>Download File</Button>
//           </Card>
//         )}
//       </Card>
//     </Container>
//   );
// }

// export default VerifyPage;

// pages/VerifyPage.js (Updated to fetch file from IPFS via Pinata)

// pages/VerifyPage.js

// import React, { useState, useEffect, useCallback } from "react";
// import { Button, Form, Container, Card, Alert, Spinner } from "react-bootstrap";
// import Web3 from "web3";
// import { useSearchParams } from "react-router-dom";
// import ContractABI from "../contracts/SecureMessage.json";

// function VerifyPage() {
//   const [searchParams] = useSearchParams();
//   const [hash, setHash] = useState("");
//   const [result, setResult] = useState(null);
//   const [status, setStatus] = useState({ message: "", variant: "info" });
//   const [loading, setLoading] = useState(false);
//   const [decryptKey, setDecryptKey] = useState("");

 

//   // ✅ Clean & safe hash verification logic
//  const handleVerify = useCallback(async (inputHash = hash) => {
//   setStatus({ message: "", variant: "info" });
//   setResult(null);

//   if (!inputHash.trim()) {
//     setStatus({ message: "❌ Please enter a hash to verify.", variant: "danger" });
//     return;
//   }

//   try {
//     setLoading(true);
//     const web3 = new Web3(window.ethereum);
//     const networkId = await web3.eth.net.getId();
//     const deployedNetwork = ContractABI.networks[networkId];
//     const contract = new web3.eth.Contract(ContractABI.abi, deployedNetwork.address);

//     const data = await contract.methods.getMessage(inputHash).call();
//     setResult(data);
//   } catch (err) {
//     console.error("Verification failed:", err);
//     setStatus({ message: "⚠ Hash not found on blockchain.", variant: "danger" });
//   } finally {
//     setLoading(false);
//   }
// }, [hash]);

//  // ✅ This effect reads the hash from the URL when the component mounts
//   useEffect(() => {
//   const paramHash = searchParams.get("hash");
//   if (paramHash) {
//     setHash(paramHash);
//     handleVerify(paramHash);
//   }
// }, [searchParams, handleVerify]); // ✅ dependency added

//   const decryptFile = async (encrypted, keyText) => {
//     const encryptedBytes = new Uint8Array(encrypted);
//     const salt = encryptedBytes.slice(0, 16);
//     const iv = encryptedBytes.slice(16, 28);
//     const data = encryptedBytes.slice(28);

//     const keyMaterial = await window.crypto.subtle.importKey(
//       "raw",
//       new TextEncoder().encode(keyText),
//       "PBKDF2",
//       false,
//       ["deriveKey"]
//     );

//     const key = await window.crypto.subtle.deriveKey(
//       {
//         name: "PBKDF2",
//         salt,
//         iterations: 100000,
//         hash: "SHA-256"
//       },
//       keyMaterial,
//       { name: "AES-GCM", length: 256 },
//       false,
//       ["decrypt"]
//     );

//     const decrypted = await window.crypto.subtle.decrypt(
//       { name: "AES-GCM", iv },
//       key,
//       data
//     );

//     return new Blob([decrypted]);
//   };

//   const handleDownload = async () => {
//     if (!hash || !result) return;

//     try {
//       const res = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
//       const buffer = await res.arrayBuffer();

//       let fileBlob;
//       if (result[6] && result[6].trim().length > 0) {
//         if (!decryptKey) {
//           setStatus({ message: "❗ Enter decryption key to unlock file.", variant: "warning" });
//           return;
//         }
//         fileBlob = await decryptFile(buffer, decryptKey);
//       } else {
//         fileBlob = new Blob([buffer]);
//       }

//       const url = window.URL.createObjectURL(fileBlob);
//       const link = document.createElement("a");
//       link.href = url;

//       let ext = "bin";
//       if (result[5]) {
//         const parts = result[5].split("/");
//         ext = parts.length > 1 ? parts[1] : parts[0];
//         if (ext === "jpeg") ext = "jpg";
//       }

//       link.download = `file.${ext}`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (err) {
//       console.error("Download failed:", err);
//       setStatus({ message: "❌ Failed to download or decrypt file.", variant: "danger" });
//     }
//   };

//   return (
//     <Container className="pt-5">
//       <Card className="p-4 shadow">
//         <h3>🔍 Verify a Shared Hash</h3>
//         <Form>
//           <Form.Group controlId="formHash" className="mb-3">
//             <Form.Label>Enter File or Message Hash</Form.Label>
//             <Form.Control
//               type="text"
//               value={hash}
//               onChange={(e) => setHash(e.target.value)}
//               placeholder="Paste the hash to verify"
//             />
//           </Form.Group>
//           <Button variant="success" onClick={() => handleVerify()} disabled={loading}>
//             {loading ? <Spinner animation="border" size="sm" /> : "Verify"}
//           </Button>
//         </Form>

//         {status.message && (
//           <Alert className="mt-3" variant={status.variant}>
//             {status.message}
//           </Alert>
//         )}

//         {result && (
//           <Card className="mt-4 p-3">
//             <h5>✅ Hash Verified</h5>
//             <p><strong>Sender:</strong> {result[0]}</p>
//             <p><strong>Receiver:</strong> {result[1]}</p>
//             <p><strong>Hash:</strong> {result[2]}</p>
//             <p><strong>Description:</strong> {result[3]}</p>
//             <p><strong>Timestamp:</strong> {new Date(Number(result[4]) * 1000).toLocaleString()}</p>
//             <p><strong>File Type:</strong> {result[5] || "Unknown"}</p>

//             {result[6] && result[6].trim().length > 0 && (
//               <Form.Group controlId="decryptKey" className="mb-2">
//                 <Form.Label>🔑 Enter Key to Decrypt</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={decryptKey}
//                   onChange={(e) => setDecryptKey(e.target.value)}
//                   placeholder="Decryption key required for this file"
//                 />
//               </Form.Group>
//             )}

//             <Button variant="primary" onClick={handleDownload}>Download File</Button>
//           </Card>
//         )}
//       </Card>
//     </Container>
//   );
// }

// export default VerifyPage;

// import React, { useState, useEffect, useCallback } from "react";
// import { Button, Form, Container, Card, Alert, Spinner } from "react-bootstrap";
// import Web3 from "web3";
// import { useSearchParams } from "react-router-dom";
// import ContractABI from "../contracts/SecureMessage.json";

// function VerifyPage() {
//   const [searchParams] = useSearchParams();
//   const initialHash = searchParams.get("hash") || "";

//   const [hash, setHash] = useState(initialHash);
//   const [result, setResult] = useState(null);
//   const [status, setStatus] = useState({ message: "", variant: "info" });
//   const [loading, setLoading] = useState(false);
//   const [decryptKey, setDecryptKey] = useState("");




//   const handleVerify = useCallback(async (inputHash = hash) => {
//   setStatus({ message: "", variant: "info" });
//   setResult(null);

//   if (!inputHash.trim()) {
//     setStatus({ message: "❌ Please enter a hash to verify.", variant: "danger" });
//     return;
//   }

//   try {
//     setLoading(true);
//     const web3 = new Web3(window.ethereum);
//     const networkId = await web3.eth.net.getId();
//     const deployedNetwork = ContractABI.networks[networkId];
//     const contract = new web3.eth.Contract(ContractABI.abi, deployedNetwork?.address);

//     // ✅ Safe to log here (after variables are declared)
//     console.log("Calling getMessage with hash:", inputHash);
//     console.log("Contract ABI methods:", Object.keys(contract.methods));
//     console.log("Contract address being used:", deployedNetwork?.address);

//     const data = await contract.methods.getMessage(inputHash).call();
//     setResult(data);
//   } catch (err) {
//     console.error("Verification failed:", err);
//     setStatus({ message: "⚠ Hash not found on blockchain.", variant: "danger" });
//   } finally {
//     setLoading(false);
//   }
// }, [hash]);

//   useEffect(() => {
//     if (initialHash) {
//       setHash(initialHash);
//       handleVerify(initialHash);
//     }
//   }, [initialHash, handleVerify]);

//   const decryptFile = async (encrypted, keyText) => {
//     const encryptedBytes = new Uint8Array(encrypted);
//     const salt = encryptedBytes.slice(0, 16);
//     const iv = encryptedBytes.slice(16, 28);
//     const data = encryptedBytes.slice(28);

//     const keyMaterial = await window.crypto.subtle.importKey(
//       "raw",
//       new TextEncoder().encode(keyText),
//       "PBKDF2",
//       false,
//       ["deriveKey"]
//     );

//     const key = await window.crypto.subtle.deriveKey(
//       {
//         name: "PBKDF2",
//         salt,
//         iterations: 100000,
//         hash: "SHA-256"
//       },
//       keyMaterial,
//       { name: "AES-GCM", length: 256 },
//       false,
//       ["decrypt"]
//     );

//     const decrypted = await window.crypto.subtle.decrypt(
//       { name: "AES-GCM", iv },
//       key,
//       data
//     );

//     return new Blob([decrypted]);
//   };

//   const handleDownload = async () => {
//     if (!hash || !result) return;
//     try {
//       const res = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
//       const buffer = await res.arrayBuffer();

//       let fileBlob;
//       if (result[6] && result[6].trim().length > 0) {
//         if (!decryptKey) {
//           setStatus({ message: "❗ Enter decryption key to unlock file.", variant: "warning" });
//           return;
//         }
//         fileBlob = await decryptFile(buffer, decryptKey);
//       } else {
//         fileBlob = new Blob([buffer]);
//       }

//       const url = window.URL.createObjectURL(fileBlob);
//       const link = document.createElement("a");
//       link.href = url;

//       let ext = "bin";
//       if (result[5]) {
//         const parts = result[5].split("/");
//         ext = parts.length > 1 ? parts[1] : parts[0];
//         if (ext === "jpeg") ext = "jpg";
//       }

//       link.download = `file.${ext}`; 
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (err) {
//       console.error("Download failed:", err);
//       setStatus({ message: "❌ Failed to download or decrypt file.", variant: "danger" });
//     }
//   };

//   return (
//     <Container className="pt-5">
//       <Card className="p-4 shadow">
//         <h3>🔍 Verify a Shared Hash</h3>
//         <Form>
//           <Form.Group controlId="formHash" className="mb-3">
//             <Form.Label>Enter File or Message Hash</Form.Label>
//             <Form.Control
//               type="text"
//               value={hash}
//               onChange={(e) => setHash(e.target.value)}
//               placeholder="Paste the hash to verify"
//             />
//           </Form.Group>
//           <Button variant="success" onClick={() => handleVerify()} disabled={loading}>
//             {loading ? <Spinner animation="border" size="sm" /> : "Verify"}
//           </Button>
//         </Form>

//         {status.message && (
//           <Alert className="mt-3" variant={status.variant}>
//             {status.message}
//           </Alert>
//         )}

//         {result && (
//           <Card className="mt-4 p-3">
//             <h5>✅ Hash Verified</h5>
//             <p><strong>Sender:</strong> {result[0]}</p>
//             <p><strong>Receiver:</strong> {result[1]}</p>
//             <p><strong>Hash:</strong> {result[2]}</p>
//             <p><strong>Description:</strong> {result[3]}</p>
//             <p><strong>Timestamp:</strong> {new Date(Number(result[4]) * 1000).toLocaleString()}</p>
//             <p><strong>File Type:</strong> {result[5] || "Unknown"}</p>

//             {result[6] && result[6].trim().length > 0 && (
//               <Form.Group controlId="decryptKey" className="mb-2">
//                 <Form.Label>🔑 Enter Key to Decrypt</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={decryptKey}
//                   onChange={(e) => setDecryptKey(e.target.value)}
//                   placeholder="Decryption key required for this file"
//                 />
//               </Form.Group>
//             )}

//             <Button variant="primary" onClick={handleDownload}>Download File</Button>
//           </Card>
//         )}
//       </Card>
//     </Container>
//   );
// }

// export default VerifyPage;

// src/Pages/VerifyPage.js

// import React, { useEffect, useState, useCallback } from "react";
// import { Button, Form, Container, Card, Alert, Spinner } from "react-bootstrap";
// import Web3 from "web3";
// import { useSearchParams } from "react-router-dom";
// import ContractABI from "../contracts/SecureMessage.json";

// function VerifyPage() {
//   const [searchParams] = useSearchParams();
//   const [hash, setHash] = useState("");
//   const [result, setResult] = useState(null);
//   const [status, setStatus] = useState({ message: "", variant: "info" });
//   const [loading, setLoading] = useState(false);
//   const [decryptKey, setDecryptKey] = useState("");

//   const handleVerify = useCallback(async (inputHash = hash) => {
//     setStatus({ message: "", variant: "info" });
//     setResult(null);

//     if (!inputHash.trim()) {
//       setStatus({ message: "❌ Please enter a hash to verify.", variant: "danger" });
//       return;
//     }

//     try {
//       setLoading(true);
//       const web3 = new Web3(window.ethereum);
//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = ContractABI.networks[networkId];
//       const contract = new web3.eth.Contract(ContractABI.abi, deployedNetwork.address);

//       const data = await contract.methods.getMessage(inputHash).call();
//       setResult(data);
//     } catch (err) {
//       console.error("Verification failed:", err);
//       setStatus({ message: "⚠️ Hash not found on blockchain.", variant: "danger" });
//     } finally {
//       setLoading(false);
//     }
//   }, [hash]);

//   useEffect(() => {
//     const paramHash = searchParams.get("hash");
//     if (paramHash) {
//       setHash(paramHash);
//       handleVerify(paramHash);
//     }
//   }, [searchParams, handleVerify]);

//   const decryptFile = async (encrypted, keyText) => {
//     const encryptedBytes = new Uint8Array(encrypted);
//     const salt = encryptedBytes.slice(0, 16);
//     const iv = encryptedBytes.slice(16, 28);
//     const data = encryptedBytes.slice(28);

//     const keyMaterial = await window.crypto.subtle.importKey(
//       "raw",
//       new TextEncoder().encode(keyText),
//       "PBKDF2",
//       false,
//       ["deriveKey"]
//     );

//     const key = await window.crypto.subtle.deriveKey(
//       {
//         name: "PBKDF2",
//         salt,
//         iterations: 100000,
//         hash: "SHA-256"
//       },
//       keyMaterial,
//       { name: "AES-GCM", length: 256 },
//       false,
//       ["decrypt"]
//     );

//     const decrypted = await window.crypto.subtle.decrypt(
//       { name: "AES-GCM", iv },
//       key,
//       data
//     );

//     return new Blob([decrypted]);
//   };

//   const handleDownload = async () => {
//     if (!hash || !result) return;
//     try {
//       const res = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
//       const buffer = await res.arrayBuffer();

//       let fileBlob;
//       if (result[6] && result[6].trim().length > 0) {
//         if (!decryptKey) {
//           setStatus({ message: "❗ Enter decryption key to unlock file.", variant: "warning" });
//           return;
//         }
//         fileBlob = await decryptFile(buffer, decryptKey);
//       } else {
//         fileBlob = new Blob([buffer]);
//       }

//       const url = window.URL.createObjectURL(fileBlob);
//       const link = document.createElement("a");
//       link.href = url;

//       let ext = "bin";
//       if (result[5]) {
//         const parts = result[5].split("/");
//         ext = parts.length > 1 ? parts[1] : parts[0];
//         if (ext === "jpeg") ext = "jpg";
//       }
//       link.download = `file.${ext}`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (err) {
//       console.error("Download failed:", err);
//       setStatus({ message: "❌ Failed to download or decrypt file.", variant: "danger" });
//     }
//   };

//   return (
//     <Container className="pt-5">
//       <Card className="p-4 shadow">
//         <h3>🔍 Verify a Shared Hash</h3>
//         <Form>
//           <Form.Group controlId="formHash" className="mb-3">
//             <Form.Label>Enter File or Message Hash</Form.Label>
//             <Form.Control
//               type="text"
//               value={hash}
//               onChange={(e) => setHash(e.target.value)}
//               placeholder="Paste the hash to verify"
//             />
//           </Form.Group>
//           <Button variant="success" onClick={() => handleVerify()} disabled={loading}>
//             {loading ? <Spinner animation="border" size="sm" /> : "Verify"}
//           </Button>
//         </Form>

//         {status.message && (
//           <Alert className="mt-3" variant={status.variant}>
//             {status.message}
//           </Alert>
//         )}

//         {result && (
//           <Card className="mt-4 p-3">
//             <h5>✅ Hash Verified</h5>
//             <p><strong>Sender:</strong> {result[0]}</p>
//             <p><strong>Receiver:</strong> {result[1]}</p>
//             <p><strong>Hash:</strong> {result[2]}</p>
//             <p><strong>Description:</strong> {result[3]}</p>
//             <p><strong>Timestamp:</strong> {new Date(Number(result[4]) * 1000).toLocaleString()}</p>
//             <p><strong>File Type:</strong> {result[5] || "Unknown"}</p>

//             {result[6] && result[6].trim().length > 0 && (
//               <Form.Group controlId="decryptKey" className="mb-2">
//                 <Form.Label>🔑 Enter Key to Decrypt</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={decryptKey}
//                   onChange={(e) => setDecryptKey(e.target.value)}
//                   placeholder="Decryption key required for this file"
//                 />
//               </Form.Group>
//             )}

//             <Button variant="primary" onClick={handleDownload}>Download File</Button>
//           </Card>
//         )}
//       </Card>
//     </Container>
//   );
// }

// export default VerifyPage;
// pages/VerifyPage.js

// import React, { useState, useEffect, useCallback } from "react";
// import { Button, Form, Container, Card, Alert, Spinner } from "react-bootstrap";
// import Web3 from "web3";
// import { useSearchParams } from "react-router-dom";
// import ContractABI from "../contracts/SecureMessage.json";

// function VerifyPage() {
//   const [searchParams] = useSearchParams();
//   const [hash, setHash] = useState("");
//   const [result, setResult] = useState(null);
//   const [status, setStatus] = useState({ message: "", variant: "info" });
//   const [loading, setLoading] = useState(false);
//   const [decryptKey, setDecryptKey] = useState("");

//   // ✅ Reliable handler with memoization
//   const handleVerify = useCallback(
//     async (inputHash = hash) => {
//       setStatus({ message: "", variant: "info" });
//       setResult(null);

//       if (!inputHash.trim()) {
//         setStatus({ message: "❌ Please enter a hash to verify.", variant: "danger" });
//         return;
//       }

//       try {
//         setLoading(true);
//         const web3 = new Web3(window.ethereum);
//         const networkId = await web3.eth.net.getId();
//         const deployedNetwork = ContractABI.networks[networkId];

//         if (!deployedNetwork) {
//           setStatus({ message: "❌ Contract not deployed on current network.", variant: "danger" });
//           return;
//         }

//         const contract = new web3.eth.Contract(ContractABI.abi, deployedNetwork.address);

//         const data = await contract.methods.getMessage(inputHash).call();

//         setResult(data);
//       } catch (err) {
//         console.error("Verification failed:", err);
//         setStatus({ message: "⚠️ Hash not found on blockchain.", variant: "danger" });
//       } finally {
//         setLoading(false);
//       }
//     },
//     [hash]
//   );

//   // ✅ Trigger auto-verify when query param arrives
//   useEffect(() => {
//     const paramHash = searchParams.get("hash");
//     if (paramHash) {
//       setHash(paramHash);
//       handleVerify(paramHash);
//     }
//   }, [searchParams, handleVerify]);

//   const decryptFile = async (encrypted, keyText) => {
//     const encryptedBytes = new Uint8Array(encrypted);
//     const salt = encryptedBytes.slice(0, 16);
//     const iv = encryptedBytes.slice(16, 28);
//     const data = encryptedBytes.slice(28);

//     const keyMaterial = await window.crypto.subtle.importKey(
//       "raw",
//       new TextEncoder().encode(keyText),
//       "PBKDF2",
//       false,
//       ["deriveKey"]
//     );

//     const key = await window.crypto.subtle.deriveKey(
//       {
//         name: "PBKDF2",
//         salt,
//         iterations: 100000,
//         hash: "SHA-256"
//       },
//       keyMaterial,
//       { name: "AES-GCM", length: 256 },
//       false,
//       ["decrypt"]
//     );

//     const decrypted = await window.crypto.subtle.decrypt(
//       { name: "AES-GCM", iv },
//       key,
//       data
//     );

//     return new Blob([decrypted]);
//   };

//   const handleDownload = async () => {
//     if (!hash || !result) return;

//     try {
//       const res = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
//       const buffer = await res.arrayBuffer();

//       let fileBlob;
//       if (result[6] && result[6].trim().length > 0) {
//         if (!decryptKey) {
//           setStatus({ message: "❗ Enter decryption key to unlock file.", variant: "warning" });
//           return;
//         }
//         fileBlob = await decryptFile(buffer, decryptKey);
//       } else {
//         fileBlob = new Blob([buffer]);
//       }

//       const url = window.URL.createObjectURL(fileBlob);
//       const link = document.createElement("a");
//       link.href = url;

//       let ext = "bin";
//       if (result[5]) {
//         const parts = result[5].split("/");
//         ext = parts.length > 1 ? parts[1] : parts[0];
//         if (ext === "jpeg") ext = "jpg";
//       }

//       link.download = `file.${ext}`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (err) {
//       console.error("Download failed:", err);
//       setStatus({ message: "❌ Failed to download or decrypt file.", variant: "danger" });
//     }
//   };

//   return (
//     <Container className="pt-5">
//       <Card className="p-4 shadow">
//         <h3>🔍 Verify a Shared Hash</h3>
//         <Form>
//           <Form.Group controlId="formHash" className="mb-3">
//             <Form.Label>Enter File or Message Hash</Form.Label>
//             <Form.Control
//               type="text"
//               value={hash}
//               onChange={(e) => setHash(e.target.value)}
//               placeholder="Paste the hash to verify"
//             />
//           </Form.Group>
//           <Button variant="success" onClick={() => handleVerify()} disabled={loading}>
//             {loading ? <Spinner animation="border" size="sm" /> : "Verify"}
//           </Button>
//         </Form>

//         {status.message && (
//           <Alert className="mt-3" variant={status.variant}>
//             {status.message}
//           </Alert>
//         )}

//         {result && (
//           <Card className="mt-4 p-3">
//             <h5>✅ Hash Verified</h5>
//             <p><strong>Sender:</strong> {result[0]}</p>
//             <p><strong>Receiver:</strong> {result[1]}</p>
//             <p><strong>Hash:</strong> {result[2]}</p>
//             <p><strong>Description:</strong> {result[3]}</p>
//             <p><strong>Timestamp:</strong> {new Date(Number(result[4]) * 1000).toLocaleString()}</p>
//             <p><strong>File Type:</strong> {result[5] || "Unknown"}</p>

//             {result[6] && result[6].trim().length > 0 && (
//               <Form.Group controlId="decryptKey" className="mb-2">
//                 <Form.Label>🔑 Enter Key to Decrypt</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={decryptKey}
//                   onChange={(e) => setDecryptKey(e.target.value)}
//                   placeholder="Decryption key required for this file"
//                 />
//               </Form.Group>
//             )}

//             <Button variant="primary" onClick={handleDownload}>Download File</Button>
//           </Card>
//         )}
//       </Card>
//     </Container>
//   );
// }

// export default VerifyPage;
import React, { useState, useEffect, useCallback } from "react";
import { Button, Form, Container, Card, Alert, Spinner } from "react-bootstrap";
import Web3 from "web3";
import { useSearchParams } from "react-router-dom";
import ContractABI from "../contracts/SecureMessage.json";

function VerifyPage() {
  const [searchParams] = useSearchParams();
  const [hash, setHash] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({ message: "", variant: "info" });
  const [loading, setLoading] = useState(false);
  const [decryptKey, setDecryptKey] = useState("");

  const handleVerify = useCallback(async (inputHash = hash) => {
    setStatus({ message: "", variant: "info" });
    setResult(null);

    if (!inputHash.trim()) {
      setStatus({ message: "❌ Please enter a hash to verify.", variant: "danger" });
      return;
    }

    try {
      setLoading(true);
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ContractABI.networks[networkId];
      const contract = new web3.eth.Contract(ContractABI.abi, deployedNetwork.address);

      const data = await contract.methods.getMessage(inputHash).call();
      setResult(data);
    } catch (err) {
      console.error("Verification failed:", err);
      setStatus({ message: "⚠️ Hash not found on blockchain.", variant: "danger" });
    } finally {
      setLoading(false);
    }
  }, [hash]);

  useEffect(() => {
    const urlHash = searchParams.get("hash");
    if (urlHash && urlHash !== "undefined") {
      setHash(urlHash);
      handleVerify(urlHash);
    }
  }, [searchParams, handleVerify]);

  // 🔐 AES-GCM File Decryption
  const decryptFile = async (encrypted, keyText) => {
    const encryptedBytes = new Uint8Array(encrypted);
    const salt = encryptedBytes.slice(0, 16);
    const iv = encryptedBytes.slice(16, 28);
    const data = encryptedBytes.slice(28);

    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(keyText),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    return new Blob([decrypted]);
  };

  const handleDownload = async () => {
    if (!hash || !result) return;
    try {
      const res = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
      const buffer = await res.arrayBuffer();

      let fileBlob;
      if (result[6] && result[6].trim().length > 0) {
        if (!decryptKey) {
          setStatus({ message: "❗ Enter decryption key to unlock file.", variant: "warning" });
          return;
        }
        fileBlob = await decryptFile(buffer, decryptKey);
      } else {
        fileBlob = new Blob([buffer]);
      }

      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = url;

      let ext = "bin";
      if (result[5]) {
        const parts = result[5].split("/");
        ext = parts.length > 1 ? parts[1] : parts[0];
        if (ext === "jpeg") ext = "jpg";
      }

      link.download = `file.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
      setStatus({ message: "❌ Failed to download or decrypt file.", variant: "danger" });
    }
  };

  return (
    <Container className="pt-5">
      <Card className="p-4 shadow">
        <h3>🔍 Verify a Shared Hash</h3>
        <Form>
          <Form.Group controlId="formHash" className="mb-3">
            <Form.Label>Enter File or Message Hash</Form.Label>
            <Form.Control
              type="text"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="Paste the hash to verify"
            />
          </Form.Group>
          <Button variant="success" onClick={() => handleVerify()} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Verify"}
          </Button>
        </Form>

        {status.message && (
          <Alert className="mt-3" variant={status.variant}>
            {status.message}
          </Alert>
        )}

        {result && (
          <Card className="mt-4 p-3">
            <h5>✅ Hash Verified</h5>
            <p><strong>Sender:</strong> {result[0]}</p>
            <p><strong>Receiver:</strong> {result[1]}</p>
            <p><strong>Hash:</strong> {result[2]}</p>
            <p><strong>Description:</strong> {result[3]}</p>
            <p><strong>Timestamp:</strong> {new Date(Number(result[4]) * 1000).toLocaleString()}</p>
            <p><strong>File Type:</strong> {result[5] || "Unknown"}</p>

            {result[6] && result[6].trim().length > 0 && (
              <Form.Group controlId="decryptKey" className="mb-2">
                <Form.Label>🔑 Enter Key to Decrypt</Form.Label>
                <Form.Control
                  type="text"
                  value={decryptKey}
                  onChange={(e) => setDecryptKey(e.target.value)}
                  placeholder="Decryption key required for this file"
                />
              </Form.Group>
            )}

            <Button variant="primary" onClick={handleDownload}>Download File</Button>
          </Card>
        )}
      </Card>
    </Container>
  );
}

export default VerifyPage;
