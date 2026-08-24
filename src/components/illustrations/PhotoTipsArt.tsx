import Svg, { Circle, G, Path, Rect } from "react-native-svg";

import { theme } from "@/style/theme";

const SIZE = 88;
const LEAF = "M0 0 C 11 -14 11 -34 0 -50 C -11 -34 -11 -14 0 0 Z";

const LEAVES: [number, number, "light" | "dark"][] = [
  [-52, 0.78, "light"],
  [-27, 0.92, "dark"],
  [0, 1, "light"],
  [27, 0.92, "dark"],
  [52, 0.78, "light"],
];

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

function Plant({ faded = false }) {
  return (
    <>
      <G transform="translate(0 -14)">
        {LEAVES.map(([angle, scale, tone]) => (
          <G key={angle} transform={`rotate(${angle}) scale(${scale})`}>
            <Path
              d={LEAF}
              fill={
                faded
                  ? tone === "light"
                    ? theme.illustration.stone
                    : theme.illustration.stoneDark
                  : tone === "light"
                    ? theme.illustration.leaf
                    : theme.illustration.leafDark
              }
            />
          </G>
        ))}
      </G>

      <Path
        d="M-22 -12 L22 -12 L16 30 Q0 36 -16 30 Z"
        fill={faded ? theme.illustration.stone : theme.illustration.pot}
      />
      <Rect
        x={-26}
        y={-22}
        width={52}
        height={12}
        rx={4.5}
        fill={faded ? theme.illustration.stoneDark : theme.illustration.potRim}
      />
    </>
  );
}

function Frame({ x, width }: { x: number; width: number }) {
  return (
    <Rect
      x={x}
      y={20}
      width={width}
      height={160}
      rx={22}
      fill={theme.illustration.canvas}
      stroke={theme.functional.line}
      strokeWidth={3}
    />
  );
}

function Brackets({ x, width }: { x: number; width: number }) {
  const corners: [number, number, number, number][] = [
    [x + 16, 36, 1, 1],
    [x + width - 16, 36, -1, 1],
    [x + 16, 164, 1, -1],
    [x + width - 16, 164, -1, -1],
  ];

  return (
    <>
      {corners.map(([px, py, sx, sy]) => (
        <G
          key={`${px}-${py}`}
          transform={`translate(${px} ${py}) scale(${sx} ${sy})`}
        >
          <Rect
            width={20}
            height={4}
            rx={2}
            fill={theme.illustration.stoneDark}
          />
          <Rect
            width={4}
            height={20}
            rx={2}
            fill={theme.illustration.stoneDark}
          />
        </G>
      ))}
    </>
  );
}

export function WholePlantArt({ size = SIZE }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Frame x={20} width={160} />
      <Brackets x={20} width={160} />
      <G transform="translate(100 128)">
        <Plant />
      </G>
    </Svg>
  );
}

export function SharpLightArt({ size = SIZE }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Frame x={20} width={160} />

      <Circle cx={53} cy={53} r={16} fill={theme.secondary.ochre} />
      {RAYS.map((angle) => (
        <Rect
          key={angle}
          x={51}
          y={22}
          width={4.5}
          height={12}
          rx={2.25}
          fill={theme.secondary.ochre}
          transform={`rotate(${angle} 53 53)`}
        />
      ))}

      <G transform="translate(108 132) scale(0.98)">
        <Plant />
      </G>
    </Svg>
  );
}

export function SinglePlantArt({ size = SIZE }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Frame x={8} width={124} />
      <Brackets x={8} width={124} />

      <G transform="translate(70 130) scale(0.9)">
        <Plant />
      </G>

      <G transform="translate(162 136) scale(0.66)">
        <Plant faded />
      </G>
    </Svg>
  );
}
