import bcrypt from 'bcryptjs'; // Importa bcryptjs para el hashing de contraseñas
import getConnection from "./../database/database"; // Importa la función de conexión a la base de datos
import axios from 'axios';
/**
 * Función para obtener todas las periodicidades
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */

const getPeriodicities = async (req:any, res:any) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM periodicidades");
        res.json(result); // Devuelve las periodicidades como respuesta
        return result;
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor' }); // Devuelve un error 500 si falla la consulta
    }
}

/**
 * Función para obtener una periodicidad por id
 * @param {number} id - Id de la periodicidad a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getPeriodicityById = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM periodicidades WHERE id = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la periodicidad por id', status: 500 };
    }
}
/**
 * Función para obtener una periodicidad por FK_Operacion
 * @param {number} id - Id de la periodicidad a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getPeriodicityByFkOperation = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM periodicidades WHERE FK_Operacion = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la periodicidad por id', status: 500 };
    }
}

export const periodicidadesMethods= { getPeriodicities, getPeriodicityById, getPeriodicityByFkOperation }; // Exporta los métodos de periodicidades

export default periodicidadesMethods; // Exporta los métodos de periodicidades por defecto



