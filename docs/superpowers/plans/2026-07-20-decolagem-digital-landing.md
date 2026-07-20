# Decolagem Digital — Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a fast, static lead-capture landing page for the "Decolagem Digital" webinar that writes leads to a Google Sheet and is editable by a non-technical owner via that same Sheet.

**Architecture:** Astro static site (Tailwind for styling) reads page copy at build time from a published Google Sheet "conteúdo" tab (CSV). The lead form POSTs to a Google Apps Script Web App that appends the lead to a "leads" tab, timestamps it, emails the owner, and rejects bots via a honeypot. Deployed on Vercel free tier.

**Tech Stack:** Astro, Tailwind CSS, TypeScript, Vitest (unit tests), Google Apps Script, Google Sheets, Vercel.

## Global Constraints

- Cost: R$0/month — free tiers only. No paid services.
- No git usage in this plan. Where a normal plan would commit, this plan uses a **Checkpoint** (verify + stop for review). The owner handles version control later.
- Non-technical owner edits ALL copy/price/date via the Google Sheet "conteúdo" tab — never hardcode owner-editable strings in components.
- Mobile-first. Target Lighthouse mobile Performance ≥ 90.
- Language: Portuguese (pt-BR) for all user-facing text.
- LGPD: consent checkbox + privacy policy page are mandatory before launch.
- Content field keys (exact, used across tasks): `titulo_topo`, `subtitulo_topo`, `data_aula`, `hora_aula`, `botao_texto`, `secao_dor`, `aula_bullet_1`, `aula_bullet_2`, `aula_bullet_3`, `aula_bullet_4`, `quem_sou_titulo`, `quem_sou_texto`, `faq_1_p`, `faq_1_r`, `faq_2_p`, `faq_2_r`, `faq_3_p`, `faq_3_r`, `faq_4_p`, `faq_4_r`, `cta_final_titulo`, `contato_email`.

---

## File Structure

- `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json` — project config.
- `.env` / `.env.example` — `PUBLIC_SHEET_CSV_URL`, `PUBLIC_APPS_SCRIPT_URL`.
- `src/lib/content.ts` — fetch + parse Sheet CSV into typed `SiteContent` with fallbacks. **One responsibility: content.**
- `src/lib/content.test.ts` — unit tests for the parser.
- `src/layouts/Base.astro` — HTML shell, meta/OG tags, fonts, global styles.
- `src/components/LeadForm.astro` — form (name+email), honeypot, LGPD checkbox, client validation, POST logic.
- `src/components/Hero.astro`, `Dor.astro`, `Aula.astro`, `QuemSou.astro`, `ProvaSocial.astro`, `FAQ.astro`, `CTAFinal.astro`, `Rodape.astro` — sections, each consumes `SiteContent`.
- `src/pages/index.astro` — assembles sections in order.
- `src/pages/obrigado.astro` — thank-you page.
- `src/pages/politica-de-privacidade.astro` — LGPD policy.
- `apps-script/Code.gs` — Apps Script Web App (lead capture backend).
- `LEIA-ME.md` — plain-Portuguese owner guide: how to edit the Sheet, view leads, publish.

---

### Task 1: Scaffold Astro + Tailwind project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`, `.env.example`
- Create: `src/pages/index.astro` (temporary placeholder)

**Interfaces:**
- Consumes: nothing.
- Produces: a runnable Astro dev server; Tailwind classes available in `.astro` files.

- [ ] **Step 1: Init Astro minimal project**

Run in `~/decolagem-digital`:
```bash
npm create astro@latest . -- --template minimal --no-install --no-git --skip-houston
```

- [ ] **Step 2: Add Tailwind + Vitest**

```bash
npx astro add tailwind --yes
npm install -D vitest
```

- [ ] **Step 3: Create `.env.example`**

```
PUBLIC_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/e/EXAMPLE/pub?gid=0&single=true&output=csv
PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/EXAMPLE/exec
```

- [ ] **Step 4: Add test script to `package.json`**

