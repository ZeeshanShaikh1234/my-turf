let express = require("express")
const app = express()
let rout = require ("./rout")
let logger=require("./init/winston")

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/api/v2/admin',rout)
logger.error("error")

app.listen(3002,(()=>{
    console.log("connected")
}))