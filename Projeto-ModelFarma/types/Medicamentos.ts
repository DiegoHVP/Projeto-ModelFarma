
export interface Medicamento {
  id?: number;
  nome: string;
  preco: number;
  vencimento?: string;
  quantidade?: number; //estoque
  alergias?: string[];
  faixa_etaria?: string;
  mg_ml?: string; //dosagem
  unidade?: number; //quantidade por caixa
  farmacia_id?: number;
  similares?: string[];
  genericos?: string[];
  reabastecer?: boolean;
  }
  