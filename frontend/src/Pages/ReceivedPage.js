// // pages/ReceivedPage.js

// import React, { useEffect, useState } from "react";
// import { Container, Card, ListGroup, Button, Spinner, Alert } from "react-bootstrap";
// import Web3 from "web3";
// import { useNavigate } from "react-router-dom";
// import ContractABI from "../contracts/SecureMessage.json";

// function ReceivedPage() {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState({ message: "", variant: "info" });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const web3 = new Web3(window.ethereum);
//         const accounts = await web3.eth.getAccounts();
//         const myAddress = accounts[0];
//         const networkId = await web3.eth.net.getId();
//         const deployedNetwork = ContractABI.networks[networkId];
//         const contract = new web3.eth.Contract(ContractABI.abi, deployedNetwork.address);

//         const hashes = await contract.methods.getReceivedHashes(myAddress).call();
//         const details = await Promise.all(
//           hashes.map(async (h) => {
//             const msg = await contract.methods.getMessage(h).call();
//             return {
//               hash: msg.contentHash,
//               sender: msg.sender,
//               description: msg.description,
//               timestamp: new Date(Number(msg.timestamp) * 1000).toLocaleString(),
//               fileType: msg.fileType,
//               encryptionKey: msg.encryptionKey,
//             };
//           })
//         );

//         setMessages(details.reverse());
//       } catch (err) {
//         console.error("Failed to fetch messages:", err);
//         setStatus({ message: "❌ Failed to fetch received messages.", variant: "danger" });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMessages();
//   }, []);

//   return (
//     <Container className="pt-5">
//       <Card className="p-4 shadow">
//         <h3>📥 Received Messages</h3>

//         {status.message && (
//           <Alert className="mt-3" variant={status.variant}>
//             {status.message}
//           </Alert>
//         )}

//         {loading ? (
//           <div className="text-center mt-4">
//             <Spinner animation="border" />
//           </div>
//         ) : (
//           <ListGroup className="mt-4">
//             {messages.length === 0 ? (
//               <p>No messages received yet.</p>
//             ) : (
//               messages.map((msg, idx) => (
//                 <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <strong>From:</strong> {msg.sender}<br />
//                     <strong>Time:</strong> {msg.timestamp}<br />
//                     <strong>Description:</strong> {msg.description}<br />
//                     <strong>File Type:</strong> {msg.fileType || "N/A"}
//                   </div>
//                   <Button
//                     variant="primary"
//                     onClick={() => navigate(`/verify?hash=${encodeURIComponent(msg.hash)}`)}
//                   >
//                     Open
//                   </Button>
//                 </ListGroup.Item>
//               ))
//             )}
//           </ListGroup>
//         )}
//       </Card>
//     </Container>
//   );
// }

// export default ReceivedPage;
// src/Pages/ReceivedPage.js

// import React, { useEffect, useState } from "react";
// import { Container, Card, ListGroup, Button, Spinner, Alert } from "react-bootstrap";
// import Web3 from "web3";
// import { useNavigate } from "react-router-dom";
// import ContractABI from "../contracts/SecureMessage.json";

// function ReceivedPage() {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState({ message: "", variant: "info" });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const web3 = new Web3(window.ethereum);
//         const accounts = await web3.eth.getAccounts();
//         const myAddress = accounts[0];
//         const networkId = await web3.eth.net.getId();
//         const deployedNetwork = ContractABI.networks[networkId];
//         const contract = new web3.eth.Contract(ContractABI.abi, deployedNetwork.address);

//         const hashes = await contract.methods.getReceivedHashes(myAddress).call();
//         const details = await Promise.all(
//           hashes.map(async (h) => {
//             const msg = await contract.methods.getMessage(h).call();
//             return {
//               hash: msg.contentHash,
//               sender: msg.sender,
//               description: msg.description,
//               timestamp: new Date(Number(msg.timestamp) * 1000).toLocaleString(),
//               fileType: msg.fileType,
//               encryptionKey: msg.encryptionKey,
//             };
//           })
//         );

