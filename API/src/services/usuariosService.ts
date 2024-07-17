import bcrypt from 'bcryptjs'; // Importa bcryptjs para el hashing de contraseñas
import getConnection from "./../database/database"; // Importa la función de conexión a la base de datos
import { Usuario } from "../type.d"; // Importa el tipo de usuario definido en 'types'
import axios from 'axios';
/**
 * Función para obtener todos los usuarios
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const getUsers = async (req:any, res:any) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM usuarios");
        res.json(result); // Devuelve los usuarios como respuesta
        return result;
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor' }); // Devuelve un error 500 si falla la consulta
    }
};

/**
 * Función para obtener un usuario por correo electrónico
 * @param {string} email - Correo electrónico del usuario a buscar
 * @returns {Promise} - Promesa que resuelve con el resultado de la consulta
 */
const getUserByEmail = async (email: string): Promise<any> => {
    try {
        const connection = await getConnection();
        const escapedEmail = connection.escape(email);
        const result = await connection.query('SELECT * FROM usuarios WHERE email = ' + escapedEmail);
        
        return result;
    } catch (error: any) {
        throw { message: 'Error al obtener el usuario por correo electrónico', status: 500 };
    }
};

/**
 * Función para agregar un nuevo usuario
 * @param {Object} usuario - Datos del nuevo usuario
 * @returns {Promise} - Promesa que resuelve con el resultado de la inserción
 */
const addUser = async (usuario: any): Promise<any> => {
    try {
        const connection = await getConnection();
        const hashedPassword = await bcrypt.hash(usuario.password, 10); // Hashea la contraseña antes de guardarla
        const userToSave = { ...usuario, password: hashedPassword };
        const result = await connection.query('INSERT INTO usuarios SET ?', userToSave);
        return result;
    } catch (error: any) {
        throw { message: 'Error al agregar el usuario', status: 500 };
    }
};

/**
 * Función para actualizar un usuario existente
 * @param {string} email - Correo electrónico del usuario a actualizar
 * @param {Usuario} user - Datos actualizados del usuario
 * @returns {Promise} - Promesa que resuelve con el resultado de la actualización
 */
const updateUser = async (email: string, user: Usuario): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query("UPDATE usuarios SET ? WHERE email = ?", [user, email]);
        return result;
    } catch (error: any) {
        throw { message: 'Error al actualizar el usuario', status: 500 };
    }
};

/**
 * Función para el inicio de sesión
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise} - Promesa que resuelve con los datos del usuario si la autenticación es exitosa
 */
const login = async (email: string, password: string): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM usuarios WHERE email = ?", email);
        
        if (result.length === 0) {
            return null; // No se encontró el usuario
        }
        
        const user = result[0];
        const passwordMatch = await bcrypt.compare(password, user.password); // Compara las contraseñas
        
        if (!passwordMatch) {
            return null; // La contraseña es incorrecta
        }
        
        return user;
    } catch (error: any) {
        console.error('Error al iniciar sesión:', error);
        throw { message: 'Error al iniciar sesión', status: 500 };
    }
};

/**
 * Función para eliminar un usuario
 * @param {string} email - Correo electrónico del usuario a eliminar
 * @returns {Promise} - Promesa que resuelve con el resultado de la eliminación
 */
const deleteUser = async (email: string): Promise<any> => {
    try {
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM usuarios WHERE email = ?", email);
        return result;
    } catch (error: any) {
        throw { message: 'Error al eliminar el usuario', status: 500 };
    }
};

// Exporta todas las funciones como métodos del usuario
export const userMethods = {
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    getUserByEmail,
    login
};

export default userMethods;
