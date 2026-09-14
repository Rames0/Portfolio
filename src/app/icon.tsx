import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 20,
        background: "#161714",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#E3C849",
        fontWeight: 900,
        border: "2px solid #2C2E29",
        borderRadius: "6px",
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
