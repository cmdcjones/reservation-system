import { useEffect, useState } from "preact/hooks";
import useSWR from "swr";

import heroImg from "./assets/hero.png";
import preactLogo from "./assets/preact.svg";
import viteLogo from "./assets/vite.svg";
import "./app.css";
import { useBoolVariation, useLDClient } from "@launchdarkly/react-sdk";

const BACKEND_URL = "http://localhost:3000";
const fetcher = (key: string) => fetch(key).then((res) => res.json());

export function App() {
  const [count, setCount] = useState(0);
  const { data, error, isLoading } = useSWR(`${BACKEND_URL}/events`, fetcher);
  const newBannerFlag = useBoolVariation("new-banner", false);
  const ldClient = useLDClient();

  const context = {
    kind: "user",
    key: "example-user-key",
    name: "Sandy",
    email: "sandy@example.com",
  };

  useEffect(() => {
    ldClient.identify(context);
  }, []);

  return (
    <>
      <section id="center">
        <div class="hero">
          <img src={heroImg} class="base" width="170" height="179" alt="" />
          <img src={preactLogo} class="framework" alt="Preact logo" />
          <img src={viteLogo} class="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <h1>New banner initialized: {newBannerFlag ? "yes" : "no"}</h1>
          <p>
            Edit <code>src/app.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          class="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div class="ticks"></div>

      <section id="spacer"></section>
      {data && (
        <div>
          Here are the current events:{" "}
          {data.events.map((e) => (
            <>
              <div>Name: {e.name}</div>
              <div>Venue: {e.venue}</div>
              <div id="spacer"></div>
            </>
          ))}{" "}
        </div>
      )}
    </>
  );
}
