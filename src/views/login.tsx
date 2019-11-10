import { createElement } from "typed-html";
import { LayoutProps, BootstrapLayout } from "./layout";

export const LoginPage = ({ req }: LayoutProps) => (
  <BootstrapLayout req={req} title="Log In">
    <div class="container">
      <div class="row">
        <div class="mx-auto">
          <div class="form-group">
            <input id="username" type="text" class="form-control" placeholder="Username" />
            <button class="btn btn-success">Log In</button>
          </div>
        </div>
      </div>
    </div>
  </BootstrapLayout>
);
