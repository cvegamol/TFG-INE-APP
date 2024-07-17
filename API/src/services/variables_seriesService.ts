import bcrypt from 'bcryptjs'; // Importa bcryptjs para el hashing de contraseñas
import getConnection from "./../database/database"; // Importa la función de conexión a la base de datos
import axios from 'axios';
/**
 * Función para obtener todas las variables_series
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const getVariableSeries = async (req:any, res:any) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM variables_serie");
        res.json(result); // Devuelve las variables_series como respuesta
        return result;
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor' }); // Devuelve un error 500 si falla la consulta
    }
}

/**
 * Función para obtener una variable_series por variableId
 * @param {number} id - Id de la variable_series a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getVariableSeriesByVariableId = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM variables_series WHERE variableId = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la variable_series por id', status: 500 };
    }
}

/**
 * Función para obtener una variable_series por serieId
 * @param {number} id - Id de la variable_series a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getVariableSeriesBySerieId = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM variables_series WHERE serieId = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la variable_series por id', status: 500 };
    }
}

export const variables_series= { getVariableSeries, getVariableSeriesByVariableId, getVariableSeriesBySerieId }; // Exporta los métodos de variables_series
export default variables_series; // Exporta los métodos de variables_series por defecto
