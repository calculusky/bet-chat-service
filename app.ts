import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import hpp from 'hpp';
import fs from 'fs';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import errorMiddleware from './middlewares/error';



class App {
    public app: express.Application;
    public port: string | number;


    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeSwagger();
        this.initializeErrorHandling();
    }

    //initialize middlewares
    private initializeMiddlewares() {
        this.app.use(cors());
        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`> Ready on ${this.port}`);
        })
    }

    public getServer() {
        return this.app;
    }

    //register routes
    private initializeRoutes() {
        const routePath = './routes';
        fs.readdirSync(routePath).forEach(route => {
            const theRoute = route.split('.')[0];
            const ControllerRoute = require(`${routePath}/${theRoute}`);
            const ctrlRoute = new ControllerRoute();
            this.app.use('/api', ctrlRoute.router)
        })
    }


    //initialize swagger
    initializeSwagger() {
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'BET CHAT SERVICE',
                    version: '2.0.0',
                    description: 'API Service for social bet platform'
                },
                // host: configs.connection.host,
                basePath: '/api',
                swagger: '2.0',
            },
            apis: ['swagger.yaml'],
        };

        const specs = swaggerJSDoc(options);
        this.app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }

    //error handling
    initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
}



export default App;