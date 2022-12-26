let users = require ("./controler/userControler")
let authantication = require("./middleware/Auth")
let errorhendal=require("./middleware/errorHandler")
let truf=require("./controler/trufContoler")
let cors=require("./init/cors")


let express = require ("express");
const auth = require("./middleware/Auth");
let app = express.Router()
app.use(cors)

app.post("/register",users.register);
app.post("/login",users.login);
app.post("/forget",users.forgetPass);
app.post("/reset",users.resetPass);
app.post("/changepassword",authantication.auth("user"),users.changePass);
app.get("/getAlluser",authantication.auth("view_user"),users.viweUsers)
app.delete("/deleteuser",authantication.auth("delet_user"),users.deleteuser1)
app.delete("/undeleteuser",authantication.auth("delet_user"),users.undeleteuser1)




// trufUrls
app.post("/addTruf",authantication.auth("add_turf"),truf.addtruf1)
app.put("/updateturf",authantication.auth("update_truf"),truf.updateturf1)
app.delete("/deleteturf",authantication.auth("delete_truf"),truf.delettruf1)
app.delete("/undeleteturf",authantication.auth("delete_truf"),truf.undelettruf1)
app.get("/viewallturf",truf.viewAllturf1)


app.use(errorhendal)
module.exports=app