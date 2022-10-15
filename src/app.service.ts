import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArticleDto } from './article.dto';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService
  ){}
  // ========================================= GET ALL PAGINATION ===================================
  async getAllArticle(query:{param:string}) {
    try {
      console.log(query,"SRCVs");
      
      const results = await this.prisma.article.findMany({
        skip: (+query.param - 1) * 10,
        take: 10,
      })
      if(results.length > 0){
        return results;
      }
    } catch (error) {
      throw new HttpException(
        {
          status: 204,
          error: 'NO CONTENT',
        },
        HttpStatus.NO_CONTENT,
      );
    }
  }
  // ========================================= GET ARTICLE BY ID ===================================
  async getArticleById(id:number) {
    
      const data = await this.prisma.article.findUnique({where:{id}});
      if (data) return data;
      else {
        throw new HttpException(
          {
            status: 404,
            error: 'DATA NOT FOUND',
          },
          HttpStatus.NOT_FOUND,
        );
      } 
  }
  // ========================================= POST ARTICLE ===================================
  async createArticle(article:ArticleDto) {
    try {
      console.log(article);
      
      const data = await this.prisma.article.create({data:article})
      if(data){
        return {status:201, message:"data created successfully"}
      }
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // ========================================= PATCH ARTICLE ===================================
  async editArticle(id:number, article:ArticleDto) {
    const updated = await this.prisma.article.update({where:{id}, data:article});
    if (updated) {
      return {
        status: 200,
        message: `data with id ${id} successfully edited !!`,
      };
    }

    throw new HttpException(
      {
        status: 409,
        error:
          'CONFLICT ERROR, FAILED TO UPDATE, DATA NOT FOUND OR CONFLICT THE CURRENT DATA',
      },
      HttpStatus.CONFLICT,
    );
  }
  // ========================================= DELETE ARTICLE ===================================
  async deleteArticle(id:number) {
    try {
      // console.log("delete");
      const deleted = await this.prisma.article.delete({where:{id}});
      if(deleted)
      return {status:200, message:"data deleted successfully"}
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: 'DATA NOT FOUND, ERROR TO DELETE',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
