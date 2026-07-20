# LEIA-ME — Guia para cuidar do site Decolagem Digital

Este guia explica, passo a passo, como você (sem precisar mexer em nenhum código) pode:

- Mudar os textos, o preço e a data que aparecem no site.
- Ver quem se inscreveu.
- Entender como funcionam os avisos por email.
- Entender como o site é publicado.
- Resolver os problemas mais comuns.

Tudo isso é feito por uma planilha do Google Sheets. Você não precisa entender de programação para usar este guia.

---

## 1. Como editar textos, preço e data do site

O site está conectado a uma planilha do Google Sheets chamada **"Decolagem Digital"**. Tudo que você escrever lá aparece automaticamente no site depois de alguns minutos.

### Passo a passo

1. Abra o Google Sheets e localize a planilha chamada **"Decolagem Digital"**.
2. Clique na aba (guia) chamada **`conteudo`**, na parte de baixo da tela.
3. Você vai ver uma tabela com duas colunas principais: **`chave`** (o nome do item que será alterado) e **`valor`** (o texto que aparece no site).
4. Procure, na coluna `chave`, o nome do item que você quer mudar (veja a lista completa abaixo).
5. Clique na célula correspondente na coluna **`valor`** e escreva o novo texto.
6. Pronto! Não precisa clicar em nenhum botão de "salvar" — o Google Sheets salva sozinho.
7. Aguarde alguns minutos. O site vai se atualizar automaticamente, porque ele está conectado a essa planilha. Você não precisa mexer em nenhum código.

**Importante:** edite **somente** a coluna `valor`. Não apague nem mude os nomes na coluna `chave` — eles precisam ficar exatamente como estão para o site continuar funcionando.

### Lista completa dos itens que podem ser alterados (23 no total)

| Chave (não mexer) | O que ela controla |
|---|---|
| `titulo_topo` | Título principal (a frase grande no topo do site) |
| `subtitulo_topo` | Frase logo abaixo do título principal |
| `data_aula` | Data da aula ao vivo |
| `hora_aula` | Horário da aula |
| `botao_texto` | Texto do botão de inscrição |
| `secao_dor` | Pergunta/frase da seção "Você trava?" |
| `aula_bullet_1` | 1º tópico do que será ensinado na aula |
| `aula_bullet_2` | 2º tópico do que será ensinado na aula |
| `aula_bullet_3` | 3º tópico do que será ensinado na aula |
| `aula_bullet_4` | 4º tópico do que será ensinado na aula |
| `quem_sou_titulo` | Título da seção "quem sou eu" |
| `quem_sou_texto` | Texto sobre você e sua história |
| `faq_1_p` | 1ª pergunta do FAQ (perguntas frequentes) |
| `faq_1_r` | Resposta da 1ª pergunta do FAQ |
| `faq_2_p` | 2ª pergunta do FAQ |
| `faq_2_r` | Resposta da 2ª pergunta do FAQ |
| `faq_3_p` | 3ª pergunta do FAQ |
| `faq_3_r` | Resposta da 3ª pergunta do FAQ |
| `faq_4_p` | 4ª pergunta do FAQ |
| `faq_4_r` | Resposta da 4ª pergunta do FAQ |
| `cta_final_titulo` | Título da seção final, antes do rodapé |
| `contato_email` | Email de contato mostrado no rodapé do site |
| `link_comunidade` | Link de convite da comunidade do WhatsApp (aparece na página de agradecimento) |

---

## 2. Onde ver os leads (pessoas que se inscreveram)

1. Abra a mesma planilha **"Decolagem Digital"**.
2. Clique na aba chamada **`leads`**.
3. Cada linha dessa aba representa uma pessoa que se inscreveu no site. Você vai ver a data e hora da inscrição, o nome e o email da pessoa.

Não é preciso fazer nada manualmente — cada nova inscrição feita no site aparece automaticamente como uma nova linha nessa aba.

---

## 3. Como funciona o aviso por email

Toda vez que alguém se inscreve no site, um email chega automaticamente na sua caixa de entrada, com o nome e o email da pessoa que se inscreveu.

Isso significa que você **não precisa ficar checando a planilha o tempo todo** — basta ficar de olho no seu email.

---

## 4. Comunidade do WhatsApp — quando ela ficar cheia

Depois que a pessoa se inscreve, ela vê um botão para entrar na comunidade do WhatsApp (link da chave `link_comunidade`).

O WhatsApp tem um limite de integrantes por grupo/comunidade. Como esse controle é feito por você, direto no WhatsApp, faça assim:

1. De vez em quando, abra o WhatsApp e confira quantos integrantes tem a comunidade.
2. Quando ela estiver cheia (ou perto disso), crie uma **nova comunidade** no WhatsApp e copie o novo link de convite.
3. Volte na planilha, aba `conteudo`, e troque o valor da chave `link_comunidade` pelo novo link.
4. Pronto — o botão na página de agradecimento passa a levar para a nova comunidade automaticamente, sem precisar mexer em código nem pedir ajuda técnica.

---

## 5. Como o site é publicado

O site fica hospedado em um serviço chamado **Vercel** (gratuito). Ele funciona assim:

- Quando você edita um texto na planilha e salva, o Vercel percebe a mudança sozinho depois de alguns minutos e atualiza o site automaticamente.
- Você não precisa fazer nada além de editar a planilha.
- Se, depois de alguns minutos, o site ainda não tiver atualizado, existe um botão chamado **"Redeploy"** (em português, algo como "publicar de novo") dentro do painel do Vercel. Clicar nesse botão força o site a se atualizar imediatamente.

---

## 6. Links importantes

- **Endereço do site:** `[será preenchido após o deploy]`
- **Planilha do Google Sheets:** `[será preenchido após o deploy]`
- **Painel do Vercel:** `[será preenchido após o deploy]`

Esses links serão preenchidos durante a sessão de publicação (deploy) feita ao vivo com quem configurou o site.

---

## 7. Se algo der errado

- **Se o formulário de inscrição não enviar:** verifique sua conexão com a internet e tente novamente.
- **Se a inscrição não aparecer na planilha:** espere um minuto e verifique de novo. Confira também a caixa de spam/lixo eletrônico do seu email, caso o aviso não tenha chegado na caixa de entrada principal. Se mesmo assim não resolver, entre em contato com quem configurou o site para você.
- **Se o site não atualizar depois de editar a planilha:** espere de 2 a 3 minutos, pois a atualização não é instantânea. Se ainda assim não mudar, entre no painel do Vercel e clique no botão "Redeploy" (publicar de novo).
- **Em qualquer outra dúvida:** entre em contato com quem configurou o site para você — não é necessário tentar resolver sozinho(a) nenhum problema técnico.
