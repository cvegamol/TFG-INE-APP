import { publicacionesMethods } from './../services/publicacionesService';
import express, { Request, Response } from 'express'; // Importa el módulo express y sus tipos de solicitud y respuesta

const router = express.Router(); // Crea un enrutador de express

// Ruta para obtener todas las publicaciones

router.get('/publicaciones', publicacionesMethods.getPublications);

// Ruta para obtener una publicación por id

router.get('/publicaciones/getPublicationById/:id', async (req: Request, res: Response) => {

    try {
        const publication = await publicacionesMethods.getPublicationById(Number(req.params.id)); // Obtiene la publicación por id
        if (publication) {
            res.json(publication); // Devuelve la publicación si se encuentra
        } else {
            res.status(404).json({ message: 'publicacion no encontrada' }); // Devuelve un error 404 si la publicación no se encuentra
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
    }
}
);

// Ruta para obtener una publicación por FK_Periodicidad

router.get('/publicaciones/getPublicationByFkPeriodicity/:id', async (req: Request, res: Response) => {
    
        try {
            const publication = await publicacionesMethods.getPublicationByFkPeriodicity(Number(req.params.id)); // Obtiene la publicación por FK_Periodicidad
            if (publication) {
                res.json(publication); // Devuelve la publicación si se encuentra
            } else {
                res.status(404).json({ message: 'publicacion no encontrada' }); // Devuelve un error 404 si la publicación no se encuentra
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
        }
    }
    );

// Ruta para obtener una publicación por FK_Operacion   
router.get('/publicaciones/getPublicationByFkOperation/:id', async (req: Request, res: Response) => {
        
    try {
        const publication = await publicacionesMethods.getPublicationByFkOperation(Number(req.params.id)); // Obtiene la publicación por FK_Operacion
        if (publication) {
                res.json(publication); // Devuelve la publicación si se encuentra
            } else {
                res.status(404).json({ message: 'publicacion no encontrada' }); // Devuelve un error 404 si la publicación no se encuentra
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
        }
    });

// Ruta para obtener una publicación por FK_PubFechaAct
router.get('/publicaciones/getPublicationByFkPubFechaAct/:id', async (req: Request, res: Response) => {
            
    try {
        const publication = await publicacionesMethods.getPublicationByFkPubDateAct(Number(req.params.id)); // Obtiene la publicación por FK_PubFechaAct
        if (publication) {
                res.json(publication); // Devuelve la publicación si se encuentra
            } else {
                res.status(404).json({ message: 'publicacion no encontrada' }); // Devuelve un error 404 si la publicación no se encuentra
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message }); // Devuelve un error 500 si hay algún error en el servidor
        }
    });

export default router; // Exporta el enrutador de publicaciones
    