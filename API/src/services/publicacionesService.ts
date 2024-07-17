import bcrypt from 'bcryptjs'; // Importa bcryptjs para el hashing de contraseñas
import getConnection from "./../database/database"; // Importa la función de conexión a la base de datos
import axios from 'axios';
/**
 * Función para obtener todas las publicaciones
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const getPublications = async (req:any, res:any) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM publicaciones");
        res.json(result); // Devuelve las publicaciones como respuesta
        return result;
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor' }); // Devuelve un error 500 si falla la consulta
    }
}

/**
 * Función para obtener una publicación por id
 * @param {number} id - Id de la publicación a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */

const getPublicationById = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM publicaciones WHERE id = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la publicación por id', status: 500 };
    }

}

/**
 * Función para obtener una publicación por FK_Periodicidad
 * @param {number} id - Id de la publicación a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */

const getPublicationByFkPeriodicity = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM publicaciones WHERE FK_Periodicidad = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la publicación por id', status: 500 };
    }
}

/**
 * Función para obtener una publicación por FK_Operacion
 * @param {number} id - Id de la publicación a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */

const getPublicationByFkOperation = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM publicaciones WHERE FK_Operacion = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la publicación por id', status: 500 };
    }
}
/**
 * Función para obtener una publicación por FK_PubFechaAct 
 * @param {number} id - Id de la publicación a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */

const getPublicationByFkPubDateAct = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM publicaciones WHERE FK_PubFechaAct = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la publicación por id', status: 500 };
    }
}
export const publicacionesMethods= { getPublications, getPublicationById, getPublicationByFkPeriodicity, getPublicationByFkOperation, getPublicationByFkPubDateAct }; // Exporta los métodos de publicaciones
export default publicacionesMethods; // Exporta los métodos de publicaciones por defecto