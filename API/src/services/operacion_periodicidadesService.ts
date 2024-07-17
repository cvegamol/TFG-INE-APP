import bcrypt from 'bcryptjs'; // Importa bcryptjs para el hashing de contraseñas
import getConnection from "./../database/database"; // Importa la función de conexión a la base de datos
import axios from 'axios';
/**
 * Función para obtener todas las operacion_periodicidades
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const getOperationPeriodicities = async (req:any, res:any) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM operacion_periodicidad");
        res.json(result); // Devuelve las operacion_periodicidades como respuesta
        return result;
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor' }); // Devuelve un error 500 si falla la consulta
    }
}

/**
 * Función para obtener una operacion_periodicidad por operacionId
 * @param {number} id - Id de la operacion_periodicidad a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getOperationPeriodicityByOperationId = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM operacion_periodicidades WHERE operacionId = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la operacion_periodicidad por id', status: 500 };
    }
}

/**
 * Función para obtener una operacion_periodicidad por periodicidadId
 * @param {number} id - Id de la operacion_periodicidad a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getOperationPeriodicityByPeriodicityId = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM operacion_periodicidades WHERE periodicidadId = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la operacion_periodicidad por id', status: 500 };
    }
}

export const operacionPeriodicidades= { getOperationPeriodicities, getOperationPeriodicityByOperationId, getOperationPeriodicityByPeriodicityId }; // Exporta los métodos de operacion_periodicidades
export default operacionPeriodicidades; // Exporta los métodos de operacion_periodicidades por defecto