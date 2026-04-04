import type {ReactNode, ComponentProps} from 'react';

type IPFormElement = ComponentProps<'div'> & {
  children: ReactNode;
  className?: string;
};

export default function FormElement({children, className = '', ...htmlDataAttributeProps}: IPFormElement) {
  return (
    <div {...htmlDataAttributeProps} className={`form-element ${className}`}>
      {children}
    </div>
  );
}
