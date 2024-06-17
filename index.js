const ethers = require('ethers');
require('dotenv').config();
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const { abi } = require("./artifacts/contracts/Prescription.sol/Prescription.json");
const contractInstance = new ethers.Contract(contractAddress, abi, signer);

const express = require('express');
const app = express();
app.use(express.json());


// Function to convert input data to the expected format
const convertInputRecord = (record) => {
    const prescriptionStr = JSON.stringify(record);

    const convertedRecord = {
        details: prescriptionStr,
        refID: record.id
    };

    return convertedRecord;
};

// Function to convert output data back to the original format
const revertRecord = (record) => {
    const prescriptionObj = JSON.parse(record.details);

    return prescriptionObj;
};

app.post('/addPrescription', async (req, res) => {
    try{
        const convertedRecord = convertInputRecord(req.body);
        const {details, refID} = convertedRecord;
        const tx = await contractInstance.addPrescription(details, refID);
        await tx.wait();
        res.send("Added successfully");
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/getAllPrescriptions', async (req, res) => {
    try {
        const prescription = await contractInstance.getAllPrescription();
        // const records = allRecords.map(record => ({
        //res.send(prescription);
        const records = prescription.map(record => ({
            details: record[0],
            refID: parseInt(record[1])
        }));
        console.log(records);
        res.send(records.map(revertRecord));
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

app.delete('/deleteRecord/:refID', async (req, res) => {
    try {
        const refID = req.params.refID; // Extract refID from the URL path
        const tx = await contractInstance.deletePrescription(refID);
        await tx.wait();
        res.json({ success: true });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(8029, () => {
    console.log('Server running on port 8029');
});
