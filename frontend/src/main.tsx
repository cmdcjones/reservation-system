import { render } from "preact";
import "./index.css";
import { App } from "./app.tsx";
import { createLDReactProvider, type LDContext } from "@launchdarkly/react-sdk";

const context: LDContext = {
  kind: "user",
  anonymous: true,
};
const LDReactProvider = createLDReactProvider(
  "6ad7d78e0a8f570736efd967",
  context,
);

render(
  <LDReactProvider>
    <App />
  </LDReactProvider>,
  document.getElementById("app")!,
);
