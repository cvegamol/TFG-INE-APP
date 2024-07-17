import { unidadesMethods } from './../services/unidadesService';
import express, { Request, Response } from 'express'; // Importa el módulo express y sus tipos de solicitud y respuesta

const router = express.Router(); // Crea un enrutador de express

// Ruta para obtener todas las unidades

router.get('/unidades', unidadesMethods.getUnits);

// Ruta para obtener una unidad por id
router.get('/unidades/getUnitById/:id', async (req: Request, res: Response) => {
    try {
        const unidad = await unidadesMethods.getUnitById(Number(req.params.id)); // Obtiene la unidad por id
        if (unidad) {
            res.json(unidad); // Devuelve la unidad si se encuentra
        } else {
            res.status(404).json({ message: 'unidad no encontrada' }); // Devuelve un error 404 si la unidad no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

export default router;  // Exporta el enrutador de unidades por defecto
