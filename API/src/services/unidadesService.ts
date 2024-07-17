import bcrypt from 'bcryptjs'; // Importa bcryptjs para el hashing de contraseñas
import getConnection from "./../database/database"; // Importa la función de conexión a la base de datos
import axios from 'axios';
/**
 * Función para obtener todas las unidades
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const getUnits = async (req:any, res:any) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM unidades");
        res.json(result); // Devuelve las unidades como respuesta
        return result;
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor' }); // Devuelve un error 500 si falla la consulta
    }
}

/**
 * Función para obtener una unidad por id
 * @param {number} id - Id de la unidad a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getUnitById = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM unidades WHERE id = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la unidad por id', status: 500 };
    }
}

export const unidadesMethods= { getUnits, getUnitById }; // Exporta los métodos de unidades
export default unidadesMethods; // Exporta los métodos de unidades por defecto