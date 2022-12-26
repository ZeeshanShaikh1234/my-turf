const { func } = require("joi")
let user = require("../modle/Usermodle")
let User = require('../schema/userSchema')

async function register(request,response){
    let user1 = await user.register(request.body).catch((error)=>{
        return {error:error}
    })
    

    if(!user1 || user1.error){
        return response.send({error:user1})
    }
    return response.send({data:user1.data})
}

async function login(request,response){
    let user2 =await user.loginUser(request.body).catch((error)=>{
        return{error:error}
    })
    console.log(user2)
    if(!user2 || user2.error){
        return response.send({error:user2.error})
    }
    return response.send({data:user2})
}

async function forgetPass(request,response){
    let user3 = await user.forget(request.body).catch((error)=>{
        return {error:error}
    })
    console.log(user3)
    if(!user3 || user3.error){
       return response.send({error:user3.error})
    }
    return response.send({data:user3.data})
}

async function resetPass(request,response){
    let user4 = await user.reset(request.body).catch((error)=>{
        return{error:error}
    })
    console.log(user4)
    if(!user4 || user4.error){
        return response.send({error:user4.error})
    }
    return response.send({data:user4.data})
}

async function changePass(request,response){
    let user5 = await user.newPassword(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    console.log(user5)
    if(!user5 || user5.error){
        return response.send({error:user5.error})
    }
     return response.send({data:user5.data})
}

async function viweUsers(request,response){
    let user6=await user.viweUSER(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    console.log(user6)
    if(!user6 || user6.error){
        return response.send({error:user6.error})
    }
    return response.send({data:user6.data})
}

async function deleteuser1(request,response){
    let check=await user.deleteuser(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function undeleteuser1(request,response){
    let check=await user.undeleteuser(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

module.exports={
    register,
    login,
    forgetPass,
    resetPass,
    changePass,
    viweUsers,
    deleteuser1,
    undeleteuser1
}