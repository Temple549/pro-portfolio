export function SplashScreen({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="splash-screen">
        <div style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "1px solid #27272a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 32
        }}>
          <span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>N</span>
        </div>
        <h1 style={{ color: "white", fontSize: 32, fontWeight: 700 }}>Portfolio Engine</h1>
        <p style={{ color: "#71717a", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.3em", marginTop: 8 }}>v1.0</p>
        <p style={{ color: "#a1a1aa", fontSize: 12, fontFamily: "monospace", marginTop: 48 }}>Infrastructure initialized and verified.</p>
        <div style={{ position: "absolute", bottom: 32, left: 32 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid #27272a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{ color: "#52525b", fontWeight: 700, fontSize: 12 }}>N</span>
          </div>
        </div>
      </div>

      <div className="splash-content">
        {children}
      </div>
    </>
  );
}