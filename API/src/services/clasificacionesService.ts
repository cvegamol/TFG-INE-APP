import bcrypt from 'bcryptjs'; // Importa bcryptjs para el hashing de contraseñas
import getConnection from "./../database/database"; // Importa la función de conexión a la base de datos
import axios from 'axios';
/**
 * Función para obtener todas las clasificaciones
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const getClassifications = async (req:any, res:any) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM clasificaciones");
        res.json(result); // Devuelve las clasificaciones como respuesta
        return result;
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor' }); // Devuelve un error 500 si falla la consulta
    }
}

/**
 * Función para obtener una clasificación por id
 * @param {number} id - Id de la clasificación a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */

const getClassificationById = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM clasificaciones WHERE id = ' + id);
        
       
            return result;
        
    } catch (error: any) {
        throw { message: 'Error al obtener la clasificación por id', status: 500 };
    }
}

export const clasificacioneMethods= { getClassifications, getClassificationById }; // Exporta los métodos de clasificaciones
export default clasificacioneMethods; // Exporta los métodos de clasificaciones por defecto