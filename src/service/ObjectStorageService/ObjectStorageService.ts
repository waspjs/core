import * as fs from "fs";
import * as path from "path";
import { Readable } from "stream";
import * as _ from "lodash";
import { Service } from "typedi";
import { ConfigService } from "../ConfigService";

/**
 * This is very basic, in production environments should be overridden with S3 implementation
 * or something similar
 */
@Service()
export class ObjectStorageService {
  public constructor(
    private config: ConfigService
  ) { }

  public async createReadStream(key: string, { start, end }: { start: number; end?: number }): Promise<Readable> {
    return fs.createReadStream(path.resolve(this.storageDir, key), { start, end });
  }

  public async exists(key: string): Promise<boolean> {
    try {
      await fs.promises.access(path.resolve(this.storageDir, key));
      return true;
    } catch (err) {
      return false;
    }
  }

  public async getSize(key: string): Promise<number> {
    const stats = await fs.promises.stat(path.resolve(this.storageDir, key));
    return stats.size;
  }

  public async isFile(key: string): Promise<boolean> {
    const stats = await fs.promises.stat(path.resolve(this.storageDir, key));
    return stats.isFile();
  }

  public async list(dir: string): Promise<string[]> {
    if (!await this.exists(dir)) { return []; }
    const fullDir = path.resolve(this.storageDir, dir);
    const files = await fs.promises.readdir(fullDir);
    return files.map(f => f.replace(/\\/g, "/"));
  }

  private get storageDir() {
    if (!this.config.objectStorageDir) {
      throw new Error("Missing object storage config");
    }
    return this.config.objectStorageDir;
  }
}
