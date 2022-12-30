let booking=require("../modle/booking")


async function bookingturf1(request,response){
    let check=await booking.bookingturf(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    console.log("check",check)
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function paymant1(request,response){
    let check=await booking.paymet(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    console.log("checerror",check)
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function confirmbooking1(request,response){
    let check=await booking.confirmbooking(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function cancelbooking1(request,response){
    let check=await booking.cancelbooking(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function viewbooking1(request,response){
    let check=await booking.viewbooking(request.userData).catch((error)=>{
        return {error:error}
    })
    console.log("error",check);
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}
module.exports={
    bookingturf1,
    paymant1,
    confirmbooking1,
    cancelbooking1,
    viewbooking1
}