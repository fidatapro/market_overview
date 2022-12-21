import axios from "axios";

const PREFIX = process.env.VUE_APP_PREFIX ?? "api";
const COINGECKO_API = process.env.VUE_APP_COINGECKO_API ?? "";
const COINCAP_API = process.env.VUE_APP_COINCAP_API ?? "";

export const SDK_COINGECKO_API = axios.create({
  baseURL: `${COINGECKO_API}/${PREFIX}`,
  headers: {},
});
export const SDK_COINCAP_API = axios.create({
  baseURL: `${COINCAP_API}`,
  headers: {},
});
