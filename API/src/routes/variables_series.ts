import {variables_series} from './../services/variables_seriesService';
import express, { Request, Response } from 'express'; // Importa el módulo express y sus tipos de solicitud y respuesta


const router = express.Router(); // Crea un enrutador de express

// Ruta para obtener todas las variables_series
router.get('/variables_series', variables_series.getVariableSeries);

// Ruta para obtener una variable_series por variableId
router.get('/variables_series/getVariableSeriesByVariableId/:id', async (req: Request, res: Response) => {
    try {
        const variable_series = await variables_series.getVariableSeriesByVariableId(Number(req.params.id)); // Obtiene la variable_series por variableId
        if (variable_series) {
            res.json(variable_series); // Devuelve la variable_series si se encuentra
        } else {
            res.status(404).json({ message: 'variable_series no encontrada' }); // Devuelve un error 404 si la variable_series no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
});

// Ruta para obtener una variable_series por serieId
router.get('/variables_series/getVariableSeriesBySerieId/:id', async (req: Request, res: Response) => {
    try {
        const variable_series = await variables_series.getVariableSeriesBySerieId(Number(req.params.id)); // Obtiene la variable_series por serieId
        if (variable_series) {
            res.json(variable_series); // Devuelve la variable_series si se encuentra
        } else {
            res.status(404).json({ message: 'variable_series no encontrada' }); // Devuelve un error 404 si la variable_series no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
});

export default router;  // Exporta el enrutador de variables_series por defecto