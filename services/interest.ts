import { PrismaClient } from '@prisma/client';


class InterestService {

    public interest = new PrismaClient().interest;

    public findInterests = async () => {
        return await this.interest.findMany();
    }

}

export default InterestService;