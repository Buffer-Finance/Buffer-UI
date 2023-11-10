export const LabelWrapper: React.FC<{
  label: string;
  className?: string;
  input: JSX.Element;
}> = ({ input, label, className = '' }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label}
      {input}
    </div>
  );
};
