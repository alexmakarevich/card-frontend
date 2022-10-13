export const theme = {
	primary: "#00A4E0",
	primaryVariant: "#0D81B3",
	background: "#EEE",
	textDefault: "#272727",
	textAccent: "#888888",
} as const;

export type Theme = typeof theme;
