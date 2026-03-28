export function SectionLabel({ text }: { text: string }) {
  return (
    <p
      style={{
        margin: "0 0 10px",
        fontSize: 11,
        fontFamily: "'Poppins', sans-serif",
        color: "#4A4A46",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      {text}
    </p>
  );
}
