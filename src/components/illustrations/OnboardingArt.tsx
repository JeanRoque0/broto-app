import React from "react";
import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";

import { theme } from "@/style/theme";

const SIZE = 200;

export function IdentifyArt({ size = SIZE }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Rect
        x={52}
        y={34}
        width={96}
        height={132}
        rx={14}
        fill={theme.surface.card}
        stroke={theme.functional.line}
        strokeWidth={2}
      />
      <Rect
        x={66}
        y={52}
        width={68}
        height={76}
        rx={9}
        fill={theme.illustration.canvas}
      />
      <Path
        d="M100 128 C100 106 90 98 78 92 C94 95 102 106 103 118 C105 100 116 92 128 88 C114 97 106 108 105 128Z"
        fill={theme.illustration.leaf}
      />
      <Rect
        x={66}
        y={138}
        width={42}
        height={7}
        rx={3.5}
        fill={theme.functional.line}
      />
      <Rect
        x={66}
        y={150}
        width={26}
        height={7}
        rx={3.5}
        fill={theme.primary.claySoft}
      />
      <Circle cx={146} cy={150} r={20} fill={theme.primary.clay} />
      <Path
        d="M139 150 l5 5 l10 -11"
        stroke={theme.text.onPrimary}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function DiagnoseArt({ size = SIZE }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Path
        d="M32 100 C80 56 130 60 172 104 C126 148 76 146 32 100Z"
        fill={theme.illustration.leaf}
      />
      <Path
        d="M32 100 C82 100 128 102 172 104"
        stroke={theme.illustration.leafShade}
        strokeWidth={3}
        fill="none"
      />
      <Ellipse
        cx={76}
        cy={94}
        rx={15}
        ry={10}
        fill={theme.secondary.ochre}
        opacity={0.75}
        transform="rotate(-16 76 94)"
      />
      <Ellipse
        cx={122}
        cy={112}
        rx={11}
        ry={8}
        fill={theme.secondary.ochre}
        opacity={0.55}
      />
      <Circle
        cx={140}
        cy={76}
        r={26}
        fill={theme.primary.claySoft}
        stroke={theme.primary.clay}
        strokeWidth={2.5}
      />
      <Path
        d="M140 64 v14 M140 86 v2"
        stroke={theme.primary.clay}
        strokeWidth={3.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ReminderArt({ size = SIZE }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Path
        d="M60 118 L140 118 L132 172 Q100 180 68 172 Z"
        fill={theme.illustration.pot}
      />
      <Path d="M54 106 L146 106 L143 124 L57 124 Z" fill={theme.primary.clay} />
      <Path
        d="M100 106 C100 72 86 58 66 46 C92 52 104 70 106 92 C109 64 127 50 148 42 C126 58 110 76 108 106Z"
        fill={theme.illustration.leaf}
      />
      <Circle cx={52} cy={42} r={7} fill={theme.secondary.moss} />
      <Circle cx={70} cy={26} r={5} fill={theme.secondary.moss} opacity={0.65} />
      <Circle cx={36} cy={66} r={4.5} fill={theme.secondary.moss} opacity={0.45} />
      <Rect x={132} y={136} width={44} height={44} rx={13} fill={theme.text.primary} />
      <Path
        d="M154 148 v9 l6 4"
        stroke={theme.text.onDark}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function EmptyPlantArt({ size = 150 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 150 150">
      <Ellipse cx={75} cy={132} rx={42} ry={7} fill={theme.functional.line} />
      <Path
        d="M52 84 L98 84 L92 130 Q75 136 58 130 Z"
        fill={theme.illustration.pot}
      />
      <Path d="M48 78 L102 78 L100 90 L50 90 Z" fill={theme.primary.clay} />
      <Path
        d="M75 78 C75 52 62 42 48 34 C68 38 78 54 79 70 C81 50 94 38 110 32 C94 44 83 56 82 78Z"
        fill={theme.illustration.leaf}
      />
    </Svg>
  );
}

export function MailArt({ size = 140 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 140 140">
      <Rect
        x={16}
        y={44}
        width={108}
        height={76}
        rx={14}
        fill={theme.surface.card}
        stroke={theme.functional.line}
        strokeWidth={2}
      />
      <Path
        d="M16 58 Q16 44 30 44 L110 44 Q124 44 124 58 L70 96 Z"
        fill={theme.surface.container}
        stroke={theme.functional.line}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path
        d="M16 58 L70 96 L124 58"
        stroke={theme.primary.clay}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
