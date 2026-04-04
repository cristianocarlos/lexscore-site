import YiiLang from '~/phpgen/yii-lang';

import SvgMap from '@/components/common/SvgMap';
import {useSelectorFormigoValidatorHasMessage} from '@/components/formigo/zustand/hooks';

// bg-blue-100 text-blue-800 border-blue-200
// bg-red-100 text-red-800 border-red-200
// bg-yellow-100 text-yellow-800 border-yellow-200
// bg-green-100 text-green-800 border-green-200

export default function ErrorSummary({className}: {className?: string}) {
  const validatorHasMessage = useSelectorFormigoValidatorHasMessage();
  if (!validatorHasMessage) return null;
  return (
    <div className={`agg--message-warning flex items-center gap-2 text-sm ${className}`} role="alert">
      <SvgMap className="text-2xl" name="feather-alert-triangle" />
      {YiiLang.formigo('feedbackFormValidatorErrors')}
    </div>
  );
}
