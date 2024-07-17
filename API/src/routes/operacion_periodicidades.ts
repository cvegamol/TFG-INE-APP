import express, { Request, Response } from 'express'; // Importa el módulo express y sus tipos de solicitud y respuesta
import {operacionPeriodicidades} from './../services/operacion_periodicidadesService';

const router = express.Router(); // Crea un enrutador de express

// Ruta para obtener todas las operaciones_periodicidades

router.get('/operacion_periodicidades', operacionPeriodicidades.getOperationPeriodicities);

// Ruta para obtener una operacion_periodicidad por OperacionID
router.get('/operacion_periodicidades/getOperationPeriodicityByOperationId/:id', async (req: Request, res: Response) => {
    try {
        const operacionPeriodicidad = await operacionPeriodicidades.getOperationPeriodicityByOperationId(Number(req.params.id)); // Obtiene la operacion_periodicidad por OperacionID
        if (operacionPeriodicidad) {
            res.json(operacionPeriodicidad); // Devuelve la operacion_periodicidad si se encuentra
        } else {
            res.status(404).json({ message: 'operacion_periodicidad no encontrada' }); // Devuelve un error 404 si la operacion_periodicidad no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

// Ruta para obtener una operacion_periodicidad por PeriodicidadID

router.get('/operacion_periodicidades/getOperationPeriodicityByPeriodicityId/:id', async (req: Request, res: Response) => {
    try {
        const operacionPeriodicidad = await operacionPeriodicidades.getOperationPeriodicityByPeriodicityId(Number(req.params.id)); // Obtiene la operacion_periodicidad por PeriodicidadID
        if (operacionPeriodicidad) {
            res.json(operacionPeriodicidad); // Devuelve la operacion_periodicidad si se encuentra
        } else {
            res.status(404).json({ message: 'operacion_periodicidad no encontrada' }); // Devuelve un error 404 si la operacion_periodicidad no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

export default router; // Exporta el enrutador de express

