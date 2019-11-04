import * as express from "express";
import { createElement } from "typed-html";
import Container from "typedi";
import { AssetResolverService } from "../service";

export interface LayoutProps {
  req: express.Request;
}

interface LayoutInternalProps extends LayoutProps {
  title: string;
  assets?: {
    styles?: string[];
    scripts?: string[];
  };
}

export const Layout = ({ assets: { styles = [], scripts = [] } = {}, title, req }: LayoutInternalProps, children?: string) => {
  const assetResolverService = Container.get(AssetResolverService);
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        {styles.concat([req.path + ".css"]).map(url => (
          <link rel="stylesheet" type="text/css" href={assetResolverService.resolve(url) || url} />
        ))}
      </head>
      <body>
        {children}
        {scripts.concat([req.path + ".js"]).map(url => (
          <script src={assetResolverService.resolve(url) || url}></script>
        ))}
      </body>
    </html>
  );
};

export const BootstrapLayout = ({ assets: { styles = [], scripts = [] } = {}, ...props }: LayoutInternalProps, children: string) => (
  <Layout {...props} assets={{
    styles: ["delivr://bootstrap.css/4"].concat(styles),
    scripts: [
      "delivr://jquery/3",
      "delivr://bootstrap.js/4"
    ].concat(scripts)
  }}>
    {children}
  </Layout>
);
