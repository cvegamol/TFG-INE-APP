import bcrypt from 'bcryptjs'; // Importa bcryptjs para el hashing de contraseñas
import getConnection from "./../database/database"; // Importa la función de conexión a la base de datos
import axios from 'axios';
/**
 * Función para obtener todas las operacion_variables
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const getOperationVariables = async (req:any, res:any) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM operacion_variable");
        res.json(result); // Devuelve las operacion_variables como respuesta
        return result;
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor' }); // Devuelve un error 500 si falla la consulta
    }
}

/**
 * Función para obtener una operacion_variable por operacionId
 * @param {number} id - Id de la operacion_variable a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getOperationVariableByOperationId = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM operacion_variables WHERE operacionId = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la operacion_variable por id', status: 500 };
    }
}

/**
 * Función para obtener una operacion_variable por variableId
 * @param {number} id - Id de la operacion_variable a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getOperationVariableByVariableId = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM operacion_variables WHERE variableId = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la operacion_variable por id', status: 500 };
    }
}

export	const operacion_variableMethods= { getOperationVariables, getOperationVariableByOperationId, getOperationVariableByVariableId }; // Exporta los métodos de operacion_variables
export default operacion_variableMethods; // Exporta los métodos de operacion_variables por defecto