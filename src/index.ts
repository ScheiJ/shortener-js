import { Request, Response } from "express";
import { ServiceAccount, Url } from "./models";

const express = require('express');
const admin = require("firebase-admin");
require('dotenv').config();

const app = express();

const serviceAccount: ServiceAccount = {
    type: "service_account",
    project_id: "shortener-js",
    private_key_id: process.env.private_key_id as string,
    private_key: process.env.private_key as string,
    client_email: process.env.client_email as string,
    client_id: process.env.client_id as string,
    auth_uri: process.env.auth_uri as string,
    token_uri: process.env.token_uri as string,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url as string,
    client_x509_cert_url: process.env.client_x509_cert_url as string
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

app.get('*', async (req: Request, res: Response) => {
    const path = req.path.substring(1);
    const getRedirectUrl = await db.collection('urls').doc(path).get();

    let url = ''; 
    const to: string = getRedirectUrl.data().to;
    const from: string = getRedirectUrl.data().from;

    if(from === path){
        url = to;
    }
    console.log('Redirect to ' +  url);
    res.redirect(url);
})

app.listen(8000, () => {
    console.log("server listening on port 8000")
});