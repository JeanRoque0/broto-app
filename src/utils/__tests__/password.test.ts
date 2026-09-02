import { getPasswordChecks, isPasswordValid } from "@/utils/password";

describe("regras de senha", () => {
  it("cobra oito caracteres", () => {
    expect(getPasswordChecks("Ab#1").length).toBe(false);
    expect(getPasswordChecks("Ab#12345").length).toBe(true);
  });

  it("cobra maiúscula, inclusive acentuada", () => {
    expect(getPasswordChecks("jiboia#1").uppercase).toBe(false);
    expect(getPasswordChecks("Jiboia#1").uppercase).toBe(true);
    expect(getPasswordChecks("Água#123").uppercase).toBe(true);
  });

  it("cobra um caractere que não é letra nem número", () => {
    expect(getPasswordChecks("Jiboia12").special).toBe(false);
    expect(getPasswordChecks("Jiboia1#").special).toBe(true);
    expect(getPasswordChecks("Jiboia 1").special).toBe(true);
  });

  it("só aprova quando as três passam", () => {
    expect(isPasswordValid("Jiboia#2026")).toBe(true);
    expect(isPasswordValid("jiboia#2026")).toBe(false);
    expect(isPasswordValid("Jiboia2026")).toBe(false);
    expect(isPasswordValid("Ji#26")).toBe(false);
  });

  it("não aprova vazio", () => {
    expect(isPasswordValid("")).toBe(false);
  });
});
