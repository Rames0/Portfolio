import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 110,
        background: "#161714",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#E3C849",
        fontWeight: 900,
        border: "8px solid #2C2E29",
        borderRadius: "36px",
        fontFamily: "monospace",
      }}
    >
      R
    </div>,
    {
      ...size,
    },
  );
}
