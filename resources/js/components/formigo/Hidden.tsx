import {resolveInputValue} from '@/components/formigo/utils/helper';
import useHtmlProps from '@/components/formigo/utils/useHtmlProps';
import {useSelectorFormigoAttrValue} from '@/components/formigo/zustand/hooks';

import type {IPHidden} from '@/components/formigo/types/input';

/**
 * Na maioria dos casos não é necessário o uso deste componente
 * Porém as vezes precisa  manter o valor do hidden sincronizado com o atributo do DB
 * Por exemplo "Data final" form do appointments
 */

function defaultResolver<GAttrValue>(attrValue?: GAttrValue, value?: string) {
  if (typeof value === 'undefined') return attrValue;
  return value;
}

export default function Hidden<GAttrValue>(props: IPHidden<GAttrValue>) {
  const {attribute, dataType, disabled, resolver, value} = props;
  const initProps = useHtmlProps({attribute});
  const attrValue = useSelectorFormigoAttrValue<GAttrValue>(attribute);
  const resolvedValue =
    typeof resolver === 'function' ? resolver(attrValue) : defaultResolver<GAttrValue>(attrValue, value);
  return (
    <input
      data-type={dataType}
      disabled={disabled}
      name={initProps.name}
      type="hidden"
      value={resolveInputValue(resolvedValue, undefined, 'Hidden', attribute)}
    />
  );
}
