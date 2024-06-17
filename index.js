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
const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

// Function to convert input data to the expected format
const convertInputRecord = (record) => {
    const prescriptionStr = JSON.stringify(record);
    return {
        details: prescriptionStr,
        refID: record.id
    };
};

// Function to convert output data back to the original format
const revertRecord = (record) => {
    const prescriptionObj = JSON.parse(record.details);
    return prescriptionObj;
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

app.listen(8029, () => {
    console.log('Server running on port 8029');
});
