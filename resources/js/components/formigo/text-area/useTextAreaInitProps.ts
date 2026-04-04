import {useMemo} from 'react';

import {resolvedPadding, resolvedSize, resolveInputStyle} from '@/components/formigo/styles/layout';
import useHtmlProps from '@/components/formigo/utils/useHtmlProps';

import type {IPTextArea} from '@/components/formigo/types/input';
import type {CSSProperties} from 'react';

type TInitProps = {
  inputStyle: CSSProperties;
  prependStyle: CSSProperties;
};

type TUseTextAreaInitProps = Pick<IPTextArea, 'attribute' | 'label' | 'maxLength' | 'placeholder'> & {
  hasPrepend?: boolean;
  shouldUseModelSchemaMaxLength?: boolean;
};

export default function useTextAreaInitProps(params: TUseTextAreaInitProps) {
  const {attribute, hasPrepend, label, maxLength, placeholder, shouldUseModelSchemaMaxLength} = params;

  const htmlProps = useHtmlProps({
    attribute,
    label,
    maxLength,
    placeholder,
    shouldUseModelSchemaMaxLength,
  });
  const textAreaInitProps = useMemo(() => {
    const initProps = {} as TInitProps;

    initProps.inputStyle = {
      ...resolveInputStyle(hasPrepend, false),
      paddingBottom: resolvedPadding,
      paddingTop: resolvedPadding,
    };
    initProps.prependStyle = {
      paddingTop: resolvedPadding,
      width: resolvedSize,
    };
    return initProps;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {...htmlProps, ...textAreaInitProps};
}
