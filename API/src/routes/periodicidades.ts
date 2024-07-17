import { periodicidadesMethods } from './../services/periodicidadesService';
import express, { Request, Response } from 'express'; // Importa el módulo express y sus tipos de solicitud y respuesta

const router = express.Router(); // Crea un enrutador de express

// Ruta para obtener todas las periodicidades

router.get('/periodicidades', periodicidadesMethods.getPeriodicities);

// Ruta para obtener una periodicidad por id
router.get('/periodicidades/getPeriodicidadById/:id', async (req: Request, res: Response) => {

    try {
        const periodicidad = await periodicidadesMethods.getPeriodicityById(Number(req.params.id)); // Obtiene la periodicidad por id
        if (periodicidad) {
            res.json(periodicidad); // Devuelve la periodicidad si se encuentra
        } else {
            res.status(404).json({ message: 'periodicidad no encontrada' }); // Devuelve un error 404 si la periodicidad no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

// Ruta para obtener una periodicidad por FK_Operacion
router.get('/periodicidades/getPeriodicidadByFkOperation/:id', async (req: Request, res: Response) => {
    try {
        const periodicidad = await periodicidadesMethods.getPeriodicityByFkOperation(Number(req.params.id)); // Obtiene la periodicidad por FK_Operacion
        if (periodicidad) {
            res.json(periodicidad); // Devuelve la periodicidad si se encuentra
        } else {
            res.status(404).json({ message: 'periodicidad no encontrada' }); // Devuelve un error 404 si la periodicidad no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

export default router; // Exporta el enrutador de express