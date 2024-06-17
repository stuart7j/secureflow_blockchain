// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Prescription {
    struct PrescriptionDetail {
        string details;
        uint256 refID;
    }

    PrescriptionDetail public removeMe;

    mapping (uint256 => PrescriptionDetail) public prescriptions;
    PrescriptionDetail[] public prescriptionArray;

    function addPrescription(string memory details, uint256 refID) public {
        prescriptionArray.push(PrescriptionDetail(details,refID));
    }

    function getAllPrescription() public view returns (PrescriptionDetail[] memory){ 
        return prescriptionArray;
    }
    
    function deletePrescription(uint256 refID) public {
    // Iterate through the prescription array
    for (uint i = 0; i < prescriptionArray.length; i++) {
        // Check if the refID matches
        if (prescriptionArray[i].refID == refID) {
            removeMe = prescriptionArray[i];
            prescriptionArray[i] = prescriptionArray[prescriptionArray.length-1];
            prescriptionArray[prescriptionArray.length - 1] = removeMe;
            // Remove the last element from the array
            prescriptionArray.pop();
            // Return as the prescription is successfully deleted
            return;
        }
    }
    
    // If the prescription with the given refID is not found, revert the transaction
    revert("Prescription not found");
}
}