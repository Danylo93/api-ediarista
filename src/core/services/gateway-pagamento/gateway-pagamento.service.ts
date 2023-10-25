import { Diaria } from 'src/api/diarias/entities/diaria.entity';
import { Pagamento } from 'src/api/pagamentos/entities/pagamento.entity';

export abstract class GatewayPagamentoService {
  abstract pagar(diaria: Diaria, cardHash: string): Promise<Pagamento>;
  abstract realizarEstornoTotal(diaria: Diaria): Promise<Pagamento>;
  abstract realizarEstornoParcial(diaria: Diaria): Promise<Pagamento>;
}
