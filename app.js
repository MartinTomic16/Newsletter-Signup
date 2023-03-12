const express = require("express");
const client = require("@mailchimp/mailchimp_marketing");
const dotenv = require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
   const firstName = req.body.fName;
   const lastName = req.body.lName;
   const email = req.body.email;

   client.setConfig({
      apiKey: process.env.YOUR_API_KEY,
      server: process.env.YOUR_SERVER_PREFIX,
    });
    
    const run = async () => {
      try {
      const response = await client.lists.batchListMembers(process.env.list_id, {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
      });
     
      console.log(response);
    
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html");
    }

    };

    run();

});

app.post("/failure", function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function (){
    console.log("Server is running on port 3000");
});


