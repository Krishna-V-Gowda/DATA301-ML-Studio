import katex from 'katex';

type MathProps = {
  expression: string;
  display?: boolean;
  label?: string;
};

export function Math({ expression, display = true, label }: MathProps) {
  const html = katex.renderToString(expression, {
    throwOnError: false,
    displayMode: display,
    strict: 'ignore',
  });

  return (
    <div
      className={display ? 'math-block' : 'math-inline'}
      role="img"
      aria-label={label ?? expression}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
