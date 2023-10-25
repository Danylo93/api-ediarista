import { Injectable } from '@nestjs/common';
import {
  ControllerClass,
  ControllerMethod,
  UrlGeneratorService,
} from 'nestjs-url-generator';
import { HateoasLinks } from './hateoas.interface';

@Injectable()
export abstract class HateoasBase {
  constructor(public urlGeneratorService: UrlGeneratorService) {}
  LINKS: HateoasLinks[] = [];

  abstract gerarLinksHateos(): HateoasLinks[];

  protected adicionarLinks(
    metodo: string,
    descricao: string,
    controller: ControllerClass,
    controllerMethod: ControllerMethod,
    param?,
  ) {
    this.LINKS.push({
      type: metodo,
      rel: descricao,
      uri: this.urlGeneratorService.generateUrlFromController({
        controller: controller,
        controllerMethod: controllerMethod,
        params: param,
      }),
    });
  }
}
