const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/userRegistration").then(() => {
    console.log("DB Connection successful");
}).catch((e) => {
    console.log(e);
})