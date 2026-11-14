import React from "react";

// Ikon garis sederhana, 40×40, mengikuti currentColor.
const I: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 44,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const IcLayers = () => (
  <I>
    <path d="M20 5 L36 13 L20 21 L4 13 Z" />
    <path d="M4 20 L20 28 L36 20" />
    <path d="M4 27 L20 35 L36 27" />
  </I>
);
export const IcShield = () => (
  <I>
    <path d="M20 4 L34 9 V19 C34 28 27 33 20 36 C13 33 6 28 6 19 V9 Z" />
    <path d="M13 20 L18 25 L27 15" />
  </I>
);
export const IcDoc = () => (
  <I>
    <path d="M9 4 H25 L32 11 V36 H9 Z" />
    <path d="M25 4 V11 H32" />
    <path d="M14 18 H27 M14 24 H27 M14 30 H22" />
  </I>
);
export const IcColumn = () => (
  <I>
    <rect x={14} y={6} width={12} height={28} />
    <path d="M8 34 H32 M8 6 H32" />
  </I>
);
export const IcWeight = () => (
  <I>
    <path d="M12 14 H28 L33 35 H7 Z" />
    <circle cx={20} cy={9} r={4} />
  </I>
);
export const IcCrack = () => (
  <I>
    <rect x={5} y={5} width={30} height={30} />
    <path d="M18 5 L22 13 L16 19 L23 26 L19 35" />
  </I>
);
export const IcSoil = () => (
  <I>
    <path d="M4 14 H36" />
    <path d="M20 4 V30 L16 24 M20 30 L24 24" />
    <path d="M7 22 L10 20 M28 30 L31 28 M8 32 L11 30" />
  </I>
);
export const IcHammer = () => (
  <I>
    <path d="M6 12 L16 4 L22 10 L12 18 Z" />
    <path d="M17 13 L34 32" />
  </I>
);
export const IcScan = () => (
  <I>
    <path d="M5 12 V5 H12 M28 5 H35 V12 M35 28 V35 H28 M12 35 H5 V28" />
    <path d="M5 20 H35" />
    <circle cx={14} cy={20} r={2} fill="currentColor" />
    <circle cx={26} cy={20} r={2} fill="currentColor" />
  </I>
);
export const IcStamp = () => (
  <I>
    <path d="M15 4 H25 V14 L30 20 H10 L15 14 Z" />
    <path d="M7 26 H33 M7 33 H33" />
  </I>
);
export const IcSite = () => (
  <I>
    <rect x={4} y={4} width={32} height={32} strokeDasharray="4 4" />
    <rect x={11} y={14} width={18} height={16} />
  </I>
);
export const IcStairs = () => (
  <I>
    <path d="M4 34 H12 V26 H20 V18 H28 V10 H36" />
  </I>
);
export const IcPipe = () => (
  <I>
    <path d="M14 4 V36 M26 4 V36" />
    <path d="M10 12 H18 M22 26 H30" />
  </I>
);
export const IcHead = () => (
  <I>
    <circle cx={14} cy={12} r={5} />
    <path d="M8 36 V24 C8 20 20 20 20 24 V36" />
    <path d="M32 4 V36 M28 4 H36 M28 36 H36" />
  </I>
);
export const IcWind = () => (
  <I>
    <path d="M4 14 H26 C34 14 34 4 27 6" />
    <path d="M4 22 H32 C38 22 38 32 31 30" />
    <path d="M4 30 H16" />
  </I>
);
export const IcFoot = () => (
  <I>
    <rect x={16} y={4} width={8} height={18} />
    <path d="M6 30 L14 22 H26 L34 30 Z" />
    <path d="M4 36 H36" />
  </I>
);
export const IcAnchor = () => (
  <I>
    <path d="M6 20 H22" />
    <path d="M22 12 V28 M22 20 H34" />
    <path d="M26 16 L30 20 L26 24" />
  </I>
);
export const IcCube = () => (
  <I>
    <path d="M20 4 L35 12 V28 L20 36 L5 28 V12 Z" />
    <path d="M5 12 L20 20 L35 12 M20 20 V36" />
  </I>
);
export const IcDrop = () => (
  <I>
    <path d="M20 4 C26 13 31 19 31 25 A11 11 0 0 1 9 25 C9 19 14 13 20 4 Z" />
  </I>
);
export const IcProps = () => (
  <I>
    <path d="M4 8 H36" />
    <path d="M10 8 V36 M20 8 V36 M30 8 V36" />
    <path d="M10 22 L20 14 M20 22 L30 14" />
  </I>
);
export const IcFeather = () => (
  <I>
    <path d="M30 6 C14 6 8 20 8 32 L28 12" />
    <path d="M8 32 C20 32 32 24 30 6" />
  </I>
);
export const IcRoof = () => (
  <I>
    <path d="M3 22 L20 8 L37 22" />
    <path d="M9 22 V34 H31 V22" />
    <path d="M12 22 L20 15 L28 22" />
  </I>
);
export const IcCheck = () => (
  <I>
    <path d="M8 21 L16 29 L32 11" />
  </I>
);
export const IcWarn = () => (
  <I>
    <path d="M20 5 L36 34 H4 Z" />
    <path d="M20 15 V24 M20 29 V29.5" />
  </I>
);
