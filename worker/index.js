/**
 * Luciano Júnior | Editor de Vídeo — Cloudflare Worker
 *
 * Rotas:
 *   GET  /api/settings          → Retorna configurações (público)
 *   POST /api/settings          → Atualiza configurações (requer X-ADMIN-KEY)
 *   OPTIONS /api/settings       → CORS preflight
 *
 * Binding D1: DB (configurado no wrangler.toml)
 * Senha admin: luciano2026 (via header X-ADMIN-KEY)
 */

const ADMIN_KEY    = 'luciano2026';
const ALLOWED_KEYS = ['price', 'whatsapp', 'hero_title', 'hero_sub'];

/* ── CORS Headers ─────────────────────────────────────────── */
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-ADMIN-KEY',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function error(message, status = 400) {
  return json({ error: message }, status);
}

/* ── Handler principal ────────────────────────────────────── */
export default {
  async fetch(request, env) {
    const url    = new URL(request.url);
    const method = request.method.toUpperCase();

    /* CORS Preflight */
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    /* Rota: /api/settings */
    if (url.pathname === '/api/settings') {

      /* ── GET: retorna configurações ── */
      if (method === 'GET') {
        try {
          const row = await env.DB
            .prepare('SELECT price, whatsapp, hero_title, hero_sub FROM settings WHERE id = 1')
            .first();

          if (!row) {
            return error('Configurações não encontradas. Execute o schema.sql.', 404);
          }

          return json(row);
        } catch (err) {
          console.error('[Worker] GET /api/settings error:', err.message);
          return error('Erro interno ao buscar configurações.', 500);
        }
      }

      /* ── POST: atualiza configurações (protegido) ── */
      if (method === 'POST') {
        const key = request.headers.get('X-ADMIN-KEY') || '';
        if (key !== ADMIN_KEY) {
          return error('Não autorizado. Verifique a chave de acesso.', 401);
        }

        let body;
        try {
          body = await request.json();
        } catch {
          return error('JSON inválido no corpo da requisição.', 400);
        }

        /* Filtra apenas campos permitidos */
        const updates = {};
        for (const k of ALLOWED_KEYS) {
          if (body[k] !== undefined && typeof body[k] === 'string') {
            updates[k] = body[k].trim();
          }
        }

        if (Object.keys(updates).length === 0) {
          return error('Nenhum campo válido para atualizar.', 400);
        }

        /* Monta query dinâmica */
        const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        const values     = [...Object.values(updates), 1]; // 1 = id

        try {
          await env.DB
            .prepare(`UPDATE settings SET ${setClauses} WHERE id = ?`)
            .bind(...values)
            .run();

          return json({ success: true, updated: Object.keys(updates) });
        } catch (err) {
          console.error('[Worker] POST /api/settings error:', err.message);
          return error('Erro interno ao salvar configurações.', 500);
        }
      }

      return error('Método não permitido.', 405);
    }

    /* Rota não encontrada */
    return error('Rota não encontrada.', 404);
  },
};
