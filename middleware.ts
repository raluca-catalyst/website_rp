// Edge Middleware — păzește DOAR /cortex (pagina de resurse Build Your Cortex).
// Restul site-ului nu trece prin matcher, deci rămâne neatins.

export const config = {
  matcher: ['/cortex', '/cortex/:path*'],
};

const PAROLA = 'cortex2026';
const COOKIE = 'cortex_acces';
const COOKIE_VAL = 'byc-2026-ok';
const MAX_AGE = 60 * 60 * 24 * 40; // 40 de zile — pagina e promisă până pe 7 sept 2026

export default async function middleware(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url);

  // Formularul trimite POST cu parola
  if (request.method === 'POST') {
    let parola = '';
    try {
      const form = await request.formData();
      parola = String(form.get('parola') || '').trim();
    } catch {
      parola = '';
    }
    if (parola.toLowerCase() === PAROLA) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: url.pathname,
          'Set-Cookie': `${COOKIE}=${COOKIE_VAL}; Max-Age=${MAX_AGE}; Path=/cortex; Secure; HttpOnly; SameSite=Lax`,
        },
      });
    }
    return formular(true);
  }

  // GET cu cookie valid → lasă pagina să se servească
  const cookies = request.headers.get('cookie') || '';
  if (cookies.split(/;\s*/).some((c) => c === `${COOKIE}=${COOKIE_VAL}`)) {
    return undefined;
  }

  return formular(false);
}

function formular(gresit: boolean): Response {
  const html = `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Acces resurse — Build Your Cortex</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{--bg:#0e0b1e;--border:rgba(167,139,250,0.14);--lavender:#a78bfa;--lavender-lt:#c4b5fd;--text:#f1eefd;--text-sec:rgba(241,238,253,0.58);}
  *{box-sizing:border-box;}
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;
    background:var(--bg);
    background-image:radial-gradient(ellipse 90% 55% at 50% -5%, #2d1569 0%, transparent 65%),
      radial-gradient(ellipse 55% 35% at 95% 15%, rgba(109,40,217,0.18) 0%, transparent 55%);
    font-family:'Barlow',sans-serif;color:var(--text);}
  .box{width:100%;max-width:420px;background:rgba(255,255,255,0.045);border:1px solid var(--border);border-radius:12px;padding:40px 36px;}
  .kicker{display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:0.68rem;font-weight:500;
    letter-spacing:0.13em;text-transform:uppercase;color:var(--lavender);margin-bottom:16px;}
  .kicker::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--lavender);box-shadow:0 0 7px var(--lavender);}
  h1{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:1.25rem;line-height:1.3;letter-spacing:-0.02em;margin:0 0 10px;}
  p{color:var(--text-sec);font-size:0.95rem;line-height:1.6;margin:0 0 24px;}
  input{width:100%;padding:12px 14px;border-radius:6px;border:1px solid var(--border);background:rgba(255,255,255,0.03);
    color:var(--text);font-family:'JetBrains Mono',monospace;font-size:1rem;outline:none;}
  input:focus{border-color:rgba(167,139,250,0.4);}
  button{width:100%;margin-top:14px;padding:12px;border:1px solid rgba(167,139,250,0.28);border-radius:6px;cursor:pointer;
    font-family:'JetBrains Mono',monospace;font-size:0.75rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;
    background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;box-shadow:0 0 18px rgba(124,58,237,0.28);}
  button:hover{background:linear-gradient(135deg,#8b5cf6,#7c3aed);}
  .err{color:#fca5a5;font-size:0.85rem;margin:12px 0 0;}
</style>
</head>
<body>
  <form class="box" method="POST">
    <span class="kicker">Build Your Cortex</span>
    <h1>Pagina de resurse</h1>
    <p>Introdu parola primită în sală.</p>
    <input type="password" name="parola" placeholder="parola" autofocus autocomplete="off">
    <button type="submit">Intră</button>
    ${gresit ? '<p class="err">Parola nu e corectă. Încearcă din nou.</p>' : ''}
  </form>
</body>
</html>`;
  return new Response(html, {
    status: 401,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
    },
  });
}
