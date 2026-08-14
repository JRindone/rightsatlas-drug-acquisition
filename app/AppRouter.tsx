"use client";

import { useSyncExternalStore } from "react";
import { AcquisitionApp as PreviousVersion } from "./AcquisitionApp";
import { AssetScreenerApp } from "./AssetScreenerApp";

export function AppRouter() {
  const previous = useSyncExternalStore(
    () => () => undefined,
    () => new URLSearchParams(window.location.search).get("version") === "previous",
    () => false,
  );

  if (previous) {
    return (
      <>
        <a className="previous-return" href="./">Return to Asset Screener</a>
        <PreviousVersion />
      </>
    );
  }

  return <AssetScreenerApp />;
}
