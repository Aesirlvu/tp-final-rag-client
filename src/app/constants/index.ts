export enum Themes {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "text/plain": [".txt"],
  "text/markdown": [".md"],
};

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;

export const TIME_UNITS = {
  seconds: SECONDS,
  minutes: MINUTES,
  hours: HOURS,
  days: DAYS,
};

export const BASE_API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const PINECONE_API_URL =
  "https://medical-rag-index-caubl4j.svc.aped-4627-b74a.pinecone.io";

export const JINA_API_URL = "https://api.jina.ai";
