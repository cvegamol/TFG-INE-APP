import { escalasMethods } from './../services/escalasService';
import express, { Request, Response } from 'express'; // Importa el módulo express y sus tipos de solicitud y respuesta

const router = express.Router(); // Crea un enrutador de express

// Ruta para obtener todas las escalas

router.get('/escalas', escalasMethods.getScales);

// Ruta para obtener una escala por id

router.get('/escalas/getScaleById/:id', async (req: Request, res: Response) => {

    try {
        const escala = await escalasMethods.getScaleById(Number(req.params.id)); // Obtiene la escala por id
        if (escala) {
            res.json(escala); // Devuelve la escala si se encuentra
        } else {
            res.status(404).json({ message: 'escala no encontrada' }); // Devuelve un error 404 si la escala no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

export default router; // Exporta el enrutador de express
