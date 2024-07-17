import express, { Request, Response } from 'express'; // Importa el módulo express y sus tipos de solicitud y respuesta
import {seriesMethods} from './../services/seriesService';

const router = express.Router(); // Crea un enrutador de express

// Ruta para obtener todas las series
router.get('/series', seriesMethods.getSeries);

// Ruta para obtener una serie por id

router.get('/series/getSerieById/:id', async (req: Request, res: Response) => {
    try {
        const serie = await seriesMethods.getSeriesById(Number(req.params.id)); // Obtiene la serie por id
        if (serie) {
            res.json(serie); // Devuelve la serie si se encuentra
        } else {
            res.status(404).json({ message: 'serie no encontrada' }); // Devuelve un error 404 si la serie no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
});

// Ruta para obtener una serie por COD

router.get('/series/getSerieByCod/:id', async (req: Request, res: Response) => {
    try {
        const serie = await seriesMethods.getSeriesByCod(String(req.params.id)); // Obtiene la serie por COD
        if (serie) {
            res.json(serie); // Devuelve la serie si se encuentra
        } else {
            res.status(404).json({ message: 'serie no encontrada' }); // Devuelve un error 404 si la serie no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
});

// Ruta para obtener una serie por FK_Operacion

router.get('/series/getSerieByFkOperation/:id', async (req: Request, res: Response) => {
    try {
        const serie = await seriesMethods.getSeriesByFkOperation(Number(req.params.id)); // Obtiene la serie por FK_Operacion
        if (serie) {
            res.json(serie); // Devuelve la serie si se encuentra
        } else {
            res.status(404).json({ message: 'serie no encontrada' }); // Devuelve un error 404 si la serie no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
});

// Ruta para obtener una serie por FK_Periodicidad

router.get('/series/getSerieByFkPeriodicidad/:id', async (req: Request, res: Response) => {
    try {
        const serie = await seriesMethods.getSeriesByFkPeriodicity(Number(req.params.id)); // Obtiene la serie por FK_Periodicidad
        if (serie) {
            res.json(serie); // Devuelve la serie si se encuentra
        } else {
            res.status(404).json({ message: 'serie no encontrada' }); // Devuelve un error 404 si la serie no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

// Ruta para obtener una serie por FK_Publicacion

router.get('/series/getSerieByFkPublicacion/:id', async (req: Request, res: Response) => {
    try {
        const serie = await seriesMethods.getSeriesByFkPublication(Number(req.params.id)); // Obtiene la serie por FK_Publicacion
        if (serie) {
            res.json(serie); // Devuelve la serie si se encuentra
        } else {
            res.status(404).json({ message: 'serie no encontrada' }); // Devuelve un error 404 si la serie no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

// Ruta para obtener una serie por FK_Clasificacion

router.get('/series/getSerieByFkClasificacion/:id', async (req: Request, res: Response) => {
    try {
        const serie = await seriesMethods.getSeriesByFkClassification(Number(req.params.id)); // Obtiene la serie por FK_Clasificacion
        if (serie) {
            res.json(serie); // Devuelve la serie si se encuentra
        } else {
            res.status(404).json({ message: 'serie no encontrada' }); // Devuelve un error 404 si la serie no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);


// Ruta para obtener una serie por FK_Escala

router.get('/series/getSerieByFkEscala/:id', async (req: Request, res: Response) => {
    try {
        const serie = await seriesMethods.getSeriesByFkScale(Number(req.params.id)); // Obtiene la serie por FK_Escala
        if (serie) {
            res.json(serie); // Devuelve la serie si se encuentra
        } else {
            res.status(404).json({ message: 'serie no encontrada' }); // Devuelve un error 404 si la serie no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

// Ruta para una serie por FK_Unidad

router.get('/series/getSerieByFkUnidad/:id', async (req: Request, res: Response) => {
    try {
        const serie = await seriesMethods.getSeriesByFkUnit(Number(req.params.id)); // Obtiene la serie por FK_Unidad
        if (serie) {
            res.json(serie); // Devuelve la serie si se encuentra
        } else {
            res.status(404).json({ message: 'serie no encontrada' }); // Devuelve un error 404 si la serie no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);



export default router;  // Exporta el enrutador de series por defecto