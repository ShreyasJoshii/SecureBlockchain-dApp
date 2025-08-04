// pages/LoginPage.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Card, Spinner } from "react-bootstrap";
import Web3 from "web3";

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const connectWallet = async () => {
    setLoading(true);
    setError("");
    try {
      if (!window.ethereum) {
        setError("Please install MetaMask to continue.");
        setLoading(false);
        return;
      }

      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (!accounts || accounts.length === 0) {
        setError("No accounts found.");
        setLoading(false);
        return;
      }

      localStorage.setItem("walletAddress", accounts[0]);
      navigate("/home");
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setError("Wallet connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <Row>
        <Col>
          <Card className="p-4 text-center">
            <Card.Body>
              <h2 className="mb-4">🔐 Welcome to Secure dApp</h2>
              <p>Connect your MetaMask wallet to get started</p>
              {error && <p className="text-danger mt-2">{error}</p>}
              <Button onClick={connectWallet} disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Connect Wallet"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
