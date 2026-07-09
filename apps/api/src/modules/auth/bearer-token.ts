import type { Request } from "express";

export function extractBearerToken(req: Request): string | null {
  const header = req.header("authorization");

  if (!header || !header.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  const token = header.slice("bearer ".length).trim();
  return token.length > 0 ? token : null;
}
