import express, { Request, Response } from 'express'; // Importa el módulo express y sus tipos de solicitud y respuesta
import { operacionClasificacionesMethods } from './../services/operacion_clasificacionesService';

const router = express.Router(); // Crea un enrutador de express

// Ruta para obtener todas las operacionClasificaciones

router.get('/operacionClasificaciones', operacionClasificacionesMethods.getOperationClassifications);

// Ruta para obtener una operacionClasificacion por operacion_id
router.get('/operacionClasificaciones/getOperationClassificationByOperationId/:id', async (req: Request, res: Response) => {
    try {
        const operacionClasificacion = await operacionClasificacionesMethods.getOperationClassificationByOperationId(Number(req.params.id)); // Obtiene la operacionClasificacion por operacion_id
        if (operacionClasificacion) {
            res.json(operacionClasificacion); // Devuelve la operacionClasificacion si se encuentra
        } else {
            res.status(404).json({ message: 'operacionClasificacion no encontrada' }); // Devuelve un error 404 si la operacionClasificacion no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

// Ruta para obtener una operacionClasificacion por clasificacion_id
router.get('/operacionClasificaciones/getOperationClassificationByClassificationId/:id', async (req: Request, res: Response) => {
    try {
        const operacionClasificacion = await operacionClasificacionesMethods.getOperationClassificationByClasificacionId(Number(req.params.id)); // Obtiene la operacionClasificacion por clasificacion_id
        if (operacionClasificacion) {
            res.json(operacionClasificacion); // Devuelve la operacionClasificacion si se encuentra
        } else {
            res.status(404).json({ message: 'operacionClasificacion no encontrada' }); // Devuelve un error 404 si la operacionClasificacion no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

export default router; // Exporta el enrutador de express

