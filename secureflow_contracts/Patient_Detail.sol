// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Patient_Detail {
    struct PatientDetail {
        string details;
        uint256 refID;
    }

    mapping (uint256 => PatientDetail) private patientDetails;
    uint256[] private patientDetailKeys;

    function addPatientDetail(string memory details, uint256 refID) public {
        // Check if the patient record with the given refID already exists
        require(patientDetails[refID].refID == 0, "Patient detail with this refID already exists");

        // Create and store the new patient record
        patientDetails[refID] = PatientDetail(details, refID);
        patientDetailKeys.push(refID);
    }

    function getAllPatientDetails() public view returns (PatientDetail[] memory) {
        PatientDetail[] memory allPatientRecords = new PatientDetail[](patientDetailKeys.length);
        for (uint i = 0; i < patientDetailKeys.length; i++) {
            allPatientRecords[i] = patientDetails[patientDetailKeys[i]];
        }
        return allPatientRecords;
    }

    function deletePatientDetail(uint256 refID) public {
        // Check if the patient record exists
        require(patientDetails[refID].refID != 0, "Patient record not found");

        // Find the index of the patient record key
        uint indexToRemove = 0;
        for (uint i = 0; i < patientDetailKeys.length; i++) {
            if (patientDetailKeys[i] == refID) {
                indexToRemove = i;
                break;
            }
        }

        // Remove the key from the array
        patientDetailKeys[indexToRemove] = patientDetailKeys[patientDetailKeys.length - 1];
        patientDetailKeys.pop();

        // Remove the patient detail from the mapping
        delete patientDetails[refID];
    }

    function getPatientDetailRecord(uint256 refID) public view returns (string memory, uint256) {
        // Check if the prescription exists
        require(patientDetails[refID].refID != 0, "Patient record not found");
        
        // Return the patient details
        return (patientDetails[refID].details, patientDetails[refID].refID);
    }
}
