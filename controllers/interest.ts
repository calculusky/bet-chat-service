import { Request, Response, NextFunction } from 'express';
import InterestService from '../services/interest';


class InterestController {

    public interestService = new InterestService();

    public getInterests = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const interests = await this.interestService.findInterests();
            res.json({ data: interests });

        } catch (error) {
            next(error);
        }
    }

}

export default InterestController;