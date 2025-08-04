// // pages/SharePage.js (With Optional AES Encryption)

// import React, { useState } from "react";
// import { Button, Form, Container, Card, Spinner, Alert } from "react-bootstrap";
// import Web3 from "web3";
// import ContractABI from "../contracts/SecureMessage.json";
// import axios from "axios";

// function SharePage() {
//   const [file, setFile] = useState(null);
//   const [description, setDescription] = useState("");
//   const [receiver, setReceiver] = useState("");
//   const [encryptionKey, setEncryptionKey] = useState("");
//   const [status, setStatus] = useState({ message: "", variant: "info" });
//   const [loading, setLoading] = useState(false);

//   const encryptFile = async (fileBuffer, keyText) => {
//     const keyMaterial = await window.crypto.subtle.importKey(
//       "raw",
//       new TextEncoder().encode(keyText),
//       "PBKDF2",
//       false,
//       ["deriveKey"]
//     );

//     const salt = window.crypto.getRandomValues(new Uint8Array(16));
//     const iv = window.crypto.getRandomValues(new Uint8Array(12));

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
//       ["encrypt"]
//     );

//     const encrypted = await window.crypto.subtle.encrypt(
//       { name: "AES-GCM", iv },
//       key,
//       fileBuffer
//     );

//     const encryptedBytes = new Uint8Array([...salt, ...iv, ...new Uint8Array(encrypted)]);
//     return encryptedBytes;
//   };

//   const handleUpload = async () => {
//     setStatus({ message: "", variant: "info" });
//     if (!description.trim() && !file) {
//       setStatus({ message: "❌ Message or file required.", variant: "danger" });
//       return;
//     }

//     try {
//       setLoading(true);
//       let hash = "";
//       let type = "";
//       const formData = new FormData();

//       if (file) {
//         let fileBuffer = await file.arrayBuffer();
//         let processedFile = new Blob([fileBuffer], { type: file.type });

//         if (encryptionKey) {
//           const encrypted = await encryptFile(fileBuffer, encryptionKey);
//           processedFile = new Blob([encrypted], { type: file.type });
//         }

//         formData.append("file", processedFile, file.name);
//         const res = await axios.post("http://localhost:5000/upload", formData);
//         hash = res.data.hash;
//         type = file.type || "unknown";
//       } else {
//         const encoder = new TextEncoder();
//         const encoded = encoder.encode(description);
//         const digest = await crypto.subtle.digest("SHA-256", encoded);
//         hash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
//         type = "text/plain";
//       }

//       const web3 = new Web3(window.ethereum);
//       const accounts = await web3.eth.getAccounts();
//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = ContractABI.networks[networkId];
//       const contract = new web3.eth.Contract(ContractABI.abi, deployedNetwork.address);

//       await contract.methods.uploadMessage(
//         hash,
//         description,
//         type,
//         encryptionKey,
//         receiver || "0x0000000000000000000000000000000000000000"
//       ).send({ from: accounts[0] });

//       setStatus({ message: `✅ Hash stored on blockchain: ${hash}`, variant: "success" });
//       setDescription("");
//       setFile(null);
//       setReceiver("");
//       setEncryptionKey("");
//     } catch (err) {
//       console.error("Upload error:", err);
//       setStatus({ message: "❌ Upload or blockchain transaction failed.", variant: "danger" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="pt-5">
//       <Card className="p-4 shadow">
//         <h3>📤 Share Secure Data</h3>
//         <Form>
//           <Form.Group controlId="formFile" className="mb-3">
//             <Form.Label>Optional File</Form.Label>
//             <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
//           </Form.Group>

//           <Form.Group controlId="formDescription" className="mb-3">
//             <Form.Label>Message / Description</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group controlId="formReceiver" className="mb-3">
//             <Form.Label>Receiver Wallet Address (optional)</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="0x..."
//               value={receiver}
//               onChange={(e) => setReceiver(e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group controlId="formKey" className="mb-3">
//             <Form.Label>File Encryption Key (optional)</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Base64 or Hex encoded key"
//               value={encryptionKey}
//               onChange={(e) => setEncryptionKey(e.target.value)}
//             />
//           </Form.Group>

//           <Button variant="primary" onClick={handleUpload} disabled={loading}>
//             {loading ? <Spinner animation="border" size="sm" /> : "Generate & Save Hash"}
//           </Button>
//         </Form>

//         {status.message && (
//           <Alert className="mt-3" variant={status.variant}>
//             {status.message}
//           </Alert>
//         )}
//       </Card>
//     </Container>
//   );
// }

