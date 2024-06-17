// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Prescription {
    struct PrescriptionDetail {
        string details;
        uint256 refID;
    }

    mapping (uint256 => PrescriptionDetail) private prescriptions;
    uint256[] private prescriptionKeys;

    function addPrescription(string memory details, uint256 refID) public {
        // Check if the prescription with the given refID already exists
        require(prescriptions[refID].refID == 0, "Prescription with this refID already exists");

        // Create and store the new prescription
        prescriptions[refID] = PrescriptionDetail(details, refID);
        prescriptionKeys.push(refID);
    }

    function getAllPrescriptions() public view returns (PrescriptionDetail[] memory) {
        PrescriptionDetail[] memory allPrescriptions = new PrescriptionDetail[](prescriptionKeys.length);
        for (uint i = 0; i < prescriptionKeys.length; i++) {
            allPrescriptions[i] = prescriptions[prescriptionKeys[i]];
        }
        return allPrescriptions;
    }

    function deletePrescription(uint256 refID) public {
        // Check if the prescription exists
        require(prescriptions[refID].refID != 0, "Prescription not found");

        // Find the index of the prescription key
        uint indexToRemove = 0;
        for (uint i = 0; i < prescriptionKeys.length; i++) {
            if (prescriptionKeys[i] == refID) {
                indexToRemove = i;
                break;
            }
        }

        // Remove the key from the array
        prescriptionKeys[indexToRemove] = prescriptionKeys[prescriptionKeys.length - 1];
        prescriptionKeys.pop();

        // Remove the prescription from the mapping
        delete prescriptions[refID];
    }

    function getPrescriptionRecord(uint256 refID) public view returns (string memory, uint256) {
        // Check if the prescription exists
        require(prescriptions[refID].refID != 0, "Prescription Record not found");
        
        // Return the prescription details
        return (prescriptions[refID].details, prescriptions[refID].refID);
    }
}
