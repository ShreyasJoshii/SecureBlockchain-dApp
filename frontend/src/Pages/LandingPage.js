// pages/LandingPage.js

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Container, Row, Col, Button, Card } from "react-bootstrap";

// function LandingPage() {
//   const navigate = useNavigate();
//   const walletAddress = localStorage.getItem("walletAddress");

//   return (
//     <Container className="vh-100 d-flex flex-column justify-content-center align-items-center">
//       <h2 className="mb-4">Welcome, {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</h2>
//       <Row className="gap-3">
//         <Col>
//           <Card className="p-4 text-center shadow">
//             <Card.Body>
//               <h4>📤 Share a Secure Message</h4>
//               <p>Upload a file and attach a message. Get a verifiable hash.</p>
//               <Button variant="primary" onClick={() => navigate("/share")}>Go to Share</Button>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col>
//           <Card className="p-4 text-center shadow">
//             <Card.Body>
//               <h4>🔍 Verify a Message</h4>
//               <p>Paste a hash to verify sender, timestamp, and download if attached.</p>
//               <Button variant="success" onClick={() => navigate("/verify")}>Go to Verify</Button>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default LandingPage;

// pages/LandingPage.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Card } from "react-bootstrap";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Container className="pt-5">
      <Card className="p-4 shadow text-center">
        <h2>🔐 Welcome to Secure Blockchain Sharing</h2>
        <p>Select what you want to do:</p>
        <div className="d-grid gap-3 col-6 mx-auto mt-4">
          <Button variant="primary" size="lg" onClick={() => navigate("/share")}>
            📤 Share
          </Button>
          <Button variant="success" size="lg" onClick={() => navigate("/verify")}>
            ✅ Verify
          </Button>
          <Button variant="info" size="lg" onClick={() => navigate("/received")}>
            📥 Received
          </Button>
        </div>
      </Card>
    </Container>
  );
}

export default LandingPage;
