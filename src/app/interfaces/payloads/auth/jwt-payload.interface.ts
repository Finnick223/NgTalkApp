export interface JwtPayload {
  exp?: number;
  sub?: string;
  roles?: string[];
  [key: string]: any;
}
