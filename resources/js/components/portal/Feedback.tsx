import XIconButton from '@/components/common/XIconButton';
import {useSelectorScreenValue} from '@/utils/zustand/screen/hooks';
import {zustandScreenSetValue} from '@/utils/zustand/screen/store';

import Portal from './Portal';

/*
- Erro do web (inertiajs): são tradados pelo laravel, abre um overlay
- Erro do suggest/combo: são tratados no fetchComboOrSuggest, aparecem no data list
- Erro de request da api: tratados nos fetch*, aparece no topo
- Erro de código no client: ?
- Sucesso create/update/delete: ?
 */

export default function Feedback() {
  const feedbackData = useSelectorScreenValue('feedbackData');
  let debugMessage;
  let className = '-translate-y-full';
  if (feedbackData?.message) {
    className = '';
    if (feedbackData.success) {
      className += 'bg-green-600 py-1 px-4 w-1/2!';
      setTimeout(() => zustandScreenSetValue('feedbackData', undefined), 2000);
    } else {
      console.warn('feedback.error', feedbackData);
      className += 'bg-red-600 py-4 px-6 w-3/4!';
    }
    debugMessage = import.meta.env.DEV ? feedbackData?.response?.data?.message : undefined;
  }
  return (
    <Portal id="feedback">
      <div
        className={`z-feedback fixed top-0 left-1/2 flex w-full -translate-x-1/2 transform rounded-b-lg text-sm text-white duration-500 ${className}`}
      >
        {feedbackData?.message ? (
          <>
            <div className="flex-1 overflow-hidden">
              {feedbackData.message}
              {debugMessage && <div className="text-[0.8em] text-amber-100">{debugMessage}</div>}
            </div>
            <XIconButton onClick={() => zustandScreenSetValue('feedbackData', undefined)} />
          </>
        ) : undefined}
      </div>
    </Portal>
  );
}
