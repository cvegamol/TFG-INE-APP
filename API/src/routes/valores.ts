import {valoresMethods} from './../services/valoresService';
import express, { Request, Response } from 'express'; // Importa el módulo express y sus tipos de solicitud y respuesta

const router = express.Router(); // Crea un enrutador de express

// Ruta para obtener todas las valores
router.get('/valores', valoresMethods.getValores);

// Ruta para obtener una valor por id
router.get('/valores/getValorById/:id', async (req: Request, res: Response) => {
    try {
        const valor = await valoresMethods.getValorById(Number(req.params.id)); // Obtiene la valor por id
        if (valor) {
            res.json(valor); // Devuelve la valor si se encuentra
        } else {
            res.status(404).json({ message: 'valor no encontrada' }); // Devuelve un error 404 si la valor no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
});

// Ruta para obtener una valor por Fk_Variable

router.get('/valores/getValorByFkVariable/:id', async (req: Request, res: Response) => {
    try {
        const valor = await valoresMethods.getValorByFkVariable(Number(req.params.id)); // Obtiene la valor por Fk_Variable
        if (valor) {
            res.json(valor); // Devuelve la valor si se encuentra
        } else {
            res.status(404).json({ message: 'valor no encontrada' }); // Devuelve un error 404 si la valor no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
});

export default router;  // Exporta el enrutador de valores por defecto
