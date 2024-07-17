import express, { Request, Response } from 'express'; // Importa el módulo express y sus tipos de solicitud y respuesta
import userMethods from '../services/usuariosService'; // Importa el módulo 'usuariosService' que contiene los métodos para manejar usuarios
import { Usuario } from '../type'; // Importa el tipo de usuario definido en 'type'

const router = express.Router(); // Crea un enrutador de express

// Ruta para obtener todos los usuarios
router.get('/usuarios', userMethods.getUsers);

// Ruta para obtener un usuario por correo electrónico
router.get('/usuarios/getUsuario/:email', async (req: Request, res: Response) => {
    try {
        const usuario = await userMethods.getUserByEmail(req.params.email); // Obtiene el usuario por correo electrónico
        console.log(usuario);
        if (usuario) {
            res.json(usuario); // Devuelve el usuario si se encuentra
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' }); // Devuelve un error 404 si el usuario no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
});

// Ruta para agregar un nuevo usuario
router.post('/usuarios/addUsuario', async (req: Request, res: Response) => {
    try {
        const usuario = await userMethods.addUser(req.body); // Agrega un nuevo usuario
        res.status(201).json(usuario); // Devuelve el usuario añadido con un código de estado 201
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
});

// Ruta para eliminar un usuario por correo electrónico
router.delete('/usuarios/deleteUsuario/:email', async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        const result = await userMethods.deleteUser(email); // Elimina el usuario por correo electrónico
        res.json(result); // Devuelve el resultado de la eliminación
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
});

// Ruta para actualizar un usuario por correo electrónico
router.put('/usuarios/updateUsuario/:email', async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        const { nombre, apellido, telefono, password } = req.body;

        if (!nombre || !apellido || !telefono || !password) {
            res.status(400).json({ message: "Bad Request. Please fill all fields." }); // Devuelve un error 400 si no se proporcionan todos los campos
            return;
        }

        const user: Usuario = { nombre, apellido, email, telefono, password }; // Crea un objeto de usuario con los datos actualizados
        const result = await userMethods.updateUser(email, user); // Actualiza el usuario
        res.json(result); // Devuelve el resultado de la actualización
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
});

router.post('/usuarios/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            res.status(400).json({ error: "Bad Request. Please provide email and password." });
            return;
        }
        
        const usuario = await userMethods.login(email, password);
        
        if (!usuario) {
            res.status(400).json({ error: "Invalid email or password." });
            return;
        }
        
        res.status(200).json({ message: "Login successful.", usuario });
    } catch (error: any) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: "Internal Server Error. Please try again later." });
    }
});


export default router; // Exporta el enrutador
