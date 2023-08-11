export interface IOutput<T = void> {
  success: boolean;
  error: {
    status: number;
    message: string;
  } | null;
  data: T | null;
  token?: string;
}
