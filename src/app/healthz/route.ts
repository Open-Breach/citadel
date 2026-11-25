import { connection } from "next/server";

/*
 * The health path, for the probes of a cluster: GET /healthz answers 200
 * with a short text. It renders no page and asks nobody, the vault least of
 * all. No page links to it.
 */
export async function GET() {
  // Answered by the running site at every request, not once by the build.
  await connection();
  return new Response("ok\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
