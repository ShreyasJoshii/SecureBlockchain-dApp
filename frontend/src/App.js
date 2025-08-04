// import React, { useEffect, useState } from "react";
// import Web3 from "web3";
// import axios from "axios";
// import ContractABI from "./contracts/SecureMessage.json";

// function App() {
//   const [web3, setWeb3] = useState(null);
//   const [account, setAccount] = useState("");
//   const [contract, setContract] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [description, setDescription] = useState("");

//   const [verifyHash, setVerifyHash] = useState("");
//   const [statusMessage, setStatusMessage] = useState("");
//   const [result, setResult] = useState(null);
  
//   // Connect to MetaMask + Blockchain
//  useEffect(() => {
//   console.log("🚀 useEffect running...");

//   const loadWeb3AndContract = async () => {
//   try {
//     if (!window.ethereum) {
//       alert("Please install MetaMask to use this application.");
//       return;
//     }

//     const web3Instance = new Web3(window.ethereum);
//     console.log("🌐 Web3 instance created");

//     // Try connecting to MetaMask
//     let accounts = [];
//     try {
//       accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
//       console.log("🦊 MetaMask connected");
//     } catch (err) {
//       console.error("❌ User denied MetaMask connection:", err);
//       setStatusMessage("❌ MetaMask connection required.");
//       return;
//     }

//     if (!accounts || accounts.length === 0) {
//       console.error("❌ No accounts received from MetaMask.");
//       setStatusMessage("❌ Please unlock MetaMask and connect an account.");
//       return;
//     }

//     console.log("👛 Accounts:", accounts);
//     setAccount(accounts[0]);
//     setWeb3(web3Instance);

//    const networkId = (await web3Instance.eth.net.getId()).toString();
// console.log("🧠 Detected network ID:", networkId);


//     const deployedNetwork = ContractABI.networks[networkId];

//     if (!deployedNetwork) {
//       console.error("❌ Smart contract not found for network ID:", networkId);
//       alert("Smart contract not deployed on this network.");
//       return;
//     }

//     const contractInstance = new web3Instance.eth.Contract(
//       ContractABI.abi,
//       deployedNetwork.address
//     );

//     console.log("✅ Contract loaded at address:", deployedNetwork.address);
//     setContract(contractInstance);
//   } catch (error) {
//     console.error("❌ Error setting up Web3 or loading contract:", error);
//     setStatusMessage("❌ Error connecting to MetaMask or contract. See console.");
//   }
// };


//   loadWeb3AndContract();
// }, []);



//   // Handle file input
//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//     setStatusMessage("");
//   };

//  const handleUpload = async () => {
//   console.log("📁 Selected file:", selectedFile);

//   if (!contract) {
//     setStatusMessage("❌ Smart contract not loaded.");
//     return;
//   }

//   if (!selectedFile) {
//     setStatusMessage("❌ Please select a file before uploading.");
//     return;
//   }

//   const formData = new FormData();
//   formData.append("file", selectedFile);

//   try {
//     const response = await axios.post("http://localhost:5000/upload", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     const { hash } = response.data;
//     console.log("📦 File hash from backend:", hash);

//     console.log("📤 Uploading hash to blockchain...");
//     await contract.methods.uploadMessage(hash, description).send({ from: account });
//     console.log("✅ Transaction confirmed for hash:", hash);

//     setStatusMessage(`✅ File uploaded. Hash stored: ${hash}`);
//     setSelectedFile(null);
//     setDescription("");
//     setResult(null);
//   } catch (error) {
//     console.error("❌ Upload or blockchain error:", error);
//     setStatusMessage("❌ Upload or blockchain transaction failed.");
//   }
// };


// const handleLookup = async () => {
//   if (!contract || !verifyHash) {
//     setStatusMessage("❌ Please enter a hash to verify.");
//     return;
//   }

