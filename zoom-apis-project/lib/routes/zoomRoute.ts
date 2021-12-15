import { Request, Response, NextFunction } from "express";
import { ZoomAuthController } from "../controllers/zoomController";

export class Routes {

    public ZoomAuthController: ZoomAuthController = new ZoomAuthController()

    public routes(app): void {

        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'GET request successfulll!!!!'
                })
            })

        // // ZoomAuth 
        app.route('/api/zoom_auth/getZoomToken')
            .post((req: Request, res: Response, next: NextFunction) => {
                // middleware
                next();
            }, this.ZoomAuthController.getZoomToken)


        app.route('/api/zoom_auth')
            .post((req: Request, res: Response, next: NextFunction) => {
                // middleware
                next();
            }, this.ZoomAuthController.checkToken)

        app.route('/api/zoom_auth/deleteZoomToken')
            .post((req: Request, res: Response, next: NextFunction) => {
                // middleware
                next();
            }, this.ZoomAuthController.deleteZoomToken)

        // // ZoomAuth 
        app.route('/api/zoom_auth/getZoomMeeting')
        .post((req: Request, res: Response, next: NextFunction) => {
            // middleware
            next();
        }, this.ZoomAuthController.getZoomMeeting)


            app.route('/api/zoom_auth/getZoomRecordings')
            .post((req: Request, res: Response, next: NextFunction) => {
                // middleware
                next();
            }, this.ZoomAuthController.getZoomRecordings)
    }
}