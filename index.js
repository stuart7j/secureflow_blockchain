const ethers = require('ethers');
require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const { abi } = require("./artifacts/contracts/Prescription.sol/Prescription.json");
const { abi1 } = require("./artifacts/contracts/Prescription.sol/Patient_Detail.json");
const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
const contractInstance2 = new ethers.Contract("0xa9BeF6Ab858e9EF3bea99fABb39Fc2E6243B4093", abi1, signer)

// Function to convert input data to the expected format
const convertInputRecord = (record) => {
    const prescriptionStr = JSON.stringify(record);
    return {
        details: prescriptionStr,
        refID: record.id
    };
};

// Function to convert input data to the expected format
const convertPatientDetailRecord = (record) => {
    const patientDetailStr = JSON.stringify(record);
    return {
        details: patientDetailStr,
        refID: record.id
    };
};

// Function to convert output data back to the original format
const revertRecord = (record) => {
    const prescriptionObj = JSON.parse(record.details);
    return prescriptionObj;
};

const revertPatientDetailRecord = (record) => {
    const patientDetailObj = JSON.parse(record.details);
    return patientDetailObj;
};

app.post('/addPrescription', async (req, res) => {
    try {
        const convertedRecord = convertInputRecord(req.body);
        const { details, refID } = convertedRecord;
        const tx = await contractInstance.addPrescription(details, refID, {
            gasLimit: 3000000 // Setting gas limit
        });
        await tx.wait();
        res.send("Added successfully");
    } catch (error) {
        console.error(`Error adding prescription: ${error.message}`);
        res.status(500).send(`Error adding prescription: ${error.message}`);
    }
});

app.post('/addPatientDetail', async (req, res) => {
    try {
        const convertedRecord = convertPatientDetailRecord(req.body);
        const { details, refID } = convertedRecord;
        const tx = await contractInstance2.addPatientDetail(details, refID, {
            gasLimit: 3000000 // Setting gas limit
        });
        await tx.wait();
        res.send("Added patient detail successfully");
    } catch (error) {
        console.error(`Error adding patient detail: ${error.message}`);
        res.status(500).send(`Error adding patient detail: ${error.message}`);
    }
});

app.get('/getAllPrescriptions', async (req, res) => {
    try {
        const prescription = await contractInstance.getAllPrescriptions();
        const records = prescription.map(record => ({
            details: record.details,
            refID: parseInt(record.refID)
        }));
        console.log(records);
        res.send(records.map(revertRecord));
    } catch (error) {
        console.error(`Error fetching all prescriptions: ${error.message}`);
        res.status(500).send(`Error fetching all prescriptions: ${error.message}`);
    }
});

app.get('/getAllPatientDetails', async (req, res) => {
    try {
        const patient_detail = await contractInstance2.getAllPatientDetails();
        const patientRecords = patient_detail.map(record => ({
            details: record.details,
            refID: parseInt(record.refID)
        }));
        console.log(patientRecords);
        res.send(patientRecords.map(revertPatientDetailRecord));
    } catch (error) {
        console.error(`Error fetching all patient detail: ${error.message}`);
        res.status(500).send(`Error fetching all patient detail: ${error.message}`);
    }
});

app.get('/getPrescriptionRecord/:refID', async (req, res) => {
    try {
        const refID = req.params.refID;
        const record = await contractInstance.getPrescriptionRecord(refID);
        const rec = {
            details: record[0],
            refID: parseInt(record[1])
        };
        res.send(revertRecord(rec));
    } catch (error) {
        console.error(`Error fetching prescription record: ${error.message}`);
        res.status(500).send(`Error fetching prescription record: ${error.message}`);
    }
});

app.get('/getPatientDetailRecord/:refID', async (req, res) => {
    try {
        const refID = req.params.refID;
        const patientRecord = await contractInstance2.getPatientDetailRecord(refID);
        const rec = {
            details: patientRecord[0],
            refID: parseInt(patientRecord[1])
        };
        res.send(revertPatientDetailRecord(rec));
    } catch (error) {
        console.error(`Error fetching patient detail record: ${error.message}`);
        res.status(500).send(`Error fetching patient detail record: ${error.message}`);
    }
});

app.delete('/deleteRecord/:refID', async (req, res) => {
    try {
        const refID = req.params.refID; // Extract refID from the URL path
        const tx = await contractInstance.deletePrescription(refID, {
            gasLimit: 3000000 // Setting gas limit
        });
        await tx.wait();
        res.json({ success: true });
    } catch (error) {
        console.error(`Error deleting prescription: ${error.message}`);
        res.status(500).send(`Error deleting prescription: ${error.message}`);
    }
});

app.delete('/deletePatientDetail/:refID', async (req, res) => {
    try {
        const refID = req.params.refID; // Extract refID from the URL path
        const tx = await contractInstance2.deletePatientDetail(refID, {
            gasLimit: 3000000 // Setting gas limit
        });
        await tx.wait();
        res.json({ success: true });
    } catch (error) {
        console.error(`Error deleting patient detail: ${error.message}`);
        res.status(500).send(`Error deleting patient detail: ${error.message}`);
    }
});

app.listen(8029, () => {
    console.log('Server running on port 8029');
});
