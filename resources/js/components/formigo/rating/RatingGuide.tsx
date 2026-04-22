import YiiLang from '~/phpgen/yii-lang';

import {useState} from 'react';

import {useRatingContext} from '@/components/formigo/rating/RatingContext';
import {useDidMountEffect} from '@/utils/hooks';

export default function RatingGuide({
  className = '',
  maxLabel,
  minLabel,
}: {
  className?: string;
  maxLabel?: string;
  minLabel?: string;
}) {
  const {refHtmlOptionList} = useRatingContext();
  const [width, setWidth] = useState<number>();
  useDidMountEffect(() => {
    setWidth(refHtmlOptionList.current?.offsetWidth);
  });
  return (
    <div className={className} style={{width}}>
      <div className="flex items-center px-6">
        <div className="guide-bullet size-1 bg-black rounded-full"></div>
        <hr className="guide-line flex-1"></hr>
        <div className="guide-bullet size-1 bg-black rounded-full"></div>
      </div>
      <div className="guide-labels flex font-thin text-xs">
        <div className="">{minLabel || YiiLang.formigo('labelFormRateVeryBad')}</div>
        <div className="flex-1"></div>
        <div className="">{maxLabel || YiiLang.formigo('labelFormRateVeryGood')}</div>
      </div>
    </div>
  );
}