//   try {
//     console.log("🔍 Looking up hash:", verifyHash);
//     const data = await contract.methods.getMessage(verifyHash).call();
//     console.log("✅ Data returned:", data);
//     setResult(data);
//     setStatusMessage("");
//   } catch (err) {
//     console.error("❌ Verification failed:", err);
//     setResult(null);
//     setStatusMessage("⚠️ Hash not found on blockchain.");
//   }
// };



//   // Download file by hash
//   const handleDownload = () => {
//     if (!verifyHash) {
//       setStatusMessage("Please enter a hash to download.");
//       return;
//     }
//     window.open(`http://localhost:5000/download/${verifyHash}`, "_blank");
//   };

//   return (
//     <div style={{ padding: 30, fontFamily: "Arial" }}>
//       <h1>Secure File Sharing (Hash-Based)</h1>
//       <p><strong>Connected Wallet:</strong> {account}</p>

//       <hr />

//       <h2>Upload File & Save Hash</h2>
//       <input type="file" onChange={handleFileChange} />
//       <br /><br />
//       <textarea
//         placeholder="Enter description"
//         rows={3}
//         cols={60}
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//       />
//       <br /><br />
//       <button onClick={handleUpload}>📤 Upload & Save Hash</button>

//       <hr style={{ margin: "40px 0" }} />

//       <h2>Verify Received Hash</h2>
//       <input
//         type="text"
//         placeholder="Paste file hash"
//         style={{ width: "400px" }}
//         value={verifyHash}
//         onChange={(e) => setVerifyHash(e.target.value)}
//       />
//       <br /><br />
//       <button onClick={handleLookup}>🔍 Verify</button>
//       &nbsp;&nbsp;
//       <button onClick={handleDownload}>📥 Download File</button>

//       {statusMessage && (
//         <p style={{ color: "blue", marginTop: 20 }}>
//           <strong>{statusMessage}</strong>
//         </p>
//       )}

//       {result && (
//         <div style={{ marginTop: 30 }}>
//           <h3>Hash Details</h3>
//           <p><strong>Sender:</strong> {result[0]}</p>
//           <p><strong>Hash:</strong> {result[1]}</p>
//           <p><strong>Description:</strong> {result[2]}</p>
//           <p><strong>Timestamp:</strong> {new Date(Number(result[3]) * 1000).toLocaleString()}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


// import React, { useEffect, useState } from "react";
// import Web3 from "web3";
// import axios from "axios";
// import ContractABI from "./contracts/SecureMessage.json";

// function App() {
//   const [web3, setWeb3] = useState(null);
//   const [account, setAccount] = useState("");
//   const [contract, setContract] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [description, setDescription] = useState("");
//   const [verifyHash, setVerifyHash] = useState("");
//   const [statusMessage, setStatusMessage] = useState("");
//   const [statusColor, setStatusColor] = useState("blue");
//   const [result, setResult] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const loadWeb3AndContract = async () => {
//       try {
//         if (!window.ethereum) {
//           alert("Please install MetaMask.");
//           return;
//         }

//         const web3Instance = new Web3(window.ethereum);
//         const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
//         const networkId = (await web3Instance.eth.net.getId()).toString();
//         const deployedNetwork = ContractABI.networks[networkId];

//         if (!deployedNetwork) {
//           alert("Smart contract not deployed on this network.");
//           return;
//         }

//         const contractInstance = new web3Instance.eth.Contract(
//           ContractABI.abi,
//           deployedNetwork.address
//         );

//         setWeb3(web3Instance);
//         setAccount(accounts[0]);
//         setContract(contractInstance);
//       } catch (error) {
//         console.error("Web3 setup error:", error);
//         setStatusMessage("❌ Web3 setup failed.");
//         setStatusColor("red");
//       }
//     };

//     loadWeb3AndContract();
//   }, []);

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//     setStatusMessage("");
//   };

//   const handleUpload = async () => {
//     if (!contract) return showStatus("❌ Smart contract not loaded.", "red");
//     if (!selectedFile) return showStatus("❌ Please select a file.", "red");

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       setIsLoading(true);
//       setStatusMessage("⏳ Uploading file and saving to blockchain...");
//       setStatusColor("blue");

