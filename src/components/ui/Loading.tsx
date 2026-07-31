import DynamicText from "../kokonutui/dynamic-text";

export default function Loading() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0A0A0C" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Chilanka&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'Chilanka', cursive" }}>
        <DynamicText />
      </div>
    </div>
  );
}
