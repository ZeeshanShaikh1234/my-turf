let {Sequelize,Model,DataTypes,QueryTypes} = require("sequelize")

let sequelize = new Sequelize("mysql://root:@localhost/turf_booking_",{logging:false})

sequelize.authenticate().then(()=>{
    console.log("connected to dataBase")
}).catch(()=>{
    console.log("not connected to dataBase")
})

module.exports={
    sequelize,
    Model,
    DataTypes,
    QueryTypes
}
