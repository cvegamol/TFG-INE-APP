import express, { Request, Response } from 'express'; // Importa el módulo express y sus tipos de solicitud y respuesta
import {operacionesUnidadesMethods} from './../services/operacion_unidadesService';
import e from 'express';

const router = express.Router(); // Crea un enrutador de express

// Ruta para obtener todas las operaciones_unidades

router.get('/operacion_unidades', operacionesUnidadesMethods.getOperationUnits);

// Ruta para obtener una operacion_unidad por OperacionID
router.get('/operacion_unidades/getOperationUnitByOperationId/:id', async (req: Request, res: Response) => {
    try {
        const operacionUnidad = await operacionesUnidadesMethods.getOperationUnitByOperationId(Number(req.params.id)); // Obtiene la operacion_unidad por OperacionID
        if (operacionUnidad) {
            res.json(operacionUnidad); // Devuelve la operacion_unidad si se encuentra
        } else {
            res.status(404).json({ message: 'operacion_unidad no encontrada' }); // Devuelve un error 404 si la operacion_unidad no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

// Ruta para obtener una operacion_unidad por UnidadID1

router.get('/operacion_unidades/getOperationUnitByUnitId1/:id', async (req: Request, res: Response) => {
    try {
        const operacionUnidad = await operacionesUnidadesMethods.getOperationUnitByUnitId(Number(req.params.id)); // Obtiene la operacion_unidad por UnidadID1
        if (operacionUnidad) {
            res.json(operacionUnidad); // Devuelve la operacion_unidad si se encuentra
        } else {
            res.status(404).json({ message: 'operacion_unidad no encontrada' }); // Devuelve un error 404 si la operacion_unidad no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

export default router; // Exporta el enrutador de express
