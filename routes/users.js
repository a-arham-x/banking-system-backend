const express = require("express")
const router = express.Router()
const {body, validationResult} = require("express-validator")
const User = require("../models/User")

router.get("/:id", async (req, res)=>{
    const user = await User.findById(req.params.id).catch((err)=>{
        console.log(err);
        // return res.json({message: "Database Error", success: false});
    });

    return res.json(user);
    
})

router.get("/", async (req, res)=>{
    const user = await User.find();
    return res.json(user);
})

router.post("/transfer/:id", [
    body("amount").isNumeric(),
    body("id")
], async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.json({message: "Please make sure you have correctly entered all the fields", success: false})
    }

    if (req.body.amount<=0){
        return res.json({message: "Please send atleast 1$ to proceed with the cash transfer", success: false});
    }

    const sender = await User.findById(req.body.id);
    let prevBalance = sender.currentBalance;
    if (prevBalance<req.body.amount){
        return res.json({message: "You do not have enough balance", success: false})
    }
    let newBalance = prevBalance - req.body.amount;
    await User.updateOne({_id: req.body.id}, {$set: {currentBalance: newBalance}}).catch(()=>{
        return res.json({message: "Database Error", success: false});
    });

    const userToSend = await User.findById(req.params.id);
    prevBalance = userToSend.currentBalance;
    newBalance = prevBalance + req.body.amount; 
    await User.updateOne({ _id: req.params.id}, { $set: {currentBalance: newBalance}}).catch(()=>{
        return res.json({message: "Database Error", success: false});
    });

    return res.json({message: "Amount Transferred Successfully!", success: true});
    
});

module.exports = router;