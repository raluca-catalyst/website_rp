// Edge Middleware — păzește cu parolă DOAR paginile din PAGINI:
// /cortex (resursele Build Your Cortex), /lectia-6 și /lectia-9 (paginile de lucru basetolearn L6 și L9).
// Restul site-ului nu trece prin matcher, deci rămâne neatins.

export const config = {
  matcher: ['/cortex', '/cortex/:path*', '/lectia-6', '/lectia-6.html', '/lectia-9', '/lectia-9.html'],
};

type Pagina = {
  parola: string;
  cookie: string;
  cookieVal: string;
  cookiePath: string;
  maxAge: number;
  titluTab: string;
  kicker: string;
  titlu: string;
  text: string;
};

const PAGINI: Record<string, Pagina> = {
  cortex: {
    parola: 'cortex2026',
    cookie: 'cortex_acces',
    cookieVal: 'byc-2026-ok',
    cookiePath: '/cortex',
    maxAge: 60 * 60 * 24 * 40, // 40 de zile — pagina e promisă până pe 7 sept 2026
    titluTab: 'Acces resurse — Build Your Cortex',
    kicker: 'Build Your Cortex',
    titlu: 'Pagina de resurse',
    text: 'Introdu parola primită în sală.',
  },
  'lectia-6': {
    parola: 'basetolearn1',
    cookie: 'lectia6_acces',
    cookieVal: 'btl-l6-ok',
    cookiePath: '/', // acoperă și /lectia-6, și /lectia-6.html
    maxAge: 60 * 60 * 24 * 30, // 30 de zile — lecția e pe 26 oct, tema pe 28 oct
    titluTab: 'Acces · HR Management în era AI',
    kicker: 'HR Management în era AI',
    titlu: 'Lecția 6: pagina de lucru',
    text: 'Introdu parola primită în lecție.',
  },
  'lectia-9': {
    parola: 'basetolearn1',
    cookie: 'lectia9_acces',
    cookieVal: 'btl-l9-ok',
    cookiePath: '/', // acoperă și /lectia-9, și /lectia-9.html
    maxAge: 60 * 60 * 24 * 30, // 30 de zile — lecția e pe 2 nov, tema pe 4 nov
    titluTab: 'Acces · HR Management în era AI',
    kicker: 'HR Management în era AI',
    titlu: 'Lecția 9: pagina de lucru',
    text: 'Introdu parola primită în lecție.',
  },
};

function paginaPentru(pathname: string): Pagina | null {
  if (pathname === '/cortex' || pathname.startsWith('/cortex/')) return PAGINI.cortex;
  if (pathname === '/lectia-6' || pathname === '/lectia-6.html') return PAGINI['lectia-6'];
  if (pathname === '/lectia-9' || pathname === '/lectia-9.html') return PAGINI['lectia-9'];
  return null;
}

export default async function middleware(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url);
  const p = paginaPentru(url.pathname);
  if (!p) return undefined;

  // Formularul trimite POST cu parola
  if (request.method === 'POST') {
    let parola = '';
    try {
      const form = await request.formData();
      parola = String(form.get('parola') || '').trim();
    } catch {
      parola = '';
    }
    if (parola.toLowerCase() === p.parola) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: url.pathname,
          'Set-Cookie': `${p.cookie}=${p.cookieVal}; Max-Age=${p.maxAge}; Path=${p.cookiePath}; Secure; HttpOnly; SameSite=Lax`,
        },
      });
    }
    return formular(p, true);
  }

  // GET cu cookie valid → lasă pagina să se servească
  const cookies = request.headers.get('cookie') || '';
  if (cookies.split(/;\s*/).some((c) => c === `${p.cookie}=${p.cookieVal}`)) {
    return undefined;
  }

  return formular(p, false);
}

function formular(p: Pagina, gresit: boolean): Response {
  const html = `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>${p.titluTab}</title>
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
    <span class="kicker">${p.kicker}</span>
    <h1>${p.titlu}</h1>
    <p>${p.text}</p>
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
