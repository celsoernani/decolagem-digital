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
  link_comunidade: "place-holder.com",
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
