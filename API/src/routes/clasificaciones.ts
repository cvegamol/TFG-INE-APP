import express, { Request, Response } from 'express'; // Importa el módulo express y sus tipos de solicitud y respuesta

import { clasificacioneMethods } from './../services/clasificacionesService';

const router = express.Router(); // Crea un enrutador de express

// Ruta para obtener todas las clasificaciones
router.get('/clasificaciones', clasificacioneMethods.getClassifications);

// Ruta para obtener una clasificación por id

router.get('/clasificaciones/getClassificationById/:id', async (req: Request, res: Response) => {
    try {
        const clasificacion = await clasificacioneMethods.getClassificationById(Number(req.params.id)); // Obtiene la clasificación por id
        if (clasificacion) {
            res.json(clasificacion); // Devuelve la clasificación si se encuentra
        } else {
            res.status(404).json({ message: 'clasificacion no encontrada' }); // Devuelve un error 404 si la clasificación no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
});

export default router; // Exporta el enrutador de express