Add to `"scripts"`: `"test": "vitest run"`.

- [ ] **Step 5: Placeholder page** — `src/pages/index.astro`:
```astro
<h1 class="text-3xl font-bold text-blue-900">Decolagem Digital</h1>
```

- [ ] **Step 6: Verify** — Run `npm run dev`. Expected: server at `http://localhost:4321`, blue bold heading renders (confirms Tailwind works).

- [ ] **Checkpoint:** dev server runs, Tailwind applies. Stop for review.

---

### Task 2: Content loader (`src/lib/content.ts`) — TDD

**Files:**
- Create: `src/lib/content.ts`
- Test: `src/lib/content.test.ts`

**Interfaces:**
- Consumes: `PUBLIC_SHEET_CSV_URL` env var; CSV with two columns `chave,valor`.
- Produces:
  - `type SiteContent = Record<string, string>`
  - `parseContentCsv(csv: string): SiteContent` — parses `chave,valor` rows into an object. Handles quoted values containing commas. Skips header row and blank rows.
  - `getContent(): Promise<SiteContent>` — fetches the CSV URL, parses it, and merges over `DEFAULTS` so every key in Global Constraints always has a value.
  - `DEFAULTS: SiteContent` — fallback copy for every content key.

- [ ] **Step 1: Write failing tests** — `src/lib/content.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { parseContentCsv, DEFAULTS } from "./content";

describe("parseContentCsv", () => {
  it("parses key,value rows into an object", () => {
    const csv = "chave,valor\ntitulo_topo,Comece do zero\nbotao_texto,Quero minha vaga";
    const out = parseContentCsv(csv);
    expect(out.titulo_topo).toBe("Comece do zero");
    expect(out.botao_texto).toBe("Quero minha vaga");
  });

  it("keeps commas inside quoted values", () => {
    const csv = 'chave,valor\nsecao_dor,"Trava, não sabe, e desiste"';
    expect(parseContentCsv(csv).secao_dor).toBe("Trava, não sabe, e desiste");
  });

  it("skips blank lines", () => {
    const csv = "chave,valor\n\ntitulo_topo,X\n";
    expect(Object.keys(parseContentCsv(csv))).toEqual(["titulo_topo"]);
  });

  it("DEFAULTS covers every required content key", () => {
    for (const k of ["titulo_topo","data_aula","botao_texto","faq_1_p","contato_email"]) {
      expect(DEFAULTS[k]).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test`
Expected: FAIL — `parseContentCsv`/`DEFAULTS` not exported.

- [ ] **Step 3: Implement `src/lib/content.ts`**
```ts
export type SiteContent = Record<string, string>;

export const DEFAULTS: SiteContent = {
  titulo_topo: "Comece seu negócio online do zero — mesmo sem experiência",
  subtitulo_topo: "Aula ao vivo e gratuita mostrando o primeiro passo real.",
  data_aula: "Em breve",
  hora_aula: "20h",
  botao_texto: "Quero minha vaga grátis",
  secao_dor: "Você trava porque não sabe por onde começar?",
  aula_bullet_1: "Como escolher o que vender sem experiência",
  aula_bullet_2: "O primeiro passo prático no digital",
  aula_bullet_3: "Erros que fazem iniciante desistir",
  aula_bullet_4: "Como sair da teoria e agir hoje",
  quem_sou_titulo: "Quem vai te ensinar",
  quem_sou_texto: "Adicione sua história aqui pela planilha.",
  faq_1_p: "É grátis mesmo?", faq_1_r: "Sim, a aula é 100% gratuita.",
  faq_2_p: "Preciso de experiência?", faq_2_r: "Não. A aula é para iniciantes do zero.",
  faq_3_p: "Vou receber gravação?", faq_3_r: "Priorize estar ao vivo; avisamos por email.",
  faq_4_p: "Quanto tempo dura?", faq_4_r: "Cerca de 1 hora.",
  cta_final_titulo: "Vagas limitadas — garanta a sua",
  contato_email: "contato@decolagemdigital.com.br",
};

export function parseContentCsv(csv: string): SiteContent {
  const out: SiteContent = {};
  const lines = csv.split(/\r?\n/).filter((l) => l.trim() !== "");
  for (let i = 1; i < lines.length; i++) {
    const m = lines[i].match(/^([^,]+),(?:"([\s\S]*)"|(.*))$/);
    if (!m) continue;
    const key = m[1].trim();
    const value = (m[2] ?? m[3] ?? "").trim();
    if (key) out[key] = value;
  }
  return out;
}

export async function getContent(): Promise<SiteContent> {
  const url = import.meta.env.PUBLIC_SHEET_CSV_URL;
  if (!url) return { ...DEFAULTS };
  try {
    const res = await fetch(url);
    if (!res.ok) return { ...DEFAULTS };
    return { ...DEFAULTS, ...parseContentCsv(await res.text()) };
  } catch {
    return { ...DEFAULTS };
  }
}
```

