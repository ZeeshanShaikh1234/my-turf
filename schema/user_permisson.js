let {sequelize,Model,DataTypes}=require("../init/config")

class User_permison extends Model {}

User_permison.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    permisson_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    createdby:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
},{
    modelName:"User_permison",
    tableName:"user_permisson",
    sequelize
})

module.exports=User_permison