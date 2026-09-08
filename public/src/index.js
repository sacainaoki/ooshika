export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 農業委員会：GPS登録の中継口
    if (url.pathname === "/api/spot" && request.method === "POST") {
      try {
        const body = await request.json();
        const payload = {
          token: env.GAS_TOKEN,
          action: "save",
          record: body.record || {}
        };
        const r = await fetch(env.GAS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        return new Response(await r.text(), {
          headers: { "Content-Type": "application/json; charset=utf-8" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: String(e) }), {
          status: 500, headers: { "Content-Type": "application/json" }
        });
      }
    }

    // 狩猟：捕獲地点の中継口（狩猟GASは token+type+平置き の形）
    if (url.pathname === "/api/hunt" && request.method === "POST") {
      try {
        const body = await request.json();
        const payload = Object.assign(
          { token: env.HUNT_TOKEN, type: "hunt", action: "add" },
          body.record || {}
        );
        const r = await fetch(env.HUNT_GAS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        return new Response(await r.text(), {
          headers: { "Content-Type": "application/json; charset=utf-8" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: String(e) }), {
          status: 500, headers: { "Content-Type": "application/json" }
        });
      }
    }

    // それ以外は静的ファイル
    return env.ASSETS.fetch(request);
  }
};