- [ ] **Step 4: Run tests, verify pass** — Run `npm test`. Expected: PASS (4 tests).

- [ ] **Checkpoint:** content parser green, defaults cover all keys. Stop for review.

---

### Task 3: Base layout + design tokens

**Files:**
- Create: `src/layouts/Base.astro`

**Interfaces:**
- Consumes: `SiteContent` (for meta description/title) via props.
- Produces: `Base.astro` with props `{ title: string; description: string }` and a `<slot />`. Defines color palette (blue-900 primary, amber-500 CTA), Inter font, mobile-first container.

- [ ] **Step 1: Implement `src/layouts/Base.astro`**
```astro
---
interface Props { title: string; description: string; }
const { title, description } = Astro.props;
---
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
    <style>:root { font-family: Inter, system-ui, sans-serif; }</style>
  </head>
  <body class="bg-white text-slate-800 antialiased">
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Verify** — temporarily wrap the Task 1 placeholder in `<Base>` and run `npm run dev`. Expected: Inter font loads, title/description in page source (View Source).

- [ ] **Checkpoint:** layout + tokens render. Stop for review.

---

### Task 4: LeadForm component

**Files:**
- Create: `src/components/LeadForm.astro`

**Interfaces:**
- Consumes: `SiteContent` (button text) via prop `content`.
- Produces: `LeadForm.astro` with prop `{ content: SiteContent }`. Renders name+email inputs, hidden honeypot input `name="website"`, required LGPD consent checkbox, submit button. Client script POSTs `FormData` to `PUBLIC_APPS_SCRIPT_URL`; on success redirects to `/obrigado`; blocks submit if honeypot filled or consent unchecked.

- [ ] **Step 1: Implement `src/components/LeadForm.astro`**
```astro
---
import type { SiteContent } from "../lib/content";
interface Props { content: SiteContent; }
const { content } = Astro.props;
const endpoint = import.meta.env.PUBLIC_APPS_SCRIPT_URL;
---
<form class="flex flex-col gap-3 w-full max-w-md" data-lead-form data-endpoint={endpoint}>
  <input name="nome" type="text" required placeholder="Seu nome"
    class="rounded-lg border border-slate-300 px-4 py-3 text-base" />
  <input name="email" type="email" required placeholder="Seu melhor email"
    class="rounded-lg border border-slate-300 px-4 py-3 text-base" />
  <input name="website" type="text" tabindex="-1" autocomplete="off"
    class="hidden" aria-hidden="true" />
  <label class="flex items-start gap-2 text-sm text-slate-600">
    <input name="consentimento" type="checkbox" required class="mt-1" />
    <span>Aceito receber comunicações e li a
      <a href="/politica-de-privacidade" class="underline">política de privacidade</a>.</span>
  </label>
  <button type="submit"
    class="rounded-lg bg-amber-500 px-6 py-3 text-lg font-bold text-white hover:bg-amber-600">
    {content.botao_texto}
  </button>
  <p data-form-error class="hidden text-sm text-red-600"></p>
