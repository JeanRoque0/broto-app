import Svg, { Circle, Ellipse, G, Path, Rect } from "react-native-svg";

import { theme } from "@/style/theme";

const SPROUT = "M0 -42 Q3.7 -46.4 4.9 -51.3";
const SPROUT_RADIUS = 48;
const POT_BODY = "M-94 2 L94 2 L72 96 Q72 112 54 112 L-54 112 Q-72 112 -72 96 Z";

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

function Sprout({ radius }: { radius: number }) {
  return (
    <G transform={`scale(${radius / SPROUT_RADIUS})`}>
      <Path
        d={SPROUT}
        fill="none"
        stroke={theme.illustration.leafDeep}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </G>
  );
}

export function BrotinhoArt({ size = 148 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Circle cx={100} cy={100} r={92} fill={theme.illustration.canvas} />

      <G transform="translate(100 72)">
        <Path
          d="M-4 60 L-4 12 Q-4 4 4 4 L4 60 Z"
          fill={theme.illustration.leafDeep}
        />

        <Circle cx={0} cy={0} r={34} fill={theme.illustration.leaf} />

        <Sprout radius={34} />

        <G transform="translate(0 2)">
          <Face scale={0.85} />
        </G>
      </G>

      <G transform="translate(100 146) scale(0.33) translate(0 -33)">
        <Rect
          x={-108}
          y={-46}
          width={216}
          height={40}
          rx={14}
          fill={theme.illustration.potRim}
        />
        <Path d={POT_BODY} fill={theme.illustration.pot} />
      </G>
    </Svg>
  );
}

export function BrotinhoFace({ size = 34 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx={50} cy={50} r={48} fill={theme.illustration.leaf} />

      <G transform="translate(50 50)">
        <Sprout radius={SPROUT_RADIUS} />
      </G>

      <G transform="translate(50 52) scale(1.15)">
        <Face />
      </G>
    </Svg>
  );
}
