export type LabStatus = 'idle' | 'running' | 'success' | 'error';

export interface LabResult {
  status: LabStatus;
  output: string;
  error?: string;
}
