// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract SecureMessage {
    struct Message {
        address sender;
        address receiver;
        string contentHash;
        string description;
        uint timestamp;
        string fileType;
        string encryptionKey;
    }

    // Mapping from hash to full message struct
    mapping(string => Message) public messages;

    // NEW: Mapping to track all hashes received by a user
    mapping(address => string[]) public receivedHashes;

    // Event for frontend
    event MessageUploaded(
        address indexed sender,
        address indexed receiver,
        string contentHash,
        string description,
        uint timestamp,
        string fileType,
        string encryptionKey
    );

    function uploadMessage(
        string memory contentHash,
        string memory description,
        string memory fileType,
        string memory encryptionKey,
        address receiver
    ) public {
        require(bytes(contentHash).length > 0, "Content hash is required");
        require(messages[contentHash].timestamp == 0, "Hash already exists");

        messages[contentHash] = Message({
            sender: msg.sender,
            receiver: receiver,
            contentHash: contentHash,
            description: description,
            timestamp: block.timestamp,
            fileType: fileType,
            encryptionKey: encryptionKey
        });

        // ✅ Track this message under the receiver
        receivedHashes[receiver].push(contentHash);

        emit MessageUploaded(
            msg.sender,
            receiver,
            contentHash,
            description,
            block.timestamp,
            fileType,
            encryptionKey
        );
    }

    function getMessage(string memory contentHash)
        public
        view
        returns (
            address sender,
            address receiver,
            string memory contentHashOut,
            string memory description,
            uint timestamp,
            string memory fileType,
            string memory encryptionKey
        )
    {
        Message memory msgStruct = messages[contentHash];
        require(msgStruct.timestamp != 0, "Message not found");

        return (
            msgStruct.sender,
            msgStruct.receiver,
            msgStruct.contentHash,
            msgStruct.description,
            msgStruct.timestamp,
            msgStruct.fileType,
            msgStruct.encryptionKey
        );
    }

    // ✅ NEW: Retrieve all hashes sent to a specific user
    function getReceivedHashes(address user) public view returns (string[] memory) {
        return receivedHashes[user];
    }
}
