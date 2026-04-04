import YiiLang from '~/phpgen/yii-lang';

export default function TextAreaCounter({maxLength, value}: {maxLength: number; value?: string}) {
  const counter = maxLength - (value || '').length;
  return (
    <div className="relative px-0.5 text-xs leading-none text-gray-500">
      {YiiLang.formigo('labelFormTextAreaCounter') + ': ' + counter}
    </div>
  );
}