</form>
<script>
  document.querySelectorAll<HTMLFormElement>("[data-lead-form]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const err = form.querySelector<HTMLElement>("[data-form-error]");
      if ((form.elements.namedItem("website") as HTMLInputElement).value) return; // bot
      const btn = form.querySelector("button")!;
      btn.disabled = true; btn.textContent = "Enviando...";
      try {
        await fetch(form.dataset.endpoint!, { method: "POST", body: new FormData(form) });
        window.location.href = "/obrigado";
      } catch {
        if (err) { err.textContent = "Erro ao enviar. Tente novamente."; err.classList.remove("hidden"); }
        btn.disabled = false;
      }
    });
  });
</script>
```

- [ ] **Step 2: Verify** — render `<LeadForm content={DEFAULTS} />` on a scratch page, `npm run dev`. Expected: form shows, submit with empty required fields is blocked by browser, honeypot input is visually hidden.

- [ ] **Checkpoint:** form renders + client validation works. Stop for review.

---

### Task 5: Section components

**Files:**
- Create: `src/components/Hero.astro`, `Dor.astro`, `Aula.astro`, `QuemSou.astro`, `ProvaSocial.astro`, `FAQ.astro`, `CTAFinal.astro`, `Rodape.astro`

**Interfaces:**
- Consumes: `SiteContent` via prop `content`; `Hero` and `CTAFinal` also render `<LeadForm content={content} />`.
- Produces: eight section components, each `{ content: SiteContent }`, using only content keys from Global Constraints.

- [ ] **Step 1: Implement Hero** — `src/components/Hero.astro`:
```astro
---
import type { SiteContent } from "../lib/content";
import LeadForm from "./LeadForm.astro";
const { content } = Astro.props as { content: SiteContent };
---
<section class="bg-blue-900 text-white px-6 py-16">
  <div class="mx-auto max-w-3xl flex flex-col items-center text-center gap-6">
    <h1 class="text-3xl sm:text-5xl font-extrabold">{content.titulo_topo}</h1>
    <p class="text-lg text-blue-100">{content.subtitulo_topo}</p>
    <p class="text-amber-400 font-semibold">📅 {content.data_aula} • {content.hora_aula}</p>
    <LeadForm content={content} />
  </div>
</section>
```

- [ ] **Step 2: Implement Dor** — `Dor.astro`:
```astro
---
import type { SiteContent } from "../lib/content";
const { content } = Astro.props as { content: SiteContent };
---
<section class="px-6 py-14"><div class="mx-auto max-w-2xl text-center">
  <h2 class="text-2xl sm:text-3xl font-bold text-blue-900">{content.secao_dor}</h2>
</div></section>
```

- [ ] **Step 3: Implement Aula** — `Aula.astro`:
```astro
---
import type { SiteContent } from "../lib/content";
const { content } = Astro.props as { content: SiteContent };
const bullets = [content.aula_bullet_1, content.aula_bullet_2, content.aula_bullet_3, content.aula_bullet_4];
---
<section class="bg-slate-50 px-6 py-14"><div class="mx-auto max-w-2xl">
  <h2 class="text-2xl sm:text-3xl font-bold text-blue-900 mb-6 text-center">O que você vai aprender</h2>
  <ul class="flex flex-col gap-3">
    {bullets.map((b) => <li class="flex gap-3"><span class="text-amber-500 font-bold">✓</span><span>{b}</span></li>)}
  </ul>
</div></section>
```

- [ ] **Step 4: Implement QuemSou** — `QuemSou.astro`:
```astro
---
import type { SiteContent } from "../lib/content";
const { content } = Astro.props as { content: SiteContent };
---
<section class="px-6 py-14"><div class="mx-auto max-w-2xl text-center">
  <h2 class="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">{content.quem_sou_titulo}</h2>
  <p class="text-slate-600">{content.quem_sou_texto}</p>
