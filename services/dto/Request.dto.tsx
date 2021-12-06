export class RequestDto {
  endpoint: string;
  isFormData?: boolean;
  headers?: object;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
}
