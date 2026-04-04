import Hidden from '@/components/formigo/Hidden';

import type {TCheckGroupOrRadioGroupOptionRows} from '@/components/formigo/types/checkGroupOrRadioGroup';
import type {IPHidden} from '@/components/formigo/types/input';

type IPCheckGroupDescriptionsHidden = IPHidden & {
  options: TCheckGroupOrRadioGroupOptionRows;
};

export default function CheckGroupDescriptionsHidden({options, ...componentProps}: IPCheckGroupDescriptionsHidden) {
  const descriptions = options.reduce(
    (accumulator, data) => {
      accumulator[data.id] = data.label;
      return accumulator;
    },
    {} as {[p: string]: TCheckGroupOrRadioGroupOptionRows[number]['label']},
  );
  return <Hidden {...componentProps} dataType="check-group-descriptions" value={JSON.stringify(descriptions)} />;
}
