const ethers = require('ethers');
require('dotenv').config();
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const { abi } = require("./artifacts/contracts/blochealth.sol/PrescriptionContract.json");
const contractInstance = new ethers.Contract(contractAddress, abi, signer);

const express = require('express');
const app = express();
app.use(express.json());

app.post('/addPrescription', async (req, res) => {
    try{
        const record = req.body;
        const {details, refID} = record;
        const tx = await contractInstance.addPrescription(details, refID);
        await tx.wait();
        res.send("Added successfully");
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/getAllPrescription', async (req, res) => {
    try {
        const prescription = await contractInstance.getAllPrescription();
        res.send(prescription);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(8029, () => {
    console.log('Server running on port 3000');
});