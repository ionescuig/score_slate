import { defineEventHandler } from "h3";

// Coolify / proxy health probe (no auth, cheap JSON).
export default defineEventHandler(function () {
  return {
    ok: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  };
});
