import Hidden from '@/components/formigo/Hidden';

import type {TCheckGroupValue} from '@/components/formigo/types/checkGroupOrRadioGroup';
import type {TCheckGroupCheckValue} from '@/components/formigo/types/checkOrRadio';
import type {IPHidden} from '@/components/formigo/types/input';

type IPCheckGroupValuesHidden = IPHidden & {
  attrValue?: TCheckGroupValue;
};

export default function CheckGroupValuesHidden({attrValue, ...componentProps}: IPCheckGroupValuesHidden) {
  const attrValueValues = attrValue ? Object.values(attrValue) : [];
  const flatValues = attrValueValues.reduce((accumulator, data) => {
    accumulator.push(data);
    return accumulator;
  }, [] as Array<TCheckGroupCheckValue>);
  return (
    <Hidden
      {...componentProps}
      dataType="check-group-values"
      value={flatValues.length === 0 ? undefined : JSON.stringify(flatValues)}
    />
  );
}
