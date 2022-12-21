import { SDK_COINGECKO_API, SDK_COINCAP_API } from "@/services/sdk.js";
import axios from "axios";
export const TOTALMARKETCAP_API = () =>
  SDK_COINGECKO_API.get(
    "v3/global?x_cg_pro_api_key=CG-39XhuQdDhGGesfdaJso5aWM9&days=365"
  );
export const FEARGREEN_API = () =>
  axios.get("https://api.alternative.me/fng/?limit=40");
export const TOPTRENDING_API = () =>
  SDK_COINGECKO_API.get("v3/search/trending");
export const TOPTRENDING_V2_API = (data) =>
  axios.post("https://pro.coingen.net/api/v3/trending", data);
export const BTC_API = () => SDK_COINCAP_API.get("v2/assets/bitcoin");
export const ETH_API = () => SDK_COINCAP_API.get("v2/assets/ethereum");
export const STABLECOIN_API = () =>
  axios.get(
    "https://pro-api.coingecko.com/api/v3/coins/categories/?x_cg_pro_api_key=CG-39XhuQdDhGGesfdaJso5aWM9"
  );
export const HEATMAP_API = () =>
  SDK_COINGECKO_API.get(
    "v3/coins/categories/?x_cg_pro_api_key=CG-39XhuQdDhGGesfdaJso5aWM9"
  );

export const TOTALMARKETCAP_V2_API = (data) =>
  axios.post("https://api.livecoinwatch.com/overview/history", data, {
    headers: {
      "x-api-key": "b5fe7f36-96c3-449d-afb3-4fb80d119f93",
    },
  });

export const Dominance = (params) =>
  axios.get(
    "https://api.cryptorank.io/v1/global?api_key=7eedb6ab8db6cca6e18c19691dd9c7328e5403837e8b730383434e59a1a1"
  );

export const DOM_API = (data) =>
  axios.post("https://pro.coingen.net/api/v3/cryptorank", data);

export const HEATMAP_V2_API = (data) =>
  axios.post("https://api.livecoinwatch.com/coins/list", data, {
    headers: {
      "x-api-key": "b5fe7f36-96c3-449d-afb3-4fb80d119f93",
    },
  });
export const HEATMAP_ASSET_API = () =>
  axios.get("https://api.coincap.io/v2/assets");
