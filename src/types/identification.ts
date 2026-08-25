export type Probability = "alta" | "media" | "baixa";

export type LightLevel =
  | "sol_direto"
  | "sol_parcial"
  | "luz_indireta"
  | "meia_sombra"
  | "sombra";

export type FertilizerPace =
  | "quinzenal"
  | "mensal"
  | "bimestral"
  | "estacional"
  | "nao_precisa";

export interface SymptomMark {
  x: number;
  y: number;
  raio: number;
}

export interface Diagnosis {
  causa: string;
  probabilidade: Probability;
  sinais: string;
  acao: string;
  marcacao: SymptomMark | null;
}

export interface Care {
  rega_dias: number;
  luz: LightLevel;
  luz_nota: string;
  adubo: FertilizerPace;
  adubo_nota: string;
  vaporizar_dias: number | null;
  girar_dias: number;
  replantar_meses: number;
  podar_mes: number | null;
}

export interface Temperature {
  min_c: number;
  max_c: number;
  nota: string;
}

export interface AnalysisResult {
  especie: {
    comum: string;
    cientifico: string;
    confianca: number;
  } | null;
  cuidados: Care | null;
  toxica_para_pets: boolean | null;
  temperatura: Temperature | null;
  cultivo: string | null;
  simbolismo: string | null;
  saude: "saudavel" | "atencao" | "problema";
  diagnostico: Diagnosis[];
  como_confirmar: string | ConfirmStep[] | null;
}

export interface ConfirmStep {
  causa: string;
  teste: string;
}

export interface AnalysisError {
  erro: "foto_ilegivel";
}

export interface AnalysisSuccess extends AnalysisResult {
  identification_id: string | null;
}

export type AnalysisResponse = AnalysisSuccess | AnalysisError;

export function isAnalysisError(
  response: AnalysisResponse,
): response is AnalysisError {
  return "erro" in response;
}

export interface Identification {
  id: string;
  user_id: string;
  plant_id: string | null;
  kind: "species" | "diagnosis";
  photo_path: string;
  result: AnalysisResult;
  confidence: number | null;
  corrected_species: string | null;
  was_helpful: boolean | null;
  resolved_at: string | null;
  created_at: string;
}
