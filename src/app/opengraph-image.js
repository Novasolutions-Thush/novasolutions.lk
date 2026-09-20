import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Nova Solutions | Software Development Company";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const file = await readFile(
    path.join(process.cwd(), "public/images/brand/logo-tile.png")
  );
  const logo = `data:image/png;base64,${file.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #231942 0%, #5e548e 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} width={140} height={140} alt="" />
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              marginLeft: 36,
              color: "#e0b1cb",
            }}
          >
            Nova Solutions
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 40, marginTop: 48 }}>
          Software development for web, mobile and cloud
        </div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 24, color: "#be95c4" }}>
          novasolutions.lk
        </div>
      </div>
    ),
    size
  );
}