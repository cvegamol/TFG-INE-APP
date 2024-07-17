import bcrypt from 'bcryptjs'; // Importa bcryptjs para el hashing de contraseñas
import getConnection from "./../database/database"; // Importa la función de conexión a la base de datos
import axios from 'axios';
/**
 * Función para obtener todas las variables
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */

const getVariables = async (req:any, res:any) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM variable");
        res.json(result); // Devuelve las variables como respuesta
        return result;
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor' }); // Devuelve un error 500 si falla la consulta
    }
}

/**
 * Función para obtener una variable por id
 * @param {number} id - Id de la variable a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */

const getVariableById = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM variable WHERE id = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la variable por id', status: 500 };
    }
}

export const variableMethods=  { getVariables, getVariableById }; 
// Exporta los métodos de variables
export default variableMethods; // Exporta los métodos de variables por defecto