// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

contract Migrations {
    address public owner = msg.sender;
    uint public last_completed_migration;

    function setCompleted(uint completed) public {
        require(msg.sender == owner, "Only owner can complete migration");
        last_completed_migration = completed;
    }
}
