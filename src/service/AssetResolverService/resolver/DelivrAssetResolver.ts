import { UrlWithStringQuery } from "url";
import { AssetResolver } from "../AssetResolver";

@AssetResolver.Service()
export class DelivrAssetResolver extends AssetResolver {
  pattern = /^delivr\:\/\//;

  resolve({ hostname: packageName = "", pathname }: UrlWithStringQuery): string | undefined {
    const version = pathname ? pathname.replace(/\//g, "") : undefined;
    const path = this.resolvePath(packageName, version);
    return `https://cdn.jsdelivr.net/npm/${packageName.split(".")[0]}@${version || "latest"}${path || ""}`;
  }

  private resolvePath(packageName?: string, version?: string): string | undefined {
    switch (packageName) {
      case "bootstrap.js": return "/dist/js/bootstrap.min.js";
      case "bootstrap.css": return "/dist/css/bootstrap.min.css";
      case "systemjs": return "/dist/system.min.js";
    }
  }
}
