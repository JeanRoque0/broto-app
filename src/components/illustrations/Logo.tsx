import Svg, { G, Path, Rect } from "react-native-svg";

import { theme } from "@/style/theme";

const LEAF = "M0 0 C-56 -40.12 -40.32 -96.76 0 -118 C40.32 -96.76 56 -40.12 0 0 Z";
const CROWN =
  "M0 0 C-58 -49.64 -41.76 -119.72 0 -146 C41.76 -119.72 58 -49.64 0 0 Z";
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
    <Svg width={size} height={size} viewBox="140 55 232 420">
      <G transform="translate(256 320)" fill={plant}>
        <Rect x={-10} y={-136} width={20} height={150} rx={10} />
        <G transform="translate(0 -112)">
          <G transform="rotate(-54)">
            <Path d={LEAF} />
          </G>
          <G transform="rotate(54)">
            <Path d={LEAF} />
          </G>
          <Path d={CROWN} />
        </G>
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
