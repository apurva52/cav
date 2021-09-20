export interface SequenceDiagramData {
  seqData: SeqData[];
}

export interface SeqData {
  name: string;
  id: string;
  value: number;
  x: number;
  low: number;
  high: number;
}
