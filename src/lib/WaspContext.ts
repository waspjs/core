import { Request } from "express";

export class WaspContext {
  constructor(
    public readonly req: Request
  ) { }
}
