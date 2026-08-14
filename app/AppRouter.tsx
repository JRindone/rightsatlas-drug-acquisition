"use client";

import { useSyncExternalStore } from "react";
import { AcquisitionApp as PreviousVersion } from "./AcquisitionApp";
import { AssetScreenerApp } from "./AssetScreenerApp";

export function AppRouter() {
  const assetScreener = useSyncExternalStore(
    () => () => undefined,
    () => new URLSearchParams(window.location.search).get("tool") === "asset-screener",
    () => false,
  );

  if (assetScreener) return <AssetScreenerApp />;

  return (
    <>
      <a className="asset-screener-link" href="?tool=asset-screener">Open US Specialty Asset Screener</a>
      <PreviousVersion />
    </>
  );
}
