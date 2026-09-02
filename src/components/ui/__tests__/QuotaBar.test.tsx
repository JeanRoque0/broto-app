import { render, screen } from "@testing-library/react-native";

import { QuotaBar } from "@/components/ui/QuotaBar";

describe("QuotaBar", () => {
  it("mostra o rótulo e a proporção que sobrou", () => {
    render(<QuotaBar label="Análises" left={30} total={40} />);

    expect(screen.getByText("Análises")).toBeTruthy();
    expect(screen.getByText("75%")).toBeTruthy();
  });

  it("mostra zero quando acabou", () => {
    render(<QuotaBar label="Brotinho" left={0} total={150} />);

    expect(screen.getByText("0%")).toBeTruthy();
  });

  it("não passa de cem por cento", () => {
    render(<QuotaBar label="Análises" left={99} total={40} />);

    expect(screen.getByText("100%")).toBeTruthy();
  });

  it("não quebra quando o plano não tem teto", () => {
    render(<QuotaBar label="Análises" left={0} total={0} />);

    expect(screen.getByText("0%")).toBeTruthy();
  });
});
