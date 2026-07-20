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
