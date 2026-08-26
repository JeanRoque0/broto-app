import Svg, { G, Path, Rect } from "react-native-svg";

import { theme } from "@/style/theme";

const LEAF = "M38 39C38 22 30 15 20 9C34 12 41 23 42 34C44 20 53 12 64 8C52 17 45 26 44 39H38Z";
const FIT = "translate(256 306) scale(6.3529) translate(-42 -39)";
const BODY = "M-94 2 L94 2 L72 96 Q72 112 54 112 L-54 112 Q-72 112 -72 96 Z";

type LogoProps = {
  size?: number;
  tone?: "color" | "light";
};

export function Logo({ size = 64, tone = "color" }: LogoProps) {
  const light = tone === "light";
  const plant = light ? theme.text.onPrimary : theme.secondary.moss;
  const pot = light ? theme.text.onPrimary : theme.illustration.pot;
  const rim = light ? theme.text.onPrimary : theme.primary.clay;

  return (
    <Svg width={size} height={size} viewBox="110 103 292 367">
      <G transform={FIT} fill={plant}>
        <Path d={LEAF} />
      </G>

      <G transform="translate(256 352)">
        <Rect
          x={-108}
          y={-46}
          width={216}
          height={40}
          rx={14}
          fill={rim}
          opacity={light ? 0.9 : 1}
        />
        <Path d={BODY} fill={pot} opacity={light ? 0.75 : 1} />
      </G>
    </Svg>
  );
}
