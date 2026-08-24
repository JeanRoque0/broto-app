import Svg, { G, Path, Rect } from "react-native-svg";

import { theme } from "@/style/theme";

const SPROUT =
  "M38 39 C38 22 30 15 20 9 C34 12 41 23 42 34 C44 20 53 12 64 8 C52 17 45 26 44 39Z";

export function CameraPlantArt({ size = 152 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <G transform="translate(100 100) scale(1.22) translate(-100 -100)">
        <Rect
          x={62}
          y={30}
          width={76}
          height={140}
          rx={16}
          fill="none"
          stroke={theme.text.onDark}
          strokeWidth={4}
        />
        <Rect
          x={72}
          y={42}
          width={56}
          height={104}
          rx={9}
          fill={theme.functional.white20}
        />

        <G transform="translate(100 104) scale(0.78)">
          <G transform="translate(0 -30) translate(-42 -23.5)">
            <Path d={SPROUT} fill={theme.illustration.leaf} />
          </G>
          <Path
            d="M-16 -8 L16 -8 L12 26 Q0 30 -12 26 Z"
            fill={theme.illustration.pot}
          />
          <Rect
            x={-20}
            y={-16}
            width={40}
            height={10}
            rx={3.5}
            fill={theme.illustration.potRim}
          />
        </G>

        <Rect
          x={88}
          y={154}
          width={24}
          height={4}
          rx={2}
          fill={theme.functional.white55}
        />
      </G>
    </Svg>
  );
}
