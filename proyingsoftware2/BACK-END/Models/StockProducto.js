import { DataTypes } from "sequelize";
import sequelize from "../Database/database.js"; 


const StockProducto = sequelize.define('StockProducto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precio: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    nRegistroSanitario: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    freezeTableName: true,
    timestamps: false
});;

export default StockProducto;
