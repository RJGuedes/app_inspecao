export interface IaDetailField {
  name: string;
  prop: string;
  render?: (value: unknown) => string;
  url?: (model: unknown) => string;
}
