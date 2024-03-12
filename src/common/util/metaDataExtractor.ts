import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';

@Injectable()
export class MetaDataExtractor {
  constructor(private readonly httpService: HttpService) {}

  async extractor(url: string) {
    const result = await this.httpService.axiosRef.get(url);

    const $ = cheerio.load(result.data);
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[property="twitter:title"]').attr('content') ||
      $('title').text() ||
      '';
    const description =
      $('meta[name="og:description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[property="description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[property="twitter:description"]').attr('content') ||
      '';

    let thumbnail =
      $('meta[name="image"]').attr('content') ||
      $('meta[property="image"]').attr('content') ||
      $('meta[name="og:image"]').attr('content') ||
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[property="twitter:image"]').attr('content') ||
      $('picture source').attr('srcset');
    thumbnail = this.extractFirstSrcFromThumbnail(thumbnail);

    return { title, thumbnail, description };
  }

  private extractFirstSrcFromThumbnail(thumbnail: string): string | undefined {
    if (!thumbnail) {
      return '';
    }

    const srcsetArray = thumbnail.split(' ');
    return srcsetArray[0];
  }
}
