import * as express from "express";
import * as _ from "lodash";
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
  };
}

export const Layout = ({ assets: { styles = [] } = {}, title, req }: LayoutInternalProps, children?: string) => {
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
        <script src={assetResolverService.resolve("delivr://systemjs")}></script>
        <script type="systemjs-importmap" src="/systemjs-config.json"></script>
        <script>{`System.import("/js${req.path}.js");`}</script>
      </body>
    </html>
  );
};

export const BootstrapLayout = ({ assets: { styles = [] } = {}, ...props }: LayoutInternalProps, children: string) => (
  <Layout {...props} assets={{
    styles: ["delivr://bootstrap.css/4"].concat(styles)
  }}>
    {children}
  </Layout>
);
