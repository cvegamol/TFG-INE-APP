import { tablasMethods } from './../services/tablasService';
import express, { Request, Response } from 'express'; // Importa el módulo express y sus tipos de solicitud y respuesta

const router = express.Router(); // Crea un enrutador de express

// Ruta para obtener todas las tablas

router.get('/tablas', tablasMethods.getTables);

// Ruta para obtener una tabla por id

router.get('/tablas/getTableById/:id', async (req: Request, res: Response) => {
    try {
        const tabla = await tablasMethods.getTableById(Number(req.params.id)); // Obtiene la tabla por id
        if (tabla) {
            res.json(tabla); // Devuelve la tabla si se encuentra
        } else {
            res.status(404).json({ message: 'tabla no encontrada' }); // Devuelve un error 404 si la tabla no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

// Ruta para obtener una tabla por FK_Periodicidad

router.get('/tablas/getTableByFkPeriodicity/:id', async (req: Request, res: Response) => {
    try {
        const tabla = await tablasMethods.getTableByFkPeriodicity(Number(req.params.id)); // Obtiene la tabla por FK_Periodicidad
        if (tabla) {
            res.json(tabla); // Devuelve la tabla si se encuentra
        } else {
            res.status(404).json({ message: 'tabla no encontrada' }); // Devuelve un error 404 si la tabla no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

// Ruta para obtener una tabla por FK_Publicacion

router.get('/tablas/getTableByFkPublication/:id', async (req: Request, res: Response) => {
    try {
        const tabla = await tablasMethods.getTableByFkPublication(Number(req.params.id)); // Obtiene la tabla por FK_Publicacion
        if (tabla) {
            res.json(tabla); // Devuelve la tabla si se encuentra
        } else {
            res.status(404).json({ message: 'tabla no encontrada' }); // Devuelve un error 404 si la tabla no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

// Ruta para obtener una tabla por FK_Periodo_ini

router.get('/tablas/getTableByFkPeriodoIni/:id', async (req: Request, res: Response) => {
    try {
        const tabla = await tablasMethods.getTableByFkPeriodIni(Number(req.params.id)); // Obtiene la tabla por FK_Periodo_ini
        if (tabla) {
            res.json(tabla); // Devuelve la tabla si se encuentra
        } else {
            res.status(404).json({ message: 'tabla no encontrada' }); // Devuelve un error 404 si la tabla no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

export default router;  // Exporta el enrutador de tablas por defecto

