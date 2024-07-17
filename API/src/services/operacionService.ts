import bcrypt from 'bcryptjs'; // Importa bcryptjs para el hashing de contraseñas
import getConnection from "./../database/database"; // Importa la función de conexión a la base de datos
import axios from 'axios';
/**
 * Función para obtener todas las operaciones
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const getOperations = async (req:any, res:any) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM operaciones");
        res.json(result); // Devuelve las operaciones como respuesta
        return result;
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor' }); // Devuelve un error 500 si falla la consulta
    }
}

/**
 * Función para obtener una operación por id
 * @param {number} id - Id de la operación a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getOperationById = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM operaciones WHERE id = ' + id);

        

        if (result.length === 0) {
        
            
            // URL de la API del INE para obtener la serie por COD
            const apiUrl = `https://servicios.ine.es/wstempus/js/ES/OPERACION/${id}`;
            
            // Realizar llamada GET a la API del INE
            const response = await axios.get(apiUrl);

          
            const dataFromAPI = response.data;
            console.log("Datos de la API:", dataFromAPI);

            return dataFromAPI;
        } else {
            return result;
        }
    } catch (error: any) {
        throw { message: 'Error al obtener la operación por id', status: 500 };
    }
}

/**
 * Función para obtener una operación por Cod_IOE
 * @param {number} id - Id de la operación a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */

const getOperationByCodIOE = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM operaciones WHERE Cod_IOE = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la operación por id', status: 500 };
    }
}

/**
 * Función para obtener una operación por Codigo 
 * @param {number} id - Id de la operación a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getOperationByCode = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM operaciones WHERE Codigo = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la operación por id', status: 500 };
    }

}
export const  operacionesMethods= { getOperations, getOperationById, getOperationByCodIOE, getOperationByCode }; // Exporta los métodos de operaciones
export default operacionesMethods; // Exporta los métodos de operaciones por defecto