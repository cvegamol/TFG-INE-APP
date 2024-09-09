import bcrypt from 'bcryptjs'; // Importa bcryptjs para el hashing de contraseñas
import getConnection from "./../database/database"; // Importa la función de conexión a la base de datos
import axios from 'axios';
/**
 * Función para obtener todas las tablas
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const getTables = async (req:any, res:any) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM tablas");
        res.json(result); // Devuelve las tablas como respuesta
        return result;
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor' }); // Devuelve un error 500 si falla la consulta
    }
}

/**
 * Función para obtener una tabla por id
 * @param {number} id - Id de la tabla a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getTableById = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM tablas WHERE id = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la tabla por id', status: 500 };
    }
}

/**
 * Función para obtener una tabla por FK_Periodicidad
 * @param {number} id - Id de la tabla a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */

const getTableByFkPeriodicity = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM tablas WHERE FK_Periodicidad = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la tabla por id', status: 500 };
    }
}

/**
 * Función para obtener una tabla por FK_Publicacion
 * @param {number} id - Id de la tabla a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */

const getTableByFkPublication = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM tablas WHERE FK_Publicacion = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la tabla por id', status: 500 };
    }
}

/**
 * Función para obtener una tabla por FK_Periodo_ini
 * @param {number} id - Id de la tabla a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */

const getTableByFkPeriodIni = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM tablas WHERE FK_Periodo_ini = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la tabla por id', status: 500 };
    }
}
/**
 * Función para obtener una tabla por Código y FK_Publicación
 * @param {string} codigo - Código de la tabla a buscar
 * @param {number} fkPublicacion - FK_Publicación de la tabla
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getTableByCodeAndFkPublication = async (codigo: string, fkPublicacion: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const query = 'SELECT * FROM tablas WHERE Codigo LIKE ? AND FK_Publicacion = ? ORDER BY Nombre';
        const result = await connection.query(query, [`%${codigo}%`, fkPublicacion]);
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la tabla por Código y FK_Publicación', status: 500 };
    }
};

export const tablasMethods= { getTables, getTableById, getTableByFkPeriodicity, getTableByFkPublication, getTableByFkPeriodIni,getTableByCodeAndFkPublication}; // Exporta los métodos de tablas
export default tablasMethods; // Exporta los métodos de tablas por defecto