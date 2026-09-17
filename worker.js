const CUSTOM_404_PATH = /^\/404(?:\.html|\/?)$/;
const CANONICAL_HOST = "cyroz.net";
const WWW_HOST = `www.${CANONICAL_HOST}`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (
      url.hostname === WWW_HOST ||
      (url.hostname === CANONICAL_HOST && url.protocol !== "https:")
    ) {
      url.hostname = CANONICAL_HOST;
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    if (CUSTOM_404_PATH.test(url.pathname)) {
      const errorPageUrl = new URL("/404", url);
      const errorPageRequest = new Request(errorPageUrl, {
        method: request.method,
        headers: request.headers,
      });
      const errorPage = await env.ASSETS.fetch(errorPageRequest);
      const headers = new Headers(errorPage.headers);
      headers.set("X-Robots-Tag", "noindex");

      return new Response(errorPage.body, {
        status: 404,
        statusText: "Not Found",
        headers,
      });
    }

    return env.ASSETS.fetch(request);
  },
};
