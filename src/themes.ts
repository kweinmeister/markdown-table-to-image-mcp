import type { CSSProperties } from "react";
import type { TableTheme } from "./schemas.js";

export type StatusBadgeType = "success" | "warning" | "error" | "info" | "neutral";

export interface ThemeStyle {
  canvas: CSSProperties;
  card: CSSProperties;
  title: CSSProperties;
  subtitle: CSSProperties;
  footer: CSSProperties;
  table: CSSProperties;
  thRow: CSSProperties;
  th: CSSProperties;
  tdRow: CSSProperties;
  zebraRow: CSSProperties;
  td: CSSProperties;
  code: CSSProperties;
  badges: Record<StatusBadgeType, CSSProperties>;
}

const baseBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "2px 8px",
  borderRadius: "9999px",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.02em",
  fontFamily: "Roboto",
};

// Theme Style Map (Fully typed, no inline casts needed)
export const themeStyles: Record<TableTheme, ThemeStyle> = {
  glassmorphism: {
    canvas: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "32px",
      width: "100%",
      height: "100%",
      backgroundColor: "#0b0f19",
    },
    card: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      padding: "28px",
      borderRadius: "16px",
      border: "1px solid rgba(255, 255, 255, 0.18)",
      backgroundColor: "rgba(255, 255, 255, 0.07)",
      boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
    },
    title: {
      display: "flex",
      fontSize: "24px",
      fontWeight: 700,
      color: "#ffffff",
      marginBottom: "6px",
      letterSpacing: "0.02em",
      fontFamily: "Roboto",
    },
    subtitle: {
      display: "flex",
      fontSize: "14px",
      color: "rgba(255, 255, 255, 0.65)",
      marginBottom: "18px",
      fontFamily: "Roboto",
    },
    footer: {
      display: "flex",
      fontSize: "12px",
      color: "rgba(255, 255, 255, 0.45)",
      marginTop: "16px",
      fontFamily: "Roboto",
    },
    table: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    thRow: {
      display: "grid",
      width: "100%",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      paddingBottom: "12px",
      marginBottom: "4px",
    },
    th: {
      display: "flex",
      fontSize: "12px",
      fontWeight: 700,
      color: "#6ee7b7", // emerald-300
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      fontFamily: "Roboto",
      padding: "0 8px",
    },
    tdRow: {
      display: "grid",
      width: "100%",
      paddingTop: "12px",
      paddingBottom: "12px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      alignItems: "center",
      borderRadius: "6px",
    },
    zebraRow: {
      backgroundColor: "rgba(255, 255, 255, 0.03)",
    },
    td: {
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      color: "#f4f4f5", // zinc-100
      lineHeight: 1.5,
      fontFamily: "Roboto",
      padding: "0 8px",
    },
    code: {
      fontFamily: "Roboto Mono",
      fontSize: "12px",
      backgroundColor: "rgba(255, 255, 255, 0.12)",
      color: "#a7f3d0",
      padding: "2px 6px",
      borderRadius: "4px",
    },
    badges: {
      success: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        color: "#34d399",
        border: "1px solid rgba(16, 185, 129, 0.35)",
      },
      warning: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        color: "#fbbf24",
        border: "1px solid rgba(245, 158, 11, 0.35)",
      },
      error: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        color: "#f87171",
        border: "1px solid rgba(239, 68, 68, 0.35)",
      },
      info: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        color: "#60a5fa",
        border: "1px solid rgba(59, 130, 246, 0.35)",
      },
      neutral: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(148, 163, 184, 0.15)",
        color: "#cbd5e1",
        border: "1px solid rgba(148, 163, 184, 0.25)",
      },
    },
  },
  "slate-dark": {
    canvas: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "32px",
      width: "100%",
      height: "100%",
      backgroundColor: "#020617", // slate-950
    },
    card: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      padding: "28px",
      borderRadius: "14px",
      border: "1px solid #1e293b", // slate-800
      backgroundColor: "rgba(15, 23, 42, 0.95)", // slate-900
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
    },
    title: {
      display: "flex",
      fontSize: "24px",
      fontWeight: 700,
      color: "#f8fafc", // slate-100
      marginBottom: "6px",
      fontFamily: "Roboto",
    },
    subtitle: {
      display: "flex",
      fontSize: "14px",
      color: "#94a3b8", // slate-400
      marginBottom: "18px",
      fontFamily: "Roboto",
    },
    footer: {
      display: "flex",
      fontSize: "12px",
      color: "#64748b", // slate-500
      marginTop: "16px",
      fontFamily: "Roboto",
    },
    table: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    thRow: {
      display: "grid",
      width: "100%",
      backgroundColor: "#1e293b", // slate-800
      borderRadius: "8px",
      paddingTop: "12px",
      paddingBottom: "12px",
      marginBottom: "6px",
    },
    th: {
      display: "flex",
      fontSize: "12px",
      fontWeight: 600,
      color: "#e2e8f0", // slate-200
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      fontFamily: "Roboto",
      padding: "0 8px",
    },
    tdRow: {
      display: "grid",
      width: "100%",
      paddingTop: "12px",
      paddingBottom: "12px",
      borderBottom: "1px solid #1e293b", // slate-800
      alignItems: "center",
      borderRadius: "6px",
    },
    zebraRow: {
      backgroundColor: "rgba(30, 41, 59, 0.4)",
    },
    td: {
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      color: "#cbd5e1", // slate-300
      fontFamily: "Roboto",
      padding: "0 8px",
    },
    code: {
      fontFamily: "Roboto Mono",
      fontSize: "12px",
      backgroundColor: "#1e293b",
      color: "#38bdf8",
      padding: "2px 6px",
      borderRadius: "4px",
    },
    badges: {
      success: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        color: "#34d399",
        border: "1px solid #059669",
      },
      warning: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(245, 158, 11, 0.15)",
        color: "#fbbf24",
        border: "1px solid #d97706",
      },
      error: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        color: "#f87171",
        border: "1px solid #dc2626",
      },
      info: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(56, 189, 248, 0.15)",
        color: "#38bdf8",
        border: "1px solid #0284c7",
      },
      neutral: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(100, 116, 139, 0.2)",
        color: "#94a3b8",
        border: "1px solid #475569",
      },
    },
  },
  "minimalist-light": {
    canvas: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "32px",
      width: "100%",
      height: "100%",
      backgroundColor: "#f8fafc", // slate-50
    },
    card: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      padding: "28px",
      borderRadius: "14px",
      border: "1px solid #e2e8f0", // slate-200
      backgroundColor: "#ffffff",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.03)",
    },
    title: {
      display: "flex",
      fontSize: "24px",
      fontWeight: 700,
      color: "#0f172a", // slate-900
      marginBottom: "6px",
      letterSpacing: "-0.025em",
      fontFamily: "Roboto",
    },
    subtitle: {
      display: "flex",
      fontSize: "14px",
      color: "#64748b", // slate-500
      marginBottom: "18px",
      fontFamily: "Roboto",
    },
    footer: {
      display: "flex",
      fontSize: "12px",
      color: "#94a3b8", // slate-400
      marginTop: "16px",
      fontFamily: "Roboto",
    },
    table: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    thRow: {
      display: "grid",
      width: "100%",
      borderBottom: "2px solid #0f172a", // slate-900
      paddingBottom: "12px",
      marginBottom: "6px",
    },
    th: {
      display: "flex",
      fontSize: "12px",
      fontWeight: 700,
      color: "#334155", // slate-700
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      fontFamily: "Roboto",
      padding: "0 8px",
    },
    tdRow: {
      display: "grid",
      width: "100%",
      paddingTop: "12px",
      paddingBottom: "12px",
      borderBottom: "1px solid #f1f5f9", // slate-100
      alignItems: "center",
      borderRadius: "6px",
    },
    zebraRow: {
      backgroundColor: "#f8fafc", // slate-50
    },
    td: {
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      color: "#334155", // slate-700
      fontFamily: "Roboto",
      padding: "0 8px",
    },
    code: {
      fontFamily: "Roboto Mono",
      fontSize: "12px",
      backgroundColor: "#f1f5f9",
      color: "#0f172a",
      border: "1px solid #e2e8f0",
      padding: "2px 6px",
      borderRadius: "4px",
    },
    badges: {
      success: {
        ...baseBadgeStyle,
        backgroundColor: "#ecfdf5",
        color: "#047857",
        border: "1px solid #a7f3d0",
      },
      warning: {
        ...baseBadgeStyle,
        backgroundColor: "#fffbeb",
        color: "#b45309",
        border: "1px solid #fde68a",
      },
      error: {
        ...baseBadgeStyle,
        backgroundColor: "#fef2f2",
        color: "#b91c1c",
        border: "1px solid #fecaca",
      },
      info: {
        ...baseBadgeStyle,
        backgroundColor: "#eff6ff",
        color: "#1d4ed8",
        border: "1px solid #bfdbfe",
      },
      neutral: {
        ...baseBadgeStyle,
        backgroundColor: "#f1f5f9",
        color: "#475569",
        border: "1px solid #cbd5e1",
      },
    },
  },
  "emerald-glow": {
    canvas: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "32px",
      width: "100%",
      height: "100%",
      backgroundColor: "#09090b", // zinc-950
    },
    card: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      padding: "28px",
      borderRadius: "14px",
      border: "1px solid rgba(16, 185, 129, 0.3)", // emerald-500/30
      backgroundColor: "#18181b", // zinc-900
      boxShadow: "0 0 30px -5px rgba(16, 185, 129, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.5)",
    },
    title: {
      display: "flex",
      fontSize: "24px",
      fontWeight: 700,
      color: "#34d399", // emerald-400
      marginBottom: "6px",
      letterSpacing: "0.03em",
      fontFamily: "Roboto",
    },
    subtitle: {
      display: "flex",
      fontSize: "14px",
      color: "rgba(52, 211, 153, 0.75)",
      marginBottom: "18px",
      fontFamily: "Roboto",
    },
    footer: {
      display: "flex",
      fontSize: "12px",
      color: "rgba(212, 212, 216, 0.5)",
      marginTop: "16px",
      fontFamily: "Roboto",
    },
    table: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    thRow: {
      display: "grid",
      width: "100%",
      borderBottom: "1px solid rgba(16, 185, 129, 0.3)", // emerald-500/30
      paddingBottom: "12px",
      marginBottom: "6px",
    },
    th: {
      display: "flex",
      fontSize: "12px",
      fontWeight: 700,
      color: "#34d399", // emerald-400
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      fontFamily: "Roboto",
      padding: "0 8px",
    },
    tdRow: {
      display: "grid",
      width: "100%",
      paddingTop: "12px",
      paddingBottom: "12px",
      borderBottom: "1px solid #27272a", // zinc-800
      alignItems: "center",
      borderRadius: "6px",
    },
    zebraRow: {
      backgroundColor: "rgba(16, 185, 129, 0.04)",
    },
    td: {
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      color: "#d4d4d8", // zinc-300
      fontFamily: "Roboto",
      padding: "0 8px",
    },
    code: {
      fontFamily: "Roboto Mono",
      fontSize: "12px",
      backgroundColor: "rgba(16, 185, 129, 0.12)",
      color: "#6ee7b7",
      border: "1px solid rgba(16, 185, 129, 0.25)",
      padding: "2px 6px",
      borderRadius: "4px",
    },
    badges: {
      success: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        color: "#6ee7b7",
        border: "1px solid rgba(16, 185, 129, 0.4)",
      },
      warning: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        color: "#fbbf24",
        border: "1px solid rgba(245, 158, 11, 0.4)",
      },
      error: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        color: "#f87171",
        border: "1px solid rgba(239, 68, 68, 0.4)",
      },
      info: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        color: "#60a5fa",
        border: "1px solid rgba(59, 130, 246, 0.4)",
      },
      neutral: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(113, 113, 122, 0.2)",
        color: "#a1a1aa",
        border: "1px solid rgba(113, 113, 122, 0.4)",
      },
    },
  },
  synthwave: {
    canvas: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "32px",
      width: "100%",
      height: "100%",
      backgroundColor: "#0d0221", // deep synthwave night
    },
    card: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      padding: "28px",
      borderRadius: "14px",
      border: "1px solid rgba(236, 72, 153, 0.35)", // pink-500/35
      backgroundColor: "#150d30",
      boxShadow: "0 0 35px -5px rgba(236, 72, 153, 0.2), 0 20px 25px -5px rgba(0, 0, 0, 0.7)",
    },
    title: {
      display: "flex",
      fontSize: "24px",
      fontWeight: 700,
      color: "#f472b6", // pink-400
      marginBottom: "6px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      fontFamily: "Roboto",
    },
    subtitle: {
      display: "flex",
      fontSize: "14px",
      color: "#c084fc", // purple-400
      marginBottom: "18px",
      fontFamily: "Roboto",
    },
    footer: {
      display: "flex",
      fontSize: "12px",
      color: "rgba(233, 213, 255, 0.5)",
      marginTop: "16px",
      fontFamily: "Roboto",
    },
    table: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    thRow: {
      display: "grid",
      width: "100%",
      borderBottom: "1px solid rgba(168, 85, 247, 0.4)", // purple-500/40
      paddingBottom: "12px",
      marginBottom: "6px",
    },
    th: {
      display: "flex",
      fontSize: "12px",
      fontWeight: 700,
      color: "#f472b6", // pink-400
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      fontFamily: "Roboto",
      padding: "0 8px",
    },
    tdRow: {
      display: "grid",
      width: "100%",
      paddingTop: "12px",
      paddingBottom: "12px",
      borderBottom: "1px solid rgba(168, 85, 247, 0.2)",
      alignItems: "center",
      borderRadius: "6px",
    },
    zebraRow: {
      backgroundColor: "rgba(168, 85, 247, 0.07)",
    },
    td: {
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      color: "#e9d5ff", // purple-200
      fontFamily: "Roboto",
      padding: "0 8px",
    },
    code: {
      fontFamily: "Roboto Mono",
      fontSize: "12px",
      backgroundColor: "rgba(236, 72, 153, 0.15)",
      color: "#38bdf8",
      border: "1px solid rgba(56, 189, 248, 0.3)",
      padding: "2px 6px",
      borderRadius: "4px",
    },
    badges: {
      success: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(52, 211, 153, 0.2)",
        color: "#34d399",
        border: "1px solid rgba(52, 211, 153, 0.4)",
      },
      warning: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(251, 191, 36, 0.2)",
        color: "#fde047",
        border: "1px solid rgba(251, 191, 36, 0.4)",
      },
      error: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(244, 63, 94, 0.2)",
        color: "#fb7185",
        border: "1px solid rgba(244, 63, 94, 0.4)",
      },
      info: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(56, 189, 248, 0.2)",
        color: "#38bdf8",
        border: "1px solid rgba(56, 189, 248, 0.4)",
      },
      neutral: {
        ...baseBadgeStyle,
        backgroundColor: "rgba(168, 85, 247, 0.15)",
        color: "#d8b4fe",
        border: "1px solid rgba(168, 85, 247, 0.3)",
      },
    },
  },
  editorial: {
    canvas: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "32px",
      width: "100%",
      height: "100%",
      backgroundColor: "#fcfcfb", // warm publication paper
    },
    card: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      padding: "28px",
      borderRadius: "10px",
      border: "1px solid #e7e5e4", // stone-200
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 20px -2px rgba(28, 25, 23, 0.05)",
    },
    title: {
      display: "flex",
      fontSize: "24px",
      fontWeight: 700,
      color: "#1c1917", // stone-900
      marginBottom: "6px",
      letterSpacing: "-0.02em",
      fontFamily: "Roboto",
    },
    subtitle: {
      display: "flex",
      fontSize: "14px",
      color: "#78716c", // stone-500
      marginBottom: "18px",
      fontFamily: "Roboto",
    },
    footer: {
      display: "flex",
      fontSize: "12px",
      color: "#a8a29e", // stone-400
      marginTop: "16px",
      fontFamily: "Roboto",
    },
    table: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    thRow: {
      display: "grid",
      width: "100%",
      borderBottom: "2px solid #292524", // stone-800
      paddingBottom: "10px",
      marginBottom: "4px",
    },
    th: {
      display: "flex",
      fontSize: "12px",
      fontWeight: 700,
      color: "#292524", // stone-800
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      fontFamily: "Roboto",
      padding: "0 8px",
    },
    tdRow: {
      display: "grid",
      width: "100%",
      paddingTop: "11px",
      paddingBottom: "11px",
      borderBottom: "1px solid #f5f5f4", // stone-100
      alignItems: "center",
      borderRadius: "4px",
    },
    zebraRow: {
      backgroundColor: "#fafaf9", // stone-50
    },
    td: {
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      color: "#292524", // stone-800
      fontFamily: "Roboto",
      padding: "0 8px",
    },
    code: {
      fontFamily: "Roboto Mono",
      fontSize: "12px",
      backgroundColor: "#f5f5f4",
      color: "#0c0a09",
      border: "1px solid #e7e5e4",
      padding: "2px 6px",
      borderRadius: "4px",
    },
    badges: {
      success: {
        ...baseBadgeStyle,
        backgroundColor: "#f0fdf4",
        color: "#166534",
        border: "1px solid #bbf7d0",
      },
      warning: {
        ...baseBadgeStyle,
        backgroundColor: "#fffbeb",
        color: "#92400e",
        border: "1px solid #fde68a",
      },
      error: {
        ...baseBadgeStyle,
        backgroundColor: "#fef2f2",
        color: "#991b1b",
        border: "1px solid #fecaca",
      },
      info: {
        ...baseBadgeStyle,
        backgroundColor: "#f0f9ff",
        color: "#075985",
        border: "1px solid #bae6fd",
      },
      neutral: {
        ...baseBadgeStyle,
        backgroundColor: "#f5f5f4",
        color: "#57534e",
        border: "1px solid #e7e5e4",
      },
    },
  },
};
