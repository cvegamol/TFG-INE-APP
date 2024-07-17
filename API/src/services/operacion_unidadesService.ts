import bcrypt from 'bcryptjs'; // Importa bcryptjs para el hashing de contraseñas
import getConnection from "./../database/database"; // Importa la función de conexión a la base de datos
import axios from 'axios';
/**
 * Función para obtener todas las operacion_unidades
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const getOperationUnits = async (req:any, res:any) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM operacion_unidad");
        res.json(result); // Devuelve las operacion_unidades como respuesta
        return result;
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor' }); // Devuelve un error 500 si falla la consulta
    }
}

/**
 * Función para obtener una operacion_unidad por operacionId
 * @param {number} id - Id de la operacion_unidad a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getOperationUnitByOperationId = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM operacion_unidades WHERE operacionId = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la operacion_unidad por id', status: 500 };
    }
}

/**
 * Función para obtener una operacion_unidad por unidadId
 * @param {number} id - Id de la operacion_unidad a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getOperationUnitByUnitId = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM operacion_unidades WHERE unidadId = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la operacion_unidad por id', status: 500 };
    }
}

export const operacionesUnidadesMethods= { getOperationUnits, getOperationUnitByOperationId, getOperationUnitByUnitId }; // Exporta los métodos de operacion_unidades
export default operacionesUnidadesMethods; // Exporta los métodos de operacion_unidades por defecto