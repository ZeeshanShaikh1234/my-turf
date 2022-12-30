let users = require("../schema/userSchema")
let user_permisson=require("../schema/permisson_schema")
let joi = require("joi")
let bcrypt = require("bcrypt")
let jwt = require("jsonwebtoken");
let rs = require("randomstring")
let mailer = require("nodemailer")
let permisson=require("../schema/user_permisson")

const User = require("../schema/userSchema");
const { schema, findOne } = require("../schema/userSchema");
const { BaseError } = require("sequelize");
const User_permison = require("../schema/user_permisson");

async function checkRegister(param) {
    let schema = joi.object({
        name: joi.string().max(30).min(2).required(),
        email: joi.string().max(80).min(2).required(),
        password: joi.string().max(12).min(2).required()
    }).options({
        abortEarly: false
    });
    let check = schema.validate(param)
    if (check.error) {
        let error = []
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function register(param) {
    let valid = await checkRegister(param).catch((error) => {
        return { error: error }
    })
    if (!valid || valid.error) {
        return { error: valid.error }
    }
    let checkuser = await User.findOne({ where: { email: param.email } })
        .catch((error) => {
            return { error: error }
        })

    if (checkuser) {
        return { error: "this user is alradey exist" }
    }
    param.password = await bcrypt.hash(param.password, 10)
        .catch((error) => {
            return { error: error }
        })
        
    let addUser = await User.create(param)
        .catch((error) => {
            return { error: error }
        })
    if (!addUser || addUser.error) {
        return { error: "internal server error" }
    }

    let givepermissson=await User_permison.create({
        user_id:addUser.id,
        permisson_id:11
    }).catch((error)=>{
        return {error:error}
    })
    console.log(givepermissson)
    if(!givepermissson || givepermissson.error){
        return{error:"error permisson"}
    }

    return { data: "register succsefull", addUser ,givepermissson}
}

async function checkLogin(param) {
    let schema = joi.object({
        email: joi.string().max(80).min(2).required(),
        password: joi.string().max(12).min(2).required()
    }).options({ abortEarly: false })
    let check = schema.validate(param)
    if (check.error) {
        let error = []
        for (let err of check.error.details) {
            error.push(err.messag)
        }
        return { error: error }
    }
    return { data: check.valid }
}

async function loginUser(param) {
    let valid = await checkLogin(param).catch((error) => {
        return { error: error }
    })
    
    if (!valid || valid.error) {
        return { error: valid.error }
    }
    let checkuser = await User.findOne({ where: { email: param.email } }).catch((error) => {
        return { error: error }
    })
   
    if (!checkuser || checkuser.error) {
        return { error: "user note found" }
    }
    let checkPassword = await bcrypt.compare(param.password, checkuser.password).catch((errro) => {
        return { error: error }
    })

    if (!checkPassword || checkPassword.error) {
        return { error: "pleas enter valid password" }
    }
    let key = "zeeshan@123"
    let token = jwt.sign({ id: checkuser.id }, key)

   
    if (!token || token.error) {
        return { error: "internal server error" }
    }
    return { data: "login succesfully", token }
}

async function checkforget(param) {
    let schema = joi.object({
        email: joi.string().max(80).min(2)
    }).options({ abortEarly: false })
    let check = schema.validate(param)
    if (check.error) {
        let error = []
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function forget(param) {
    let check = await checkforget(param).catch((error) => {
        return { error: error }
    })
    if (!check || check.error) {
        return { error: error }
    }

    let users = await User.findOne({ where: { email: param.email } }).catch((error) => {
        return { error: error }
    })
    //console.log(users.email +"pppppp")
    if (!users || users.error) {
        return { error: "pleas enter valid email" }
    }
    let token = await rs.generate(10)


    let result = await User.update({ token: token }, { where: { email: param.email } }).catch((error) => {
        return { error: error }
    })
    
    let transporter = mailer.createTransport({
        service: "gmail",
        auth: {
            user: "poolking90zeeshan90@gmail.com",
            pass: "gtoxrouqvimucnpo"
        }
    })

    let mailoptin = {
        from: "poolking90zeeshan90@gmail.com",
        to: users.email,
        subject: "forget password",
        text: "enter this token to reset your password" + " : " + token
    }
    transporter.sendMail(mailoptin, (error, info) => {
        if (error) {
            console.log("maill error", error)
            return { error: "internal server error", error }
        } else {
            return { data: "token send on your email", info }
        }

    })
    return { data: "mail send on your email" }
}

async function checkreset(param) {
    let schema = joi.object({
        email: joi.string().max(80).min(2).required(),
        token: joi.string().max(10).min(2).required(),
        newPassword: joi.string().max(10).min(2).required()
    })
    let check = schema.validate(param)
    if (check.error) {
        let error = []
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function reset(param) {
    let check = await checkreset(param).catch((error) => {
        return { error: error }
    })
    if (!check || check.error) {
        return { error: check.error }
    }
    let users = await User.findOne({ where: { token: param.token } }).catch((error) => {
        return { error: error }
    })
    if (!users || (users && users.error)) {
        return {
            error: "user not found"
        }
    }

    let rePassword = await User.update({ password: await bcrypt.hash(param.newPassword, 10) }, { where: { id: users.id } }).catch((error) => {
        return { error: error }
    })
    if (!rePassword || (rePassword && rePassword.error)) {
        return { error: rePassword.error }
    }


    let delet = await User.update({ token: "" }, { where: { id: users.id } }).catch((error) => {
        return { error: error }
    })

    return { data: "password reset succsesfull" }

}

async function changePassword(param) {
    let schema = joi.object({
        
        password: joi.string().max(12).min(2).required(),
        newPASSWORD: joi.string().max(12).min(2).required()
    })
    delete param.id
    let check = schema.validate(param,{abortEarly:false})
    if (check.error) {
        let error = []
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function newPassword(param,userData) {
    let userId = userData.id;
    let check = await changePassword(param).catch((error) => {
        return { error: error }
    })

    if (!check || check.error) {
        return { error: check.error }
    }
    
    let findPass = await User.findOne({ where: { id:userId } }).catch((error) => {
        return { error: error }
    })
    
    if (!findPass || findPass.error) {
        return { error: "user not found1" }
    }
    let change = await bcrypt.compare(param.password, findPass.password).catch((error) => {
        return { error: error }
    })
    if (!change || change.error) {
        return { error: "pleas enter corect Password" }
    }
    let updatePassword = await User.update({ password: await bcrypt.hash(param.newPASSWORD, 10) }, { where: { id: findPass.id } }).catch((error) => {
        return { error: error }
    })

    if (!updatePassword || updatePassword.error) {
        return { error: "internal server error" }
    }
    return { data: "password change succsesfully" }
}

async function getuser (param){
    let schema = joi.object({
        id:joi.number().max(100).min(0),
        name:joi.string().max(30).min(0),
        email:joi.string().max(80).min(0)
    })
    let check = schema.validate(param)
    if(check.error){
        let error = []
        for(let err of check.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return {data:check.value}
 }

async function viweUSER (param,userData){
    let check = await getuser(param).catch((error)=>{
        return {error:error}
    })

    if(!check || check.error){
        return {error:check.error}
    }

    let query = {}
    if(param.id){
        query =  {where:{id:param.id}}
    }
    if(param.name){
        query = {where:{name:param.name}}
    }

    if(param.email){
        query={where:{email:param.email}}
    }

    let allUser=await User.findAll(query).catch((error)=>{
        return {error:error}
    })
    if(!allUser || allUser.error){
        return {error:allUser.error}
    }
    return {data:allUser}
}

async function checkdeleteuser(param){
    let schema=joi.object({
        id:joi.number().required()
    }).options({abortEarly:false})
    let check=schema.validate(param)
    if(check.error){
        let error=[]
        for(let err of check.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return {data:check.value}
}

async function deleteuser(param,userData){
    let check=await checkdeleteuser(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find=await User.findOne({where:{id:param.id}}).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error:"user not found"}
    }
    if(find.isdeleted == true){
        return{error:"this user is alradye deleted"}
    }
    let update=await User.update({isdeleted:true},{where:{
        id:find.id
    }}).catch((error)=>{
        return {error:error}
    })
    
    if(!update || update.error){
        return {error:"internal server error"}
    }
    return {data:"user delete  succses"}
}

async function undeleteuser(param,userData){
    let check=await checkdeleteuser(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find=await User.findOne({where:{id:param.id}}).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error:"user not found"}
    }
    let update=await User.update({isdeleted:false},{where:{
        id:find.id
    }}).catch((error)=>{
        return {error:error}
    })
    if(!update || update.error){
        return {error:"internal server error"}
    }
    return {data:"user undelete succses"}
}

async function checkupdateprofile(param){
      let schema = joi.object({
        name: joi.string(),
        email: joi.string(),
        password: joi.string()
    }).options({
        abortEarly: false
    });
    let check = schema.validate(param)
    if (check.error) {
        let error = []
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function updateprofile(param,userData){
    let check=await checkupdateprofile(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find =await User.findOne({where:{id:userData.id}}).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:"error"}
    }
    let update=await User.update(param,{where:{id:find.id}}).catch((error)=>{
        return {error:error}
    })
    if(!update || update.error){
        return {error:"internal serever error"}
    }
    return {data:"profile updat succses"}
}
module.exports = {
    register,
    loginUser,
    forget,
    reset,
    newPassword,
    viweUSER,
    deleteuser,
    undeleteuser,
    updateprofile
}