import bcrypt from 'bcryptjs'; // Importa bcryptjs para el hashing de contraseñas
import getConnection from "./../database/database";
import axios from 'axios';
/**
 * Función para obtener todas las operacion_clasificaciones
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const getOperationClassifications = async (req:any, res:any) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM operacion_clasificacion");
        res.json(result); // Devuelve las operacion_clasificaciones como respuesta
        return result;
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor' }); // Devuelve un error 500 si falla la consulta
    }
}

/**
 * Función para obtener una operacion_clasificacion por operacion_id
 * @param {number} id - Id de la operacion_clasificacion a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getOperationClassificationByOperationId = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM operacion_clasificaciones WHERE operacionId = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la operacion_clasificacion por id', status: 500 };
    }
    
}

/**
 * Función para obtener una operacion_clasificacion por clasificacion_id
 * @param {number} id - Id de la operacion_clasificacion a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getOperationClassificationByClasificacionId = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM operacion_clasificaciones WHERE clasificacionId = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la operacion_clasificacion por id', status: 500 };
    }
    
}

export const operacionClasificacionesMethods= { getOperationClassifications, getOperationClassificationByOperationId, getOperationClassificationByClasificacionId }; // Exporta los métodos de operacion_clasificaciones

export default operacionClasificacionesMethods; // Exporta los métodos de operacion_clasificaciones por defecto

