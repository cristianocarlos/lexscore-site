import {useRatingContext} from '@/components/formigo/rating/RatingContext';
import {valueAsString} from '@/utils/helper';

export default function RatingOptions({className = ''}: {className?: string}) {
  const {
    disabled,
    handleInputChange,
    handleInputClick,
    inputId,
    inputName,
    inputValue,
    options,
    printMode,
    readOnly,
    refHtmlOptionList,
  } = useRatingContext();
  return (
    <div className={`inline-flex gap-2 ${className}`} ref={refHtmlOptionList}>
      {options.map((data) => {
        const dataId = valueAsString(data.id);
        return (
          <label
            className={`border rounded-full has-checked:bg-black has-checked:text-white cursor-pointer flex items-center justify-center size-12`}
            key={dataId}
          >
            <input
              checked={inputValue === dataId}
              className="hidden"
              disabled={disabled || readOnly || printMode}
              id={inputId + '_' + dataId}
              name={inputName}
              onChange={handleInputChange}
              onClick={handleInputClick}
              type="radio"
              value={dataId}
            />
            {data.label}
          </label>
        );
      })}
    </div>
  );
}
