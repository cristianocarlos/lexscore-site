import Section from '@/components/common/Section';

import type {ReactNode} from 'react';

type IPFormSection = {
  children: ReactNode;
  className?: string;
  title?: string;
};

export default function FormSection({children, className, title}: IPFormSection) {
  return (
    <Section className={`form-section ${className}`} tagName="fieldset">
      {title ? <h4 className="section-legend">{title}</h4> : null}
      {children}
    </Section>
  );
}
