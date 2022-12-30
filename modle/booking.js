let booking=require("../schema/booking")
let turf=require("../schema/turfSchema")
let joi=require("joi")
let modle=require("./trufModel")
let userData=require("../middleware/Auth")
const Orders = require("../schema/booking")
const { func } = require("joi")


async function checkbookingturf(param){
    let schema=joi.object({
        turf_id:joi.number().required(),
        date:joi.date().min('now').required(),
        slot:joi.string().required(),
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
    return{data:check.value}
}

async function bookingturf(param,userData){

    let check=await checkbookingturf(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let findturf=await turf.Turf.findOne({where:{id:param.turf_id}}).catch((error)=>{
        return {error:error}
    })
    if(!findturf || findturf.error){
        return {error:"turf not found"}
    }

    let find=await Orders.findOne({
        where:{turf_id:findturf.id,date:param.date,slot:param.slot}
    }).catch((error)=>{
        return {error:error}
    })
  
    if(find && !find.error){
        return {error:"slot alrady book"}
    }
    let update=await Orders.create({
        turf_id:param.turf_id,
        date:param.date,
        slot:param.slot,
        user_id:userData.id
    }).catch((error)=>{
        return {error:error}
    })
    console.log(update)
    return {data:"slot booked succses "}
}

async function checkpayment(param){
    let schema=joi.object({
        order_id:joi.number().required(),
        advance_amount:joi.number().required()
    }).options({
        abortEarly:false
    })
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

async function paymet(param,userData){
    let check=await checkpayment(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find=await turf.Turf.findOne({where:{advance_amount:param.advance_amount}}).catch((error)=>{
        return {error:error}
    })
   if(!find || find.error){
    return {error:"payment faile"}
   }
   let update=await Orders.update({payment_status:1},{where:{id:param.order_id}}).catch((error)=>{
    return {error:error}
   })
   if(!update || update.error){
    return {error:"internal serever error"}
   }
   return {data:"payment succses"}
}

async function checkconfirmbooking(param){
    let schema=joi.object({
        id:joi.number().required()
    }).options({abortEarly:false})
    let check=schema.validate(param)
    if(check.error){
    for(let err of check.error.details){
        let error=[]
        error.push(err.message)
    }
    return {error:error}
    }
    return {data:check.value}
}

async function confirmbooking(param,userData){
    let check=await checkconfirmbooking(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return{error:check.error}
    }
    let find=await Orders.findOne({where:{id:param.id}}).catch((error)=>{
        return {error:error}
    })
    
    if(find.payment_status != 1){
        return {error:"payment not recive"}
    }
    if(!find || find.error){
        return {error:"id not found"}
    }
    let updat=await Orders.update({conform_by:userData.id},{where:{id:find.id}}).catch((error)=>{
        return {error:error}
    })

    if(!updat || updat.error){
        return {error:"internal server error"}
    }
    return {data:"conform succses"}
}

async function cancelbooking(param,userData){
    let check=await checkconfirmbooking(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find=await Orders.findOne({where:{id:param.id}}).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error:"id not found"}
    }
   
    let updat=await Orders.update({cancel_by:userData.id},{where:{id:param.id}}).catch((error)=>{
        return {error:error}
    })
    if(!updat || updat.error){
        return {error:"internal server error"}
    }
    return {data:"booking canceled"}
}

// async function checkviewbooking(param){
//     let schema=joi.object({
//         id:joi.number().required()
//     }).options({
//         abortEarly:true
//     })
//     let check=schema.validate(param)
//     if(check.error){
//         let error=[]
//         for(let err of check.error.details){
//             error.push(err.message)
//         }
//         return {error:error}
//     }
//     return {data:check.value}
// }

async function viewbooking(userData){
    let find=await Orders.findAll({attributes:["turf_id "," date","slot","payment_status","	conform_by","cancel_by","	status"] ,where:{user_id:userData.id}}).catch((error)=>{
        return {error:error}
    })
    console.log("check",check)
    if(!find || find.error){
        return {error:"internal server error"}
    }
    return {data:find}
}
module.exports={
    bookingturf,
    paymet,
    confirmbooking,
    cancelbooking,
    viewbooking
}