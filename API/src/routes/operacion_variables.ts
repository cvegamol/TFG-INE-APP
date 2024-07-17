import express, { Request, Response } from 'express'; // Importa el módulo express y sus tipos de solicitud y respuesta
import {operacion_variableMethods} from './../services/operacion_variablesService';

const router = express.Router(); // Crea un enrutador de express

// Ruta para obtener todas las operaciones_variables

router.get('/operacion_variables', operacion_variableMethods.getOperationVariables);

// Ruta para obtener una operacion_variable por OperacionID

router.get('/operacion_variables/getOperationVariableByOperationId/:id', async (req: Request, res: Response) => {
    try {
        const operacionVariable = await operacion_variableMethods.getOperationVariableByOperationId(Number(req.params.id)); // Obtiene la operacion_variable por OperacionID
        if (operacionVariable) {
            res.json(operacionVariable); // Devuelve la operacion_variable si se encuentra
        } else {
            res.status(404).json({ message: 'operacion_variable no encontrada' }); // Devuelve un error 404 si la operacion_variable no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

// Ruta para obtener una operacion_variable por VariableID

router.get('/operacion_variables/getOperationVariableByVariableId/:id', async (req: Request, res: Response) => {
    try {
        const operacionVariable = await operacion_variableMethods.getOperationVariableByVariableId(Number(req.params.id)); // Obtiene la operacion_variable por VariableID
        if (operacionVariable) {
            res.json(operacionVariable); // Devuelve la operacion_variable si se encuentra
        } else {
            res.status(404).json({ message: 'operacion_variable no encontrada' }); // Devuelve un error 404 si la operacion_variable no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);
export default router; // Exporta el enrutador de express