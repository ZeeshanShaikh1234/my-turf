let {Turf}=require("../schema/turfSchema")
let user=require("../schema/userSchema")
let joi=require("joi")
let userData=require("../middleware/Auth")
let uploads=require("../helpper/multer")
const { string, func, when } = require("joi")


async function checkaddtruf(param){
    let schema=joi.object({
        name:joi.string().max(100).min(1).required(),
        location:joi.string().max(100).min(1).required(),
        availabel_sports:joi.string().max(100).min(1).required(),
        price:joi.number().required(),
        facilties:joi.string().max(100).min(1).required(),
        rules:joi.string().max(100).min(1).required(),
        size:joi.array().items(joi.string().max(100).min(1)).required()
        }).options({abortEarly:false})
        let check=schema.validate(param)
        if(check.error){
            let error=[]
            for(let err of check.error.details){
                error.push(err.message)
            }
            return{error:error}
        }
        return {data:check.value}
}

async function addtruf(param,userData){
    let check=await checkaddtruf(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    param.createdBY=userData.id
    let data =param.size
    param.size = data.toString()
    let create=await Turf.create(param).catch((error)=>{
        return {error:error}
    })
    if(!create || create.error){
        return {error:"internal server error"}
    }
    return {data:"your turf add succses"}
}

async function checkupdateturf(param){
    let schema=joi.object({
        id:joi.number(),
        name:joi.string(),
        location:joi.string(),
        availabel_sports:joi.string(),
        facilties:joi.string(),
        rules:joi.string(),
        size:joi.array().items(joi.string())
    }).options({abortEarly:false})
    let check=schema.validate(param)
    if(check.error){
        let error=[]
        for (let err of check.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return {data:check.value}
}

async function updatetruf(param,userData){
    let check=await checkupdateturf(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    param.updatedBY=userData.id
    let find=await Turf.findOne({where:{id:param.id}}).catch((error)=>{
        return {error:error}
    })
    if(find.createdBY != userData.id) {
        return { error:"You cant update this turf"}
    }
    if(!find || find.error){
        return {error:find.error}
    }
    let update= await Turf.update(param,{where:{id:find.id}}).catch((error)=>{
        return {error:error}
    })
    if(!update || update.error){
        return {error:"internal server error"}
    }
    return {data:"your turf details updated succses"}
}

async function checkdeletetruf(param){
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


async function delettruf(param,userData){
    let check=await checkdeletetruf(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find =await Turf.findOne({where:{id:param.id}}).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error:"truf not found"}
    }
    let update =await  Turf.update({isDeleted:true},{where:{id:find.id}}).catch((error)=>{
        return {error:error}
    })
    if(!update || update.error){
        return {error:"internal server error"}
    }
    return {data:"delete"}
}


async function undelettruf(param,userData){
    let check=await checkdeletetruf(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find =await Turf.findOne({where:{id:param.id}}).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error:"truf not found"}
    }
    let update =await  Turf.update({isDeleted:false},{where:{id:find.id}}).catch((error)=>{
        return {error:error}
    })
    if(!update || update.error){
        return {error:"internal server error"}
    }
    return {data:"undelete"}
}

async function checkviewAllturf(param){
    let schema=joi.object({
        id:joi.number(),
        name:joi.string(),
        location:joi.string(),
        availabel_sports:joi.string()
    }).options({abortEarly:false})
    let check=schema.validate(param)
    if(check.error){
        let errro=[]
        for(let err of check.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return {data:check.value}
}

async function viewAllturf(param){
    let check=await checkviewAllturf(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let result={}
    if(param.id){
        result={where:{id:param.id}}
    }
    if(param.name){
        result={where:{name:param.name}}
    }
    if(param.location){
        result={where:{location:param.location}}
    }
    if(param.availabel_sports){
        result={where:{availabel_sports:param.availabel_sports}}
    }
    let find=await Turf.findAll(result).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error:"internal server error"}
    }
    return {data:find}
}


module.exports={
    addtruf,
    updatetruf,
    delettruf,
    undelettruf,
    viewAllturf
}