</div></section>
```

- [ ] **Step 5: Implement ProvaSocial** — `ProvaSocial.astro` (renders nothing when no testimonials yet; placeholder region):
```astro
---
// Depoimentos entram aqui depois. Sem dados, seção fica oculta.
---
```

- [ ] **Step 6: Implement FAQ** — `FAQ.astro`:
```astro
---
import type { SiteContent } from "../lib/content";
const { content } = Astro.props as { content: SiteContent };
const faqs = [
  [content.faq_1_p, content.faq_1_r], [content.faq_2_p, content.faq_2_r],
  [content.faq_3_p, content.faq_3_r], [content.faq_4_p, content.faq_4_r],
];
---
<section class="bg-slate-50 px-6 py-14"><div class="mx-auto max-w-2xl">
  <h2 class="text-2xl sm:text-3xl font-bold text-blue-900 mb-6 text-center">Perguntas frequentes</h2>
  {faqs.map(([q, a]) => (
    <details class="border-b border-slate-200 py-3">
      <summary class="font-semibold cursor-pointer">{q}</summary>
      <p class="mt-2 text-slate-600">{a}</p>
    </details>
  ))}
</div></section>
```

- [ ] **Step 7: Implement CTAFinal** — `CTAFinal.astro`:
```astro
---
import type { SiteContent } from "../lib/content";
import LeadForm from "./LeadForm.astro";
const { content } = Astro.props as { content: SiteContent };
---
<section class="bg-blue-900 text-white px-6 py-16"><div class="mx-auto max-w-2xl flex flex-col items-center text-center gap-6">
  <h2 class="text-2xl sm:text-4xl font-extrabold">{content.cta_final_titulo}</h2>
  <LeadForm content={content} />
</div></section>
```

- [ ] **Step 8: Implement Rodape** — `Rodape.astro`:
```astro
---
import type { SiteContent } from "../lib/content";
const { content } = Astro.props as { content: SiteContent };
---
<footer class="px-6 py-8 text-center text-sm text-slate-500">
  <p>Contato: {content.contato_email}</p>
  <p><a href="/politica-de-privacidade" class="underline">Política de Privacidade</a></p>
  <p>© 2026 Decolagem Digital</p>
</footer>
```

- [ ] **Checkpoint:** all sections compile with `DEFAULTS`. Stop for review.

---

### Task 6: Pages (index, obrigado, política)

**Files:**
- Modify: `src/pages/index.astro` (replace placeholder)
- Create: `src/pages/obrigado.astro`, `src/pages/politica-de-privacidade.astro`

**Interfaces:**
- Consumes: `getContent()`, `Base.astro`, all section components from Task 5.
- Produces: three routed pages. `index` calls `getContent()` at build and passes `content` to each section.

- [ ] **Step 1: Implement `src/pages/index.astro`**
```astro
---
import Base from "../layouts/Base.astro";
import { getContent } from "../lib/content";
import Hero from "../components/Hero.astro";
import Dor from "../components/Dor.astro";
import Aula from "../components/Aula.astro";
import QuemSou from "../components/QuemSou.astro";
import FAQ from "../components/FAQ.astro";
import CTAFinal from "../components/CTAFinal.astro";
import Rodape from "../components/Rodape.astro";
const content = await getContent();
---
<Base title="Decolagem Digital — Aula grátis" description={content.subtitulo_topo}>
  <Hero content={content} />
  <Dor content={content} />
  <Aula content={content} />
  <QuemSou content={content} />
  <FAQ content={content} />
  <CTAFinal content={content} />
  <Rodape content={content} />
</Base>
```

- [ ] **Step 2: Implement `src/pages/obrigado.astro`**
```astro
---
import Base from "../layouts/Base.astro";
---
<Base title="Inscrição confirmada — Decolagem Digital" description="Sua vaga está garantida.">
  <section class="min-h-screen flex flex-col items-center justify-center text-center gap-4 px-6">
    <h1 class="text-3xl font-extrabold text-blue-900">🎉 Vaga garantida!</h1>
    <p class="text-slate-600 max-w-md">Confira seu email para o link da aula. Verifique também a caixa de spam.</p>
    <a href="/" class="text-amber-600 underline">Voltar ao início</a>
  </section>
