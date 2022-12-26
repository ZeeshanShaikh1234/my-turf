const { func } = require("joi")
let truf=require("../modle/trufModel")

async function addtruf1(request,response){
    let check=await truf.addtruf(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function updateturf1(request,response){
    let check=await truf.updatetruf(request.body,request.userData).catch((error)=>{
        return{error:error}
    })
    if(!check || check.error){
        return response.send ({error:check.error})
    }
    return response.send({data:check})
}


async function delettruf1(request,response){
    let check=await truf.delettruf(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function undelettruf1(request,response){
    let check=await truf.undelettruf(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}


async function viewAllturf1(request,response){
    let check=await truf.viewAllturf(request.body).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}
module.exports={
    addtruf1,
    updateturf1,
    delettruf1,
    undelettruf1,
    viewAllturf1
}