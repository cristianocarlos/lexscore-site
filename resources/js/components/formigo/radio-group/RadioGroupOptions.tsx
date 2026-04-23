import {useRadioGroupContext} from '@/components/formigo/radio-group/RadioGroupContext';
import {valueAsString} from '@/utils/helper';

export default function RadioGroupOptions({className = ''}: {className?: string}) {
  const {
    attribute,
    disabled,
    disabledOptions,
    handleInputChange,
    handleInputClick,
    inputId,
    inputName,
    inputValue,
    optionLabelFormatter,
    options,
    printMode,
    readOnly,
    refComponent,
    resolveComplementaryElements,
  } = useRadioGroupContext();
  const complementaryElements = resolveComplementaryElements?.({
    attribute,
    disabled,
    options,
    printMode,
    refComponent,
  });
  return (
    <div className={`inline-flex gap-2 ${className}`}>
      {options.map((data) => {
        const dataId = valueAsString(data.id);
        const optionDisabled = disabledOptions?.includes(dataId);
        return (
          <div>
            <label
              className={`border rounded-full has-checked:bg-black has-checked:text-white cursor-pointer flex items-center justify-center size-12`}
              key={dataId}
            >
              <input
                checked={inputValue === dataId}
                className="hidden"
                disabled={disabled || readOnly || printMode || optionDisabled}
                id={inputId + '_' + dataId}
                name={inputName}
                onChange={handleInputChange}
                onClick={handleInputClick}
                type="radio"
                value={dataId}
              />
              {optionLabelFormatter?.(data) || data.label}
            </label>
            {complementaryElements?.[dataId]}
          </div>
        );
      })}
    </div>
  );
}
