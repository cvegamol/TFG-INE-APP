import bcrypt from 'bcryptjs'; // Importa bcryptjs para el hashing de contraseñas
import getConnection from "./../database/database"; // Importa la función de conexión a la base de datos
import axios from 'axios';

/**
 * Función para obtener todas las series
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */

const getSeries = async (req:any, res:any) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM series");
        res.json(result); // Devuelve las series como respuesta
        return result;
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor' }); // Devuelve un error 500 si falla la consulta
    }
}

/**
 * Función para obtener una serie por id
 * @param {number} id - Id de la serie a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */

const getSeriesById = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM series WHERE id = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la serie por id', status: 500 };
    }
}

/**
 * Función para obtener una serie por COD
 * @param {number} id - Id de la serie a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */

const getSeriesByCod = async (id: string): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM series WHERE COD = ?', [id]);
        
         if (result.length === 0) {
            console.log(`No se encontraron resultados para el COD: ${id}. Realizando consulta a la API...`);
            
            // URL de la API del INE para obtener la serie por COD
            const apiUrl = `https://servicios.ine.es/wstempus/js/ES/SERIE/${id}`;
            
            // Realizar llamada GET a la API del INE
            const response = await axios.get(apiUrl);

            // Obtener los datos de la respuesta de la API
            const dataFromAPI = response.data;
            console.log("Datos de la API:", dataFromAPI);

            // Guardar o procesar los datos obtenidos de la API en tu base de datos, si es necesario

            return dataFromAPI;
        } else {
            return result;
        }
    } catch (error: any) {
        throw { message: 'Error al obtener la serie por id', status: 500 };
    }
}

/**
 * Función para obtener una serie por FK_Operacion
 * @param {number} id - Id de la serie a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */

const getSeriesByFkOperation = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM series WHERE FK_Operacion = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la serie por id', status: 500 };
    }
}

/**
 * Función para obtener una serie por FK_Periodicidad
 * @param {number} id - Id de la serie a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */

const getSeriesByFkPeriodicity = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM series WHERE FK_Periodicidad = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la serie por id', status: 500 };
    }
}

/**
 * Función para obtener una serie por FK_Pulicacion
 * @param {number} id - Id de la serie a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */

const getSeriesByFkPublication = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM series WHERE FK_Publicacion = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la serie por id', status: 500 };
    }
}

/**
 * Función para obtener una serie por FK_Clasificacion
 * @param {number} id - Id de la serie a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */

const getSeriesByFkClassification = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM series WHERE FK_Clasificacion = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la serie por id', status: 500 };
    }
}

/**
 * Función para obtener una serie por FK_Escala
 * @param {number} id - Id de la serie a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */

const getSeriesByFkScale = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM series WHERE FK_Escala = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la serie por id', status: 500 };
    }
}

/**
 * Función para obtener una serie por FK_Unidad
 * @param {number} id - Id de la serie a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */

const getSeriesByFkUnit = async (id: number): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM series WHERE FK_Unidad = ' + id);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener la serie por id', status: 500 };
    }
}

export const seriesMethods= { getSeries, getSeriesById, getSeriesByCod, getSeriesByFkOperation, getSeriesByFkPeriodicity, getSeriesByFkPublication, getSeriesByFkClassification, getSeriesByFkScale, getSeriesByFkUnit }; // Exporta los métodos de series
export default seriesMethods; // Exporta los métodos de series por defecto
