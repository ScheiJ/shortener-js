const express = require('express');
const admin = require("firebase-admin");
require('dotenv').config();

const app = express();

const serviceAccount = {
    type: "service_account",
    project_id: "shortener-js",
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// db.collection('urls').doc();
// ref = db.collection('urls').get();



app.get('*', async (req, res) => {
    const path = req.path.substring(1);
    const getRedirectUrl = await db.collection('urls').get(path);

    let url = ''; 
    getRedirectUrl.forEach(urlFromDatabase => {
        const to = urlFromDatabase.data().to;
        const from = urlFromDatabase.data().from;

        if(from === path){
            url = to;
        }
    })
    console.log('Redirect to ' +  url);
    res.redirect(url);
})


app.listen(8000, () => {
    console.log("server listening on port 8000")
});