const express = require('express')
const { doc } = require('prettier')
var CryptoJS = require("crypto-js");
const router = express.Router()
const { ethers, providers } = require('ethers');
// require('dotenv').config()
const brangeContractABI = require('../../abi/BrangeContractABI.json')
const brangeContract = "0x3cC61530FB4ebE35078e4A79167e0e099CC8206d"
const signer = new ethers.Wallet(
    // process.env.PRIVATE_KEY,
    "2fe99df4dd62a2699357ce2912a4144fe5210123870d904555b2c54f28d9722b",
    providers.getDefaultProvider('https://bsc-dataseed1.ninicoin.io')
);

const contract = new ethers.Contract(brangeContract, brangeContractABI, signer);


// Invitation Models
const Refer = require('../../models/Refer')
const Count = require('../../models/Count')

//@rout  POST api/Create
//desc   Create an Wallet
//access Public
router.post('/refer/getLink', async (req, res) => {
    console.log("-------------")
    let refer = new Refer(req.body);
    console.log(refer)
    console.log(refer.sender)
    console.log(refer.receiver)
    try{
        //check receiver account
        let docs = await Refer.find({ receiver: refer.receiver });
        console.log("receiver", docs.length)
        if(docs.length != 0){
            return res.status(400).json("Account has already existed")
        }
        //check sender account if receiver is wallet
        // console.log("sender", docs.length)
        docs = await Refer.find({ receiver: refer.sender, sender:refer.receiver });
        if(docs.length != 0){
            return res.status(400).json("Illegal invitation")
        }
        //generate link
          // Encrypt
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(refer), 'brange@finance').toString();
        console.log('Encrypt Data -')
        //console.log(ciphertext);
        var dataString = ciphertext.replace(/\+/g,'p1L2u3S').replace(/\//g,'s1L2a3S4h').replace(/=/g,'e1Q2u3A4l');
        console.log(dataString);

        res.status(200).json({'refer': 'refer added successfully','link':dataString});
    } catch(e){
        return res.status(400).json(e)
    }
    
})

//@rout  POST api/Create
//desc   Create an Wallet
//access Public
router.post('/refer/save', async (req, res) => {
    console.log("save---->")
    let invite = req.body;
    // Back to Original Text
    let ciphertext = invite.link.replace(/p1L2u3S/g, '+' ).replace(/s1L2a3S4h/g, '/').replace(/e1Q2u3A4l/g, '=');
    console.log(ciphertext);
    
    try{
        // Decrypt
        console.log("This is test")
        var bytes = CryptoJS.AES.decrypt(ciphertext, 'brange@finance');
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        // //log decrypted Data
        console.log('decrypted Data -')
        console.log(decryptedData);
        
        res.status(200).json({'invte': 'invited successfully','data':decryptedData});
    } catch(e){
        return res.status(400).json(e)
    }
    
})

router.post('/refer/apply', async (req, res) => {
    console.log("-------------")
    try{
       
         let refer = new Refer(req.body);
            console.log(refer)
            console.log(refer.sender)
            console.log(refer.receiver)
        //set inviter in brange contract
        const dataList = await contract.setInviter(refer.sender, refer.receiver)
            //save
           await refer.save()
        //----------------
        let docs = await Count.find({ account: refer.sender});
        console.log("Count", docs);
        if(docs.length != 0){
            console.log("update", docs[0].count)
            let number = docs[0].count + 1;
            console.log(number)
            const filter = { account: refer.sender };
            const update = { count: number };
            let doc = await Count.findOneAndUpdate(filter, update);
        }else{
            console.log("create")
            let count  = new Count ({
                account : refer.sender,
                count : 1
            })
            await count.save()
        }
        res.status(200).json({'join': 'Joined successfully'});
    } catch(e){
        return res.status(400).json(e)
    }
})

router.post('/refer/getCount', async (req, res) => {
    let refer = new Refer(req.body);
    console.log(refer.sender)
    try{
        let docs = await Count.find({ account: refer.sender});
        console.log("Count", docs);
        console.log("Count", docs);
        let count = 0;
        if(docs.length != 0){
            console.log("update", docs[0].count)
            count = docs[0].count;
        }
        res.status(200).json({'getAcount': 'success','count':count});
    } catch (e){
        return res.status(400).json(e)
    }

})

module.exports = router