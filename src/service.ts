import { InfoBeer, PrismaClient } from "@prisma/client";


export class ContentService {
    constructor(private readonly prisma: PrismaClient) { }

    
    async createContent(nameOfBeer: string, OG: number, FG: number, alcohol: number, userId: string):Promise<InfoBeer> {
        const content = await this.prisma.infoBeer.create({
            data: {
                nameOfBeer: nameOfBeer,
                OG: OG,
                FG: FG,
                alcohol: alcohol,
                userId: userId
            }
        })
        return content
    }


    async updateContent(contentId: string, nameOfBeer: string, OG: number, FG: number, alcohol: number):Promise<InfoBeer>  {
        const content = await this.prisma.infoBeer.update({
            where: {
                id: contentId
            },
            data: {
                nameOfBeer: nameOfBeer,
                OG: OG,
                FG: FG,
                alcohol: alcohol,
            }
        })
        return content
    }


    async deleteContent(contentId: string){
        const content = await this.prisma.infoBeer.delete({
            where:{
                id: contentId
            }
        })
        return content
    }


    async getContents(userId: string) {
        return await this.prisma.infoBeer.findMany({
            where: {
                userId: userId
            },
            include: {
                user: true
            }
        })
    }
}