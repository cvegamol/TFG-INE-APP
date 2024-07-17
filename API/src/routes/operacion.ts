import express, { Request, Response } from 'express'; // Importa el módulo express y sus tipos de solicitud y respuesta
import {operacionesMethods} from './../services/operacionService';

const router = express.Router(); // Crea un enrutador de express

// Ruta para obtener todas las operaciones

router.get('/operaciones', operacionesMethods.getOperations);


// Ruta para obtener una operacion por id

router.get('/operaciones/getOperationById/:id', async (req: Request, res: Response) => {
    try {
        const operacion = await operacionesMethods.getOperationById(Number(req.params.id)); // Obtiene la operacion por id
        if (operacion) {
            res.json(operacion); // Devuelve la operacion si se encuentra
        } else {
            res.status(404).json({ message: 'operacion no encontrada' }); // Devuelve un error 404 si la operacion no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

// Ruta para obtener una operacion por Codigo

router.get('/operaciones/getOperationByCod/:id', async (req: Request, res: Response) => {
    try {
        const operacion = await operacionesMethods.getOperationByCode(Number(req.params.id)); // Obtiene la operacion por COD
        if (operacion) {
            res.json(operacion); // Devuelve la operacion si se encuentra
        } else {
            res.status(404).json({ message: 'operacion no encontrada' }); // Devuelve un error 404 si la operacion no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

// Ruta para obtener una operacion por Cod_IOE

router.get('/operaciones/getOperationByCodIOE/:id', async (req: Request, res: Response) => {
    try {
        const operacion = await operacionesMethods.getOperationByCodIOE(Number(req.params.id)); // Obtiene la operacion por Cod_IOE
        if (operacion) {
            res.json(operacion); // Devuelve la operacion si se encuentra
        } else {
            res.status(404).json({ message: 'operacion no encontrada' }); // Devuelve un error 404 si la operacion no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);
export default router; // Exporta el enrutador de express