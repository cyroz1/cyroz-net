const CUSTOM_404_PATH = /^\/404(?:\.html|\/?)$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
