import type { CSSProperties } from "react";
import type { TableTheme } from "./schemas.js";

export type ThemeParts = "canvas" | "card" | "title" | "table" | "thRow" | "th" | "tdRow" | "td";
export type ThemeStyle = Record<ThemeParts, CSSProperties>;

// Theme Style Map (Fully typed, no inline casts needed)
export const themeStyles = {
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
      padding: "24px",
      borderRadius: "16px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      backgroundColor: "rgba(255, 255, 255, 0.07)",
    },
    title: {
      display: "flex",
      fontSize: "24px",
      fontWeight: 700,
      color: "#ffffff",
      marginBottom: "16px",
      letterSpacing: "0.05em",
      fontFamily: "Roboto",
    },
    table: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    thRow: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      paddingBottom: "12px",
      marginBottom: "12px",
    },
    th: {
      display: "flex",
      fontSize: "12px",
      fontWeight: 700,
      color: "#6ee7b7", // emerald-300
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      fontFamily: "Roboto",
    },
    tdRow: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      paddingTop: "12px",
      paddingBottom: "12px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      alignItems: "center",
    },
    td: {
      display: "flex",
      fontSize: "14px",
      color: "#f4f4f5", // zinc-100
      lineHeight: 1.5,
      fontFamily: "Roboto",
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
      padding: "24px",
      borderRadius: "12px",
      border: "1px solid #1e293b", // slate-800
      backgroundColor: "rgba(15, 23, 42, 0.9)", // slate-900/90
    },
    title: {
      display: "flex",
      fontSize: "24px",
      fontWeight: 700,
      color: "#f8fafc", // slate-100
      marginBottom: "16px",
      fontFamily: "Roboto",
    },
    table: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    thRow: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      backgroundColor: "#1e293b", // slate-800
      borderRadius: "8px",
      paddingTop: "12px",
      paddingBottom: "12px",
      marginBottom: "8px",
    },
    th: {
      display: "flex",
      fontSize: "12px",
      fontWeight: 600,
      color: "#e2e8f0", // slate-200
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      fontFamily: "Roboto",
    },
    tdRow: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      paddingTop: "12px",
      paddingBottom: "12px",
      borderBottom: "1px solid #1e293b", // slate-800
      alignItems: "center",
    },
    td: {
      display: "flex",
      fontSize: "14px",
      color: "#cbd5e1", // slate-300
      fontFamily: "Roboto",
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
      backgroundColor: "#fafafa", // zinc-50
    },
    card: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      padding: "24px",
      borderRadius: "12px",
      border: "1px solid #e4e4e7", // zinc-200
      backgroundColor: "#ffffff",
    },
    title: {
      display: "flex",
      fontSize: "24px",
      fontWeight: 700,
      color: "#18181b", // zinc-900
      marginBottom: "16px",
      letterSpacing: "-0.025em",
      fontFamily: "Roboto",
    },
    table: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    thRow: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      borderBottom: "2px solid #18181b", // zinc-900
      paddingBottom: "12px",
      marginBottom: "8px",
    },
    th: {
      display: "flex",
      fontSize: "12px",
      fontWeight: 700,
      color: "#27272a", // zinc-800
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      fontFamily: "Roboto",
    },
    tdRow: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      paddingTop: "12px",
      paddingBottom: "12px",
      borderBottom: "1px solid #f4f4f5", // zinc-100
      alignItems: "center",
    },
    td: {
      display: "flex",
      fontSize: "14px",
      color: "#52525b", // zinc-600
      fontFamily: "Roboto",
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
      padding: "24px",
      borderRadius: "12px",
      border: "1px solid rgba(16, 185, 129, 0.2)", // emerald-500/20
      backgroundColor: "#18181b", // zinc-900
    },
    title: {
      display: "flex",
      fontSize: "24px",
      fontWeight: 700,
      color: "#34d399", // emerald-400
      marginBottom: "16px",
      letterSpacing: "0.05em",
      fontFamily: "Roboto",
    },
    table: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    thRow: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      borderBottom: "1px solid rgba(16, 185, 129, 0.3)", // emerald-500/30
      paddingBottom: "12px",
      marginBottom: "12px",
    },
    th: {
      display: "flex",
      fontSize: "12px",
      fontWeight: 700,
      color: "#34d399", // emerald-400
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      fontFamily: "Roboto",
    },
    tdRow: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      paddingTop: "12px",
      paddingBottom: "12px",
      borderBottom: "1px solid #27272a", // zinc-800
      alignItems: "center",
    },
    td: {
      display: "flex",
      fontSize: "14px",
      color: "#d4d4d8", // zinc-300
      fontFamily: "Roboto",
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
      backgroundColor: "#020617", // slate-950
    },
    card: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      padding: "24px",
      borderRadius: "12px",
      border: "1px solid rgba(236, 72, 153, 0.3)", // pink-500/30
      backgroundColor: "#0f172a", // slate-900
    },
    title: {
      display: "flex",
      fontSize: "24px",
      fontWeight: 700,
      color: "#f472b6", // pink-400
      marginBottom: "16px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      fontFamily: "Roboto",
    },
    table: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    thRow: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      borderBottom: "1px solid rgba(168, 85, 247, 0.4)", // purple-500/40
      paddingBottom: "12px",
      marginBottom: "12px",
    },
    th: {
      display: "flex",
      fontSize: "12px",
      fontWeight: 700,
      color: "#f472b6", // pink-400
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      fontFamily: "Roboto",
    },
    tdRow: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      paddingTop: "12px",
      paddingBottom: "12px",
      borderBottom: "1px solid rgba(30, 41, 59, 0.8)", // slate-800/80
      alignItems: "center",
    },
    td: {
      display: "flex",
      fontSize: "14px",
      color: "#e9d5ff", // purple-200
      fontFamily: "Roboto",
    },
  },
} satisfies Record<TableTheme, ThemeStyle>;