//         setMessages(details.reverse());
//       } catch (err) {
//         console.error("Failed to fetch messages:", err);
//         setStatus({ message: "❌ Failed to fetch received messages.", variant: "danger" });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMessages();
//   }, []);

//   return (
//     <Container className="pt-5">
//       <Card className="p-4 shadow">
//         <h3>📥 Received Messages</h3>

//         {status.message && (
//           <Alert className="mt-3" variant={status.variant}>
//             {status.message}
//           </Alert>
//         )}

//         {loading ? (
//           <div className="text-center mt-4">
//             <Spinner animation="border" />
//           </div>
//         ) : (
//           <ListGroup className="mt-4">
//             {messages.length === 0 ? (
//               <p>No messages received yet.</p>
//             ) : (
//               messages.map((msg, idx) => (
//                 <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <strong>From:</strong> {msg.sender}<br />
//                     <strong>Time:</strong> {msg.timestamp}<br />
//                     <strong>Description:</strong> {msg.description}<br />
//                     <strong>File Type:</strong> {msg.fileType || "N/A"}
//                   </div>
//                   <Button
//                     variant="primary"
//                     onClick={() => navigate(`/verify?hash=${encodeURIComponent(msg.hash)}`)}
//                   >
//                     Open
//                   </Button>
//                 </ListGroup.Item>
//               ))
//             )}
//           </ListGroup>
//         )}
//       </Card>
//     </Container>
//   );
// }

// export default ReceivedPage;
// pages/ReceivedPage.js

import React, { useEffect, useState } from "react";
import { Container, Card, ListGroup, Button, Spinner, Alert } from "react-bootstrap";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import ContractABI from "../contracts/SecureMessage.json";

function ReceivedPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ message: "", variant: "info" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const myAddress = accounts[0];

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ContractABI.networks[networkId];
        const contract = new web3.eth.Contract(ContractABI.abi, deployedNetwork.address);

        const hashes = await contract.methods.getReceivedHashes(myAddress).call();

        const details = await Promise.all(
          hashes.map(async (h) => {
            try {
              const msg = await contract.methods.getMessage(h).call();
              return {
                hash: msg.contentHash || msg.contentHashOut || h,
                sender: msg.sender,
                receiver: msg.receiver,
                description: msg.description,
                timestamp: new Date(Number(msg.timestamp) * 1000).toLocaleString(),
                fileType: msg.fileType,
                encryptionKey: msg.encryptionKey
              };
            } catch (err) {
              console.warn("Skipping invalid hash:", h, err);
              return null;
            }
          })
        );

        const validMessages = details.filter((msg) => msg !== null && msg.hash && msg.hash !== "undefined");

        setMessages(validMessages.reverse());
        if (validMessages.length === 0) {
          setStatus({ message: "📫 No valid received messages found.", variant: "info" });
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setStatus({ message: "❌ Failed to fetch received messages.", variant: "danger" });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <Container className="pt-5">
      <Card className="p-4 shadow">
        <h3>📥 Received Messages</h3>

        {status.message && (
          <Alert className="mt-3" variant={status.variant}>
            {status.message}
          </Alert>
        )}

        {loading ? (
          <div className="text-center mt-4">
            <Spinner animation="border" />
          </div>
        ) : (
          <ListGroup className="mt-4">
            {messages.length === 0 ? (
              <p>No messages received yet.</p>
            ) : (
              messages.map((msg, idx) => (
                <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>From:</strong> {msg.sender}<br />
                    <strong>Time:</strong> {msg.timestamp}<br />
                    <strong>Description:</strong> {msg.description}<br />
                    <strong>File Type:</strong> {msg.fileType || "N/A"}
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/verify?hash=${encodeURIComponent(msg.hash)}`)}
                  >
                    Open
                  </Button>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        )}
      </Card>
    </Container>
  );
}

export default ReceivedPage;
