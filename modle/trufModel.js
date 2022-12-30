let {Turf}=require("../schema/turfSchema")
let user=require("../schema/userSchema")
let joi=require("joi")
let ordre=require("../schema/booking")
let userData=require("../middleware/Auth")
let uploads=require("../helpper/multer")
const { string, func, when } = require("joi")
const Orders = require("../schema/booking")


async function checkaddtruf(param){
    let schema=joi.object({
        name:joi.string().max(100).min(1).required(),
        location:joi.string().max(100).min(1).required(),
        availabel_sports:joi.string().max(100).min(1).required(),
        price:joi.number().required(),
        facilties:joi.string().max(100).min(1).required(),
        rules:joi.string().max(100).min(1).required(),
        size:joi.array().items(joi.string().max(100).min(1)).required(),
        advance_amount:joi.number().required()
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

async function checkviewslot(param){
    let schema=joi.object({
        turf_id:joi.number().required(),
        date:joi.date().min('now').required()
    }).options({abortEarly:false})
    
    let check=schema.validate(param)
    if(check.error){
        let error=[]
        for(let err of check.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return{data:check.value}
}

async function viewslot(param,userData){
    
    let check=await checkviewslot(param).catch((error)=>{
        return {error:error}
    })
    
    if(!check || check.error){
        return {error:check.error}
    }
    let availabel_slot= []
    let slot=["1pm-2pm","2pm-3pm","3pm-4pm","4pm-5pm","5pm-6pm","6pm-7pm","7pm-8pm","8pm-9pm","9pm-10pm","10pm-11pm","11pm-12pm","1am-2am","2am-3am","3am-4am","4am-5am","5am-6am","6am-7am","7am-8am","8am-9am","9am-10am","10am-11am","11am-12am"]
    
    let bookedslot=await Orders.findAll({where:{turf_id:param.turf_id,date:param.date},raw:true}).catch((error)=>{
        return {error:error}
    })
 
    if(!bookedslot || (bookedslot && bookedslot.length<=0) || bookedslot.error){
       
        return {data:slot};
    }

    let tempSlot = {};
    for(let j of bookedslot)
    {
        tempSlot[j.slot] = true;
    }
   
    for(let i of slot){
       if(!tempSlot[i]){
            availabel_slot.push(i);
       }
    }
   

    return{data:availabel_slot}
}
module.exports={
    addtruf,
    updatetruf,
    delettruf,
    undelettruf,
    viewAllturf,
    viewslot
}