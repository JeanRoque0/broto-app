import { getPasswordChecks, isPasswordValid } from "@/utils/password";

const CURTO = "Ex#1";
const SEM_MAIUSCULA = "exemplo#2026";
const SEM_SIMBOLO = "Exemplo2026";
const COM_ACENTO = "Único#2026";
const COM_ESPACO = "Exemplo 2026";
const VALIDO = "Exemplo#2026";

describe("regras de senha", () => {
  it("cobra oito caracteres", () => {
    expect(getPasswordChecks(CURTO).length).toBe(false);
    expect(getPasswordChecks(VALIDO).length).toBe(true);
  });

  it("cobra maiúscula, inclusive acentuada", () => {
    expect(getPasswordChecks(SEM_MAIUSCULA).uppercase).toBe(false);
    expect(getPasswordChecks(VALIDO).uppercase).toBe(true);
    expect(getPasswordChecks(COM_ACENTO).uppercase).toBe(true);
  });

  it("cobra um caractere que não é letra nem número", () => {
    expect(getPasswordChecks(SEM_SIMBOLO).special).toBe(false);
    expect(getPasswordChecks(VALIDO).special).toBe(true);
    expect(getPasswordChecks(COM_ESPACO).special).toBe(true);
  });

  it("só aprova quando as três passam", () => {
    expect(isPasswordValid(VALIDO)).toBe(true);
    expect(isPasswordValid(SEM_MAIUSCULA)).toBe(false);
    expect(isPasswordValid(SEM_SIMBOLO)).toBe(false);
    expect(isPasswordValid(CURTO)).toBe(false);
  });

  it("não aprova vazio", () => {
    expect(isPasswordValid("")).toBe(false);
  });
});
