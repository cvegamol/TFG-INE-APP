import express, { Request, Response } from 'express'; // Importa el módulo express y sus tipos de solicitud y respuesta
import  variableMethods from '../services/variableService'; // Importa el módulo 'usuariosService' que contiene los métodos para manejar usuarios
import { Variable } from '../type';
const router = express.Router(); // Crea un enrutador de express

// Ruta para obtener todos las Variables
router.get('/variables', variableMethods.getVariables);

// Ruta para obtener una variable por csu id 
router.get('/variables/getVariable/:id', async (req: Request, res: Response) => {
    try {
        const variable = await variableMethods.getVariableById(Number(req.params.id)); // Convert the id to a number
        console.log(variable);
        if (variable) {
            res.json(variable); // Devuelve la variable si se encuentra
        } else {
            res.status(404).json({ message: 'Variable no encontrada' }); // Devuelve un error 404 si la variable no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
});

export default router;  // Exporta el enrutador de variables por defecto
