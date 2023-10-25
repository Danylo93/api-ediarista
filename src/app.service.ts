import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { nome: string } {
    return { nome: 'Wesley' };
  }
}
