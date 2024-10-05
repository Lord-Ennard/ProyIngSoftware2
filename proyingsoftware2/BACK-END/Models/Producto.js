import { DataTypes } from "sequelize";
import sequelize from "../Database/database.js"; 
import Marca from "./Marca.js";
import StockProducto from "./StockProducto.js";
import ProductoCarrito from "./ProductoCarrito.js";
import ProductoOrden from "./ProductoOrden.js";

const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Auto-incremental
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nRegistroSanitario: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    presentacion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    categoria: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    caracteristicas: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING
        ,allowNull: false,
    }
},{
    freezeTableName: true,
    timestamps: false
});;

export default Producto;