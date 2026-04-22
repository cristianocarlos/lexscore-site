import './Form.css';

import Rating from '@/components/formigo/rating/Rating';

import type {TCheckGroupOrRadioGroupOptionRows} from '@/components/formigo/types/checkGroupOrRadioGroup';
import type {TRateProps} from '@/components/formigo/types/rate';

export default function NpsRating<GOptionData extends TCheckGroupOrRadioGroupOptionRows[number]>(
  props: TRateProps<GOptionData>,
) {
  return (
    <Rating {...props} className={`nps-rating ${props.className}`}>
      <Rating.Options
        className="
        [&>label]:border-2
        [&>label]:bg-white

        [&>:nth-child(-n+4)]:border-red-600
        [&>:nth-child(-n+4)]:has-checked:bg-red-600

        [&>:nth-child(n+5):nth-last-child(n+5)]:border-yellow-500
        [&>:nth-child(n+5):nth-last-child(n+5)]:has-checked:bg-yellow-500

        [&>:nth-child(n+7):nth-last-child(n+3)]:border-blue-600
        [&>:nth-child(n+7):nth-last-child(n+3)]:has-checked:bg-blue-600

        [&>:nth-last-child(-n+2)]:border-green-600
        [&>:nth-last-child(-n+2)]:has-checked:bg-green-600
        "
      />
      <Rating.Guide className="mt-2 text-white [&_.guide-bullet]:bg-white" />
    </Rating>
  );
}
