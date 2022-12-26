const Joi = require("joi")
let {sequelize,Model,DataTypes}=require("../init/config")

class Turf extends Model {}

Turf.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    location:{
        type:DataTypes.STRING,
        allowNull:false
    },
    availabel_sports:{
        type:DataTypes.STRING,
        allowNull:false
    },
    price:{
        type:DataTypes.STRING,
        allowNull:false
    },
    facilties:{
        type:DataTypes.STRING,
        allowNull:false
    },
    rules:{
        type:DataTypes.STRING,
        allowNull:false
    },
    size:{
        type:DataTypes.STRING,
        allowNull:false
    },
    createdBY:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    updatedBY:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    isDeleted:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    }
},{
    modelName:"Turf",
    tableName:"truf",
    sequelize
})

module.exports={
    Turf
}