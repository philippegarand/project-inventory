export interface IApiRes<T> {
  success: boolean;
  message: string;
  data: T;
}
