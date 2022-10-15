import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  ForbiddenException,
  Param,
  ParseIntPipe,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { query, Request } from 'express';
import { execPath } from 'process';

@Controller('article')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // ========================================= GET ALL PAGINATION ===================================
  @Get()
  async getAllArticle(@Query() query) {
    try {
      console.log(query,"--QR");
      
      return await this.appService.getAllArticle(query);
    } catch (error) {
      return error
    }
  }
  // ========================================= GET ARTICLE BY ID ===================================
  @Get(':id')
  async getArticleById(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.appService.getArticleById(id);
    } catch (error) {
      return error;
    }
  }
  // ========================================= POST ARTICLE ===================================
  @Post()
  async createArticle(@Req() req: Request) {
    try {
      if (req.body.Title.length > 200 || req.body.Title.length < 20) {
        throw new ForbiddenException(
          'title must between 20 - 200 character',
        ).getResponse();
      }
      if (req.body.Content.length < 200) {
        throw new ForbiddenException(
          'content minimum 200 character',
        ).getResponse();
      }
      if (req.body.Category.length < 3 || req.body.Category.length > 100) {
        throw new ForbiddenException(
          'category minimum 3 character, and maximum 100 character',
        ).getResponse();
      }
      let flag = false;
      if (!req.body.Status) {
        throw new ForbiddenException(
          'status must be filled between “publish”, “draft” or “thrash”',
        ).getResponse();
      }
      if (req.body.Status) {
        flag = ['publish', 'draft', 'trash'].includes(req.body.Status);
      }
      if (flag) {
        const { Title, Content, Category, Status } = req.body;
        const newData = { Title, Content, Category, Status };
        return await this.appService.createArticle(newData);
      } else {
        console.log('else');
        throw new ForbiddenException(
          'status must be filled with publish, draft or trash',
        ).getResponse();
      }
    } catch (error) {
      return error;
    }
  }
  // ========================================= PATCH ARTICLE ===================================
  @Patch(':id')
  async editArticle(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    try {
      let exception = [];
      if (req.body.Title) {
        if (req.body.Title.length > 200 || req.body.Title.length < 20) {
          exception.push('title must between 20 - 200 character');
        }
      }
      if (req.body.Content) {
        if (req.body.Content.length < 200) {
          exception.push('content minimum 200 character');
        }
      }
      if (req.body.Category) {
        if (req.body.Category.length < 3 || req.body.Category.length > 100) {
          exception.push(
            'category minimum 3 character, and maximum 100 character',
          );
        }
      }
      if (req.body.Status) {
        if(
          !['publish', 'draft', 'trash'].includes(req.body.Status)
        ){
          exception.push(
            'status must be filled between “publish”, “draft” or “thrash”',
          );
        }
      }
      else{
        exception.push("status must be filed")
      }
      if (exception.length === 0) {
        const { Title, Content, Category, Status } = req.body;
        const newData = { Title, Content, Category, Status };
        return await this.appService.editArticle(id, newData);
      } else {
        throw new BadRequestException(exception)
      }
    } catch (error) {
      return error;
    }
  }
  // ========================================= DELETE ARTICLE ===================================
  @Delete(':id')
  async deleteArticle(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.appService.deleteArticle(id);
    } catch (error) {
      return error.getResponse()
    }
  }
}
