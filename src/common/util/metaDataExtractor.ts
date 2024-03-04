import { HttpService } from '@nestjs/axios';
import * as cheerio from 'cheerio';

export class MetaDataExtractor {
  constructor(private readonly httpService: HttpService) {}

  async extractor(url: string) {
    const result = await this.httpService.axiosRef.get(url);

    const $ = cheerio.load(result.data);
    const title = $('title').text();
    const thumbnail =
      $('meta[name="image"]').attr('content') ||
      $('meta[property="image"]').attr('content') ||
      $('meta[name="og:image"]').attr('content') ||
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[property="twitter:image"]').attr('content');
    const description =
      $('meta[name="og:description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[property="description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[property="twitter:description"]').attr('content');

    return { title, thumbnail, description };
  }
}
