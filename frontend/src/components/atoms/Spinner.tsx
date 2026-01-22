type SpinnerProps = {
  className?: string;
};

export const Spinner = ({ className }: SpinnerProps) => {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${
        className ?? 'h-4 w-4'
      }`}
      aria-hidden="true"
    />
  );
};
