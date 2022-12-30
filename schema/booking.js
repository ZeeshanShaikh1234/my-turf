let {sequelize,DataTypes,Model}=require("../init/config")

class Orders extends Model{}

Orders.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    turf_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    date:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },
    slot:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    payment_status:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    conform_by:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    cancel_by:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    status:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
},{
    modelName:"Orders",
    tableName:"orders",
    sequelize
}
)

module.exports=Orders