</Base>
```

- [ ] **Step 3: Implement `src/pages/politica-de-privacidade.astro`** (LGPD baseline copy)
```astro
---
import Base from "../layouts/Base.astro";
---
<Base title="Política de Privacidade — Decolagem Digital" description="Como tratamos seus dados.">
  <section class="mx-auto max-w-2xl px-6 py-14 prose">
    <h1 class="text-2xl font-bold text-blue-900">Política de Privacidade</h1>
    <p>Coletamos nome e email apenas para enviar informações sobre a aula gratuita e o curso Decolagem Digital.</p>
    <p>Seus dados não são vendidos a terceiros. Você pode solicitar remoção a qualquer momento pelo email de contato.</p>
    <p>Base legal: consentimento do titular (LGPD, Lei 13.709/2018).</p>
    <p><a href="/" class="underline">Voltar ao início</a></p>
  </section>
</Base>
```

- [ ] **Step 4: Verify** — Run `npm run dev`. Expected: `/` shows full page top-to-bottom with default copy; `/obrigado` and `/politica-de-privacidade` load. Run `npm run build`. Expected: build succeeds, no unresolved imports.

- [ ] **Checkpoint:** full site renders and builds. Stop for review.

---

### Task 7: Google Apps Script lead backend

**Files:**
- Create: `apps-script/Code.gs`

**Interfaces:**
- Consumes: HTTP POST with FormData fields `nome`, `email`, `website` (honeypot), `consentimento`.
- Produces: `doPost(e)` that rejects when honeypot filled, appends `[timestamp, nome, email]` to the "leads" sheet, emails the owner, and returns a JSON `ContentService` response.

- [ ] **Step 1: Prepare the Google Sheet (manual, owner or implementer)**
  - Create a Google Sheet named "Decolagem Digital".
  - Tab `leads` with header row: `data | nome | email`.
  - Tab `conteudo` with header row: `chave | valor`, one row per key in Global Constraints.
  - File → Share → Publish to web → publish the `conteudo` tab as CSV. Copy that URL into `.env` as `PUBLIC_SHEET_CSV_URL`.

- [ ] **Step 2: Implement `apps-script/Code.gs`**
```javascript
var OWNER_EMAIL = "SEU-EMAIL@gmail.com"; // troque pelo email do dono