// export default SharePage;


// pages/SharePage.js (Now Using Pinata IPFS Upload)

import React, { useState } from "react";
import { Button, Form, Container, Card, Spinner, Alert } from "react-bootstrap";
import Web3 from "web3";
import ContractABI from "../contracts/SecureMessage.json";
import axios from "axios";

const PINATA_JWT = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlNGI1ZWQ1YS04NTlmLTRiNjUtYjhjYS00N2M4NmMwMWU2OTciLCJlbWFpbCI6InNocmV5YXNqb3NoaTg4MDVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImQ3MGEwMzNmMTdmOGM5NTE5NDAxIiwic2NvcGVkS2V5U2VjcmV0IjoiZTdjNDg3NTdiMzNmYmI0OTVjYWI0YWRmODZmMTY2MTc4MjZhOTdiZjAxNzBiNmY0ZGVhNGMwNWNhNGU5MGE1ZiIsImV4cCI6MTc3OTc1MzQ2OX0.dZwwOWzWxVqPhAvkbEkgt49mM8fYzpM5g9mCNTSXexY";

function SharePage() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [receiver, setReceiver] = useState("");
  const [encryptionKey, setEncryptionKey] = useState("");
  const [status, setStatus] = useState({ message: "", variant: "info" });
  const [loading, setLoading] = useState(false);

const uploadToPinata = async (fileBlob, filename) => {
  const formData = new FormData();
  formData.append("file", fileBlob, filename);

  const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      pinata_api_key: "ad2db456b46a0cf2bae1",
      pinata_secret_api_key: "d1a5d08cbb31af07b14b3c094512fed0271e43dd766d1dcc43484ca7e78b2eb5"
    }
  });

  return res.data.IpfsHash;
};



  const encryptFile = async (fileBuffer, keyText) => {
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(keyText),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

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
      ["encrypt"]
    );

    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      fileBuffer
    );

    return new Uint8Array([...salt, ...iv, ...new Uint8Array(encrypted)]);
  };

  const handleUpload = async () => {
    setStatus({ message: "", variant: "info" });
    if (!description.trim() && !file) {
      setStatus({ message: "❌ Message or file required.", variant: "danger" });
      return;
    }

    try {
      setLoading(true);
      let hash = "";
      let type = "";

      if (file) {
        let fileBuffer = await file.arrayBuffer();
        let processedFile = new Blob([fileBuffer], { type: file.type });

        if (encryptionKey) {
          const encrypted = await encryptFile(fileBuffer, encryptionKey);
          processedFile = new Blob([encrypted], { type: file.type });
        }

        const cid = await uploadToPinata(processedFile, file.name);
        hash = cid;
        type = file.type || "unknown";
      } else {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(description);
        const digest = await crypto.subtle.digest("SHA-256", encoded);
        hash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
        type = "text/plain";
      }

      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ContractABI.networks[networkId];
      const contract = new web3.eth.Contract(ContractABI.abi, deployedNetwork.address);

      await contract.methods.uploadMessage(
        hash,
        description,
        type,
        encryptionKey,
        receiver.trim() !== "" ? receiver : accounts[0]
      ).send({ from: accounts[0] });

      setStatus({ message: `✅ Hash stored on blockchain: ${hash}`, variant: "success" });
      setDescription("");
      setFile(null);
      setReceiver("");
      setEncryptionKey("");
    } catch (err) {
      console.error("Upload error:", err);
      setStatus({ message: "❌ Upload or blockchain transaction failed.", variant: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="pt-5">
      <Card className="p-4 shadow">
        <h3>📤 Share Secure Data</h3>
        <Form>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Optional File</Form.Label>
            <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
          </Form.Group>

          <Form.Group controlId="formDescription" className="mb-3">
            <Form.Label>Message / Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formReceiver" className="mb-3">
            <Form.Label>Receiver Wallet Address (optional)</Form.Label>
            <Form.Control
              type="text"
              placeholder="0x..."
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formKey" className="mb-3">
            <Form.Label>File Encryption Key (optional)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter key to encrypt file (AES)"
              value={encryptionKey}
              onChange={(e) => setEncryptionKey(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleUpload} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Generate & Save Hash"}
          </Button>
        </Form>

        {status.message && (
          <Alert className="mt-3" variant={status.variant}>
            {status.message}
          </Alert>
        )}
      </Card>
    </Container>
  );
}

export default SharePage;
