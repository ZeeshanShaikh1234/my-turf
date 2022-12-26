let jwt = require("jsonwebtoken")

let {sequelize,QueryTypes} = require ("../init/config")
let User = require('../schema/userSchema')




 function auth(permisson){
  return async function(request,response,next){   
    if(!request.headers || !request.headers.token){
      return response.status(401).send("token not found")
    }

    let verify = jwt.verify(request.headers.token,"zeeshan@123")

    if(!verify || verify.error){
      return response.status(401).send("user not found")
    }

    let user = await sequelize.query(`SELECT user.name,permisson.name as permisson 
      FROM user LEFT JOIN user_permisson ON user.id=user_permisson.user_id 
      LEFT JOIN permisson ON user_permisson.permisson_id=permisson.id 
      WHERE user.id =${verify.id}`, {type : sequelize.QueryTypes.SELECT})
      .catch((error)=>{
        return {error:error}
      })
    if(!user || (user && user.error)){
      return response.status(401).send("user mot found")
    }

    let userPermisson = {}
    for(let per of user){
      userPermisson[per.permisson]=1
    }
    if ((permisson || !permisson) && !userPermisson[permisson]){
      return response.send("access denied")
    }

    request.userData = {
      id:verify.id,name:user[0].name,permisson:userPermisson
    }
    next()
  }

}
module.exports={auth}