//       const response = await axios.post("http://localhost:5000/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const { hash } = response.data;

//       await contract.methods.uploadMessage(hash, description).send({ from: account });

//       showStatus(`✅ File uploaded. Hash stored: ${hash}`, "green");
//       setSelectedFile(null);
//       setDescription("");
//       setResult(null);
//     } catch (error) {
//       console.error("Upload or blockchain error:", error);
//       showStatus("❌ Upload or blockchain transaction failed.", "red");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLookup = async () => {
//     if (!contract || !verifyHash) return showStatus("❌ Please enter a hash to verify.", "red");

//     try {
//       setIsLoading(true);
//       showStatus("🔍 Verifying hash on blockchain...", "blue");
//       const data = await contract.methods.getMessage(verifyHash).call();
//       setResult(data);
//       setStatusMessage("");
//     } catch (err) {
//       console.error("Verification failed:", err);
//       setResult(null);
//       showStatus("⚠️ Hash not found on blockchain.", "red");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDownload = () => {
//     if (!verifyHash) return showStatus("❌ Please enter a hash to download.", "red");
//     window.open(`http://localhost:5000/download/${verifyHash}`, "_blank");
//   };

//   const handleCopyHash = () => {
//     if (result && result[1]) {
//       navigator.clipboard.writeText(result[1]);
//       showStatus("📋 Hash copied to clipboard!", "green");
//     }
//   };

//   const showStatus = (msg, color = "blue") => {
//     setStatusMessage(msg);
//     setStatusColor(color);
//   };

//   return (
//     <div style={{ padding: 30, fontFamily: "Arial" }}>
//       <h1>🔐 Secure File Sharing via Blockchain</h1>
//       <p><strong>Connected Wallet:</strong> {account || "Not connected"}</p>

//       <hr />

//       <h2>📤 Upload File & Save Hash</h2>
//       <input type="file" onChange={handleFileChange} />
//       <br /><br />
//       <textarea
//         placeholder="Enter description"
//         rows={3}
//         cols={60}
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//       />
//       <br /><br />
//       <button onClick={handleUpload} disabled={isLoading}>
//         {isLoading ? "Uploading..." : "Upload & Save Hash"}
//       </button>

//       <hr style={{ margin: "40px 0" }} />

//       <h2>🔍 Verify Received Hash</h2>
//       <input
//         type="text"
//         placeholder="Paste file hash"
//         style={{ width: "400px" }}
//         value={verifyHash}
//         onChange={(e) => setVerifyHash(e.target.value)}
//       />
//       <br /><br />
//       <button onClick={handleLookup} disabled={isLoading}>
//         {isLoading ? "Verifying..." : "Verify"}
//       </button>
//       &nbsp;&nbsp;
//       <button onClick={handleDownload} disabled={isLoading}>Download File</button>

//       {statusMessage && (
//         <p style={{ color: statusColor, marginTop: 20 }}>
//           <strong>{statusMessage}</strong>
//         </p>
//       )}

//       {result && (
//         <div style={{ marginTop: 30 }}>
//           <h3>📄 Verified Hash Details</h3>
//           <p><strong>Sender:</strong> {result[0]}</p>
//           <p><strong>Hash:</strong> {result[1]} &nbsp;
//             <button onClick={handleCopyHash}>📋 Copy</button>
//           </p>
//           <p><strong>Description:</strong> {result[2]}</p>
//           <p><strong>Timestamp:</strong> {new Date(Number(result[3]) * 1000).toLocaleString()}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


// App.js - main routing setup for the dApp

// App.js - main routing setup for the dApp

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import LandingPage from "./Pages/LandingPage";
import SharePage from "./Pages/SharePage";
import VerifyPage from "./Pages/VerifyPage";
import ReceivedPage from "./Pages/ReceivedPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/share" element={<SharePage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/received" element={<ReceivedPage />} />
      </Routes>
    </Router>
  );
}

export default App;
