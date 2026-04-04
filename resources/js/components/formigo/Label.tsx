import type {TFormigoLabel} from '@/components/formigo/types/formigo';

type IPLabel = {
  children?: TFormigoLabel;
  className?: string;
  htmlFor?: string;
  labelHint?: string;
};

export default function Label(props: IPLabel) {
  const {children, className, htmlFor, labelHint} = props;
  if (!children && typeof children !== 'string') return undefined;
  if (typeof children === 'string') {
    let resolvedLabel = children;
    if (labelHint) resolvedLabel += '<em class="form-hint">' + labelHint + '</em>';
    return <label className={className} dangerouslySetInnerHTML={{__html: resolvedLabel}} htmlFor={htmlFor} />;
  }
  return (
    <label className={className} htmlFor={htmlFor}>
      {children}
    </label>
  );
}
