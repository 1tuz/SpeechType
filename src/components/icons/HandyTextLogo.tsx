const HandyTextLogo = ({
  width,
  className,
}: {
  width?: number;
  className?: string;
}) => {
  return (
    <span
      style={{
        width,
        fontSize: (width ?? 120) * 0.26,
        color: "var(--color-wordmark)",
      }}
      className={`font-semibold leading-none select-none ${className ?? ""}`}
    >
      SpeechType
    </span>
  );
};

export default HandyTextLogo;
