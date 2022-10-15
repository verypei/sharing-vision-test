import { IsNotEmpty, IsString } from 'class-validator';

export class ArticleDto {
  @IsString()
  Title: string;

  @IsString()
  Content: string;

  @IsString()
  Category: string;

  @IsNotEmpty()
  @IsString()
  Status: string;
}
