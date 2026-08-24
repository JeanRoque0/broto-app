import Svg, { Circle, Ellipse, G, Path, Rect } from "react-native-svg";

import { theme } from "@/style/theme";

function Face({ scale = 1 }) {
  return (
    <G transform={`scale(${scale})`}>
      <Circle cx={-13} cy={-4} r={4.6} fill={theme.text.primary} />
      <Circle cx={13} cy={-4} r={4.6} fill={theme.text.primary} />
      <Circle cx={-11.4} cy={-5.8} r={1.7} fill={theme.surface.card} />
      <Circle cx={14.6} cy={-5.8} r={1.7} fill={theme.surface.card} />
      <Path
        d="M-7 7 Q0 13.5 7 7"
        fill="none"
        stroke={theme.text.primary}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <Ellipse
        cx={-21}
        cy={4}
        rx={4.2}
        ry={2.8}
        fill={theme.primary.clay}
        opacity={0.28}
      />
      <Ellipse
        cx={21}
        cy={4}
        rx={4.2}
        ry={2.8}
        fill={theme.primary.clay}
        opacity={0.28}
      />
    </G>
  );
}

export function BrotinhoArt({ size = 148 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Circle cx={100} cy={100} r={92} fill={theme.illustration.canvas} />

      <G transform="translate(100 118)">
        <Path
          d="M-30 -6 L30 -6 L23 46 Q0 52 -23 46 Z"
          fill={theme.illustration.pot}
        />
        <Rect
          x={-34}
          y={-14}
          width={68}
          height={14}
          rx={7}
          fill={theme.illustration.potRim}
        />
      </G>

      <G transform="translate(100 74)">
        <Path
          d="M-4 34 L-4 6 Q-4 -2 4 -2 L4 34 Z"
          fill={theme.illustration.leafDeep}
        />

        <G transform="translate(-30 -6) rotate(-24)">
          <Ellipse
            cx={-16}
            cy={0}
            rx={22}
            ry={13}
            fill={theme.illustration.leafDark}
          />
        </G>

        <G transform="translate(30 -6) rotate(24)">
          <Ellipse
            cx={16}
            cy={0}
            rx={22}
            ry={13}
            fill={theme.illustration.leafDark}
          />
        </G>

        <Circle cx={0} cy={-14} r={40} fill={theme.illustration.leaf} />
        <Path
          d="M0 -54 Q10 -66 2 -76 Q-2 -66 -6 -60 Z"
          fill={theme.illustration.leafDeep}
        />

        <G transform="translate(0 -12)">
          <Face />
        </G>
      </G>
    </Svg>
  );
}

export function BrotinhoFace({ size = 34 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx={50} cy={50} r={48} fill={theme.illustration.leaf} />
      <Path
        d="M50 8 Q60 -4 52 -14"
        fill="none"
        stroke={theme.illustration.leafDeep}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <G transform="translate(50 52) scale(1.15)">
        <Face />
      </G>
    </Svg>
  );
}
