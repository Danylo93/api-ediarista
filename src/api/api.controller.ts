import { Controller, Get } from '@nestjs/common';
import { HateosIndex } from 'src/core/hateoas/hateoas-index';

@Controller('api')
export class ApiController {
  constructor(private hateoas: HateosIndex) {}
  @Get()
  index() {
    return { links: this.hateoas.gerarLinksHateos() };
  }
}
