import { defineEventHandler } from "h3";

export default defineEventHandler(function () {
  return {
    ok: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  };
});
