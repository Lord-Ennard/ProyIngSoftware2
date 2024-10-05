import { DataTypes } from "sequelize";
import sequelize from "../Database/database.js"; 
import moment from 'moment-timezone';

const Usuario = sequelize.define('Usuario', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellidoPaterno: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    apellidoMaterno: {
        type: DataTypes.STRING,
        allowNull: false
      },
    password: { 
        type: DataTypes.STRING,
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: {
      type: DataTypes.STRING, 
      allowNull: false 
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: () => moment.tz('America/Lima').toDate // Hora de Lima, Perú
    },
    direcciones:{
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
        validate: {
            validarSize(value) {
                if(value.length > 3){
                    throw new Error("No puedes tener más de 3 direcciones")
                }
            }
        }
    },
    direccion_activa_latitude: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    direccion_activa_longitude:{
        type: DataTypes.DOUBLE,
        allowNull: true
    }
    },
{
    freezeTableName: true,
    timestamps: false
});

export default Usuario;