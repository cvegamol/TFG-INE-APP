import bcrypt from 'bcryptjs'; // Importa bcryptjs para el hashing de contraseñas
import getConnection from "./../database/database"; // Importa la función de conexión a la base de datos
import axios from 'axios';
/**
 * Función para obtener todas las valores
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const getValores = async (req:any, res:any) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM valores");
        res.json(result); // Devuelve las valores como respuesta
        return result;
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor' }); // Devuelve un error 500 si falla la consulta
    }
}


/**
 * Función para obtener una valor por id
 * @param {number} id - Id de la valor a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getValorById = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM valores WHERE id = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la valor por id', status: 500 };
    }
}  

/**
 * Función para obtener una valor por Fk_Variable
 * @param {number} id - Id de la valor a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getValorByFkVariable = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM valores WHERE Fk_Variable = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la valor por id', status: 500 };
    }
}

export  const valoresMethods= { getValores, getValorById, getValorByFkVariable }; // Exporta los métodos de valores
export default valoresMethods; // Exporta los métodos de valores por defecto