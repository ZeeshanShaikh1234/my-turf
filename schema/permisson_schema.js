let {sequelize,DataTypes,Model}=require("../init/config")
class Permisson extends Model   {}

Permisson.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    permisson_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    modelName:"Permison",
    tableName:"user_permisson",
    sequelize
}
)


module.exports=Permisson