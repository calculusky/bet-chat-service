import { Router } from 'express';
import InterestController from '../controllers/interest';


class InterestRoute {
    public interestController = new InterestController();
    router = Router();

    constructor() {
        this.initializeRoute();
    }

    private initializeRoute() {
        this.router.get('/interest/interests', this.interestController.getInterests);
    }
}


module.exports = InterestRoute;