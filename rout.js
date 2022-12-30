let users = require ("./controler/userControler")
let authantication = require("./middleware/Auth")
let errorhendal=require("./middleware/errorHandler")
let truf=require("./controler/trufContoler")
let booking=require("./controler/bookindControler")
let cors=require("./init/cors")


let express = require ("express");
const auth = require("./middleware/Auth");
let app = express.Router()
app.use(cors)
// user url
app.post("/register",users.register);
app.post("/login",users.login);
app.post("/forget",users.forgetPass);
app.post("/reset",users.resetPass);
app.post("/changepassword",authantication.auth("user"),users.changePass);
app.get("/getAlluser",authantication.auth("view_user"),users.viweUsers)
app.delete("/deleteuser",authantication.auth("delet_user"),users.deleteuser1)
app.delete("/undeleteuser",authantication.auth("delet_user"),users.undeleteuser1)
app.post("/updateprofile",authantication.auth("user"),users.updateprofile1)




// trufUrls
app.post("/addTruf",authantication.auth("add_turf"),truf.addtruf1)
app.put("/updateturf",authantication.auth("update_truf"),truf.updateturf1)
app.delete("/deleteturf",authantication.auth("delete_truf"),truf.delettruf1)
app.delete("/undeleteturf",authantication.auth("delete_truf"),truf.undelettruf1)
app.get("/viewallturf",truf.viewAllturf1)
app.get("/viewslot",authantication.auth("user"),truf.viewslot1)


// booking
app.post("/bookslot",authantication.auth("user"),booking.bookingturf1)
app.post("/payment",authantication.auth("user"),booking.paymant1)
app.post("/confirmbooking",authantication.auth("conform_bookoing"),booking.confirmbooking1)
app.post("/cancelbooking",authantication.auth("user"),booking.cancelbooking1)
app.get("/viewbooking",authantication.auth("user"),booking.viewbooking1)
app.get("/viewallbooking",authantication.auth("view_booking"),booking.viewallbooking1)


app.use(errorhendal)
module.exports=app