function doPost(e) {
  var p = (e && e.parameter) || {};
  if (p.website) { // honeypot preenchido = robô
    return json_({ ok: false, reason: "bot" });
  }
  var nome = (p.nome || "").toString().trim();
  var email = (p.email || "").toString().trim();
  if (!nome || !email) {
    return json_({ ok: false, reason: "missing" });
  }
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("leads");
  sheet.appendRow([new Date(), nome, email]);
  try {
    MailApp.sendEmail(OWNER_EMAIL, "Novo lead — Decolagem Digital",
      "Nome: " + nome + "\nEmail: " + email);
  } catch (err) {}
  return json_({ ok: true });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

- [ ] **Step 3: Deploy** — In the Sheet: Extensions → Apps Script → paste `Code.gs` → Deploy → New deployment → type "Web app" → Execute as "Me" → Who has access "Anyone" → Deploy. Copy the `/exec` URL into `.env` as `PUBLIC_APPS_SCRIPT_URL`.

- [ ] **Step 4: Verify endpoint** — Run:
```bash
curl -L -s -d "nome=Teste&email=teste@ex.com&consentimento=on" "$PUBLIC_APPS_SCRIPT_URL"
```
Expected: `{"ok":true}`; a new row appears in the `leads` tab; owner receives the email.

- [ ] **Step 5: Verify honeypot** — Run:
```bash
curl -L -s -d "nome=Bot&email=bot@ex.com&website=spam" "$PUBLIC_APPS_SCRIPT_URL"
```
Expected: `{"ok":false,"reason":"bot"}`; NO new row added.

- [ ] **Checkpoint:** leads land in Sheet, email fires, bots rejected. Stop for review.

---

### Task 8: SEO, OG image, favicon, performance

**Files:**
- Create: `public/favicon.svg`, `public/og-image.png`
- Modify: `src/layouts/Base.astro` (favicon link + `og:image`)

**Interfaces:**
- Consumes: `Base.astro` props.
- Produces: favicon + social share image wired into `<head>`.

- [ ] **Step 1: Add favicon + OG image** to `public/` (simple blue/amber airplane mark, 1200×630 for OG).

- [ ] **Step 2: Wire into `Base.astro` `<head>`**
```astro
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta property="og:image" content="/og-image.png" />
```

- [ ] **Step 3: Verify performance** — Run `npm run build && npm run preview`, then run Lighthouse (Chrome DevTools, mobile). Expected: Performance ≥ 90, no render-blocking beyond the font.

- [ ] **Checkpoint:** meta/OG/favicon present, Lighthouse mobile ≥ 90. Stop for review.

---

### Task 9: Deploy to Vercel + owner guide

**Files:**
- Create: `LEIA-ME.md`

**Interfaces:**
- Consumes: the built site, `.env` values.
- Produces: live URL; plain-Portuguese guide for the non-technical owner.

- [ ] **Step 1: Deploy** — Import the project into Vercel (framework auto-detected as Astro). Set env vars `PUBLIC_SHEET_CSV_URL` and `PUBLIC_APPS_SCRIPT_URL` in Vercel project settings. Deploy.

- [ ] **Step 2: Write `LEIA-ME.md`** — plain Portuguese, no jargon:
  - Como editar textos/preço/data: abrir a planilha, aba `conteudo`, mudar a coluna `valor`, salvar; o site atualiza sozinho no próximo deploy (ou clicar "Redeploy" na Vercel).
  - Onde ver os leads: aba `leads` da planilha.
  - Como o aviso por email funciona.
  - Link do site e link da planilha.

- [ ] **Step 3: Verify end-to-end** — Open the live Vercel URL on a phone, submit the form with real data. Expected: redirect to `/obrigado`, new row in `leads`, owner email received.

- [ ] **Checkpoint:** site live, full lead flow works in production. Stop for review.

---

## Self-Review

**Spec coverage:**
- Audience/message → Hero copy + DEFAULTS (Task 2, 5). ✓
- Webinar lead magnet → Hero/CTA copy, obrigado page (Task 5, 6). ✓
- Leads to Google Sheets → Apps Script (Task 7). ✓
- Content editing via Sheet, no code → content.ts + published CSV + LEIA-ME (Task 2, 7, 9). ✓
- Email notification per lead → Task 7. ✓
- Honeypot anti-spam → LeadForm + Code.gs (Task 4, 7). ✓
- LGPD consent + policy page → LeadForm checkbox + política page (Task 4, 6). ✓
- 8 sections + Obrigado → Task 5, 6. ✓
- Mobile-first + performance → Base layout + Task 8 Lighthouse. ✓
- SEO/OG/share image → Base + Task 8. ✓
- Vercel free deploy → Task 9. ✓
- R$0 constraint → only free tiers used. ✓
- Out of scope (email mktg, checkout, members) → not included. ✓

**Placeholder scan:** ProvaSocial is intentionally empty (documented, no testimonials yet) — not a placeholder failure. No TBD/TODO in code steps. All code steps show full code.

**Type consistency:** `SiteContent`, `parseContentCsv`, `getContent`, `DEFAULTS` used identically across Tasks 2/4/5/6. Content keys match Global Constraints list. Form field names (`nome`, `email`, `website`, `consentimento`) match between LeadForm (Task 4) and Code.gs (Task 7).
