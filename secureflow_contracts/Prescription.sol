// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Prescription {
    struct PrescriptionDetail {
        string details;
        uint256 refID;
    }

    mapping (uint256 => PrescriptionDetail) public prescriptions;
    PrescriptionDetail[] public prescriptionArray;

    function addPrescription(string memory details, uint256 refID) public {
        prescriptionArray.push(PrescriptionDetail(details,refID));
    }

    function getAllPrescription() public view returns (PrescriptionDetail[] memory){ 
        return prescriptionArray;
    }