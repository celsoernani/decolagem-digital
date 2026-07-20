# Decolagem Digital — Landing Page de Captação de Leads (Design)

**Data:** 2026-07-20
**Status:** Aprovado — pronto para plano de implementação

## 1. Objetivo

Landing page de captação de leads para o curso online **Decolagem Digital**. Captura nome + email de visitantes interessados em uma **aula ao vivo gratuita (webinar)**, que depois vende o curso. Público: **iniciantes totais** querendo começar um negócio online do zero. Mensagem central: "sai do zero".

Produto deve estar **pronto para consumo e venda**: no ar, captando, fácil de manter por pessoa não-técnica, e pronto para receber tráfego pago.

## 2. Decisões de produto (aprovadas)

- **Público:** iniciantes do zero, sem experiência.
- **Isca (lead magnet):** aula ao vivo gratuita (webinar) → vende o curso no final.
- **Destino do lead:** Google Sheets (MVP barato; migrar para email marketing quando escalar).
- **Edição de conteúdo:** pela própria planilha, sem código.
- **Orçamento:** R$0/mês (tier grátis).
- **Aviso de novo lead:** email automático para o dono a cada cadastro.

## 3. Stack (decisão técnica de Claude — usuário é leigo e delegou)

- **Frontend:** Astro + Tailwind CSS (site estático, rápido, ótimo SEO — padrão de mercado para landing pages).
- **Captura de leads:** formulário → webhook Google Apps Script → grava na planilha Google Sheets.
- **CMS de conteúdo:** aba "conteúdo" na mesma planilha; site lê no build.
- **Hospedagem:** Vercel (tier grátis). Domínio próprio opcional (~R$40/ano).
- **Custo total:** R$0/mês.

## 4. Estrutura da página (seções, nesta ordem)

1. **Hero** — promessa forte + data/hora da aula + formulário (nome + email) + botão "Quero minha vaga grátis".
2. **Dor/identificação** — fala da trava do iniciante ("não sei por onde começar").
3. **O que vai aprender na aula** — 3–4 bullets do conteúdo da aula gratuita.
4. **Quem sou eu** — autoridade/história do instrutor.
5. **Prova social** — depoimentos/prints (começa vazio, preenche depois).
6. **FAQ** — 4–5 dúvidas comuns ("é grátis mesmo?", "preciso de experiência?").
7. **CTA final** — repete formulário + escassez ("vagas limitadas").
8. **Rodapé** — contato, link política de privacidade (LGPD).

**Página "Obrigado":** pós-cadastro, com instrução de próximo passo (confirmar email / entrar no WhatsApp).

## 5. Fluxo de captura de lead

1. Visitante preenche nome + email e envia.
2. Dados vão para o webhook (Apps Script) → gravam na aba **"leads"** com data/hora automática.
3. Apps Script dispara **email de aviso** ao dono ("novo lead").
4. Visitante é redirecionado para a página "Obrigado".
5. Dono acompanha/exporta leads pela planilha.

## 6. Edição de conteúdo sem código

- Aba **"conteúdo"** na planilha; cada linha é um campo (`titulo_topo`, `data_aula`, `hora_aula`, `botao_texto`, `preco`, etc.).
- Editar célula → site atualiza no próximo build automático (~1 min).

## 7. Segurança / conformidade

- **Anti-spam:** campo honeypot escondido (barra robôs, invisível ao usuário).
- **LGPD:** checkbox de consentimento no formulário + link para política de privacidade. Página de política incluída.

## 8. Visual

- Tema "decolagem/voo". Cores: azul profundo + laranja/amarelo (CTA de destaque).
- **Mobile-first** (maioria do público acessa por celular): carregamento rápido, botão grande, form curto.
- Fonte moderna legível, muito espaço em branco, foco no botão.

## 9. Performance / SEO

- Site estático, carregamento <1s (importa para não queimar verba de anúncio).
- Meta tags + imagem de compartilhamento (preview bonito no WhatsApp/redes).

## 10. Entrega

- Publicado na Vercel (deploy automático). Começa com domínio grátis da Vercel; domínio próprio quando quiser.
- Entregável: página no ar captando leads, planilha recebendo, avisos por email, edição via planilha.

## 11. Fora de escopo (YAGNI, por enquanto)

- Integração com email marketing (fase futura ao escalar).
- Área de membros / entrega do curso.
- Checkout / pagamento (isca é gratuita).
- Painel admin dedicado (planilha cobre a necessidade).
