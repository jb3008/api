import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/zoomRoute";
import * as mongoose from "mongoose";
import * as cors from 'cors';

class App {

    public app: express.Application = express();
    
    public routePrv: Routes = new Routes();
    // public mongoUrl: string = 'mongodb://localhost/CRMdb';  
    public mongoUrl: string = 'mongodb://localhost:27017/zoom_api';

    constructor() {
        this.config();
        this.mongoSetup();
        this.routePrv.routes(this.app);     
    }

    private config(): void{
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // serving static files 
        this.app.use(express.static('public'));
        
    }

    private mongoSetup(): void{
        (<any>mongoose).Promise = global.Promise;
        mongoose.connect('mongodb://localhost:27017/zoom_api', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connected to MongoDB...'))
        .catch(err => console.error('Could not connect to MongoDB...', err));   
    }

}

export default new App().app;