export interface IToken {
  id: number;
  role: { id: number; name: string; __entity: string };
  sessionId: number;
  iat: number;
  exp: number;
}
