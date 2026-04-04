import type {TCheckGroupOrRadioGroupComplementaryElements} from '@/components/formigo/types/checkGroupOrRadioGroup';
import type {TCheckAnyValue} from '@/components/formigo/types/checkOrRadio';
import type {TFormigoLabel} from '@/components/formigo/types/formigo';
import type {TInputChangeEventHandler} from '@/types/common';

export type TCheckOptionProps = {
  checkValue: TCheckAnyValue;
  className?: string;
  complementaryElements?: TCheckGroupOrRadioGroupComplementaryElements;
  dataType?: 'check-group';
  disabled?: boolean;
  handleChange: TInputChangeEventHandler;
  id: string;
  label?: TFormigoLabel;
  name?: string;
  preventUncheckHidden?: boolean;
  printMode?: boolean;
  readOnly?: boolean;
  value?: TCheckAnyValue;
};

export default function CheckOption(props: TCheckOptionProps) {
  const {
    checkValue,
    className = '',
    complementaryElements,
    dataType,
    disabled,
    handleChange,
    id,
    label,
    name,
    preventUncheckHidden,
    printMode,
    readOnly,
    value,
  } = props;

  const checked = value === checkValue;

  let readOnlyOrUncheckedHiddenElement;
  let resolvedName = name;
  const hasReadOnlyHidden = readOnly && checked;
  const hasUncheckedHidden = !preventUncheckHidden && !checked;
  if (hasReadOnlyHidden || hasUncheckedHidden) {
    readOnlyOrUncheckedHiddenElement = (
      <input disabled={disabled || printMode} name={resolvedName} type="hidden" value={value} />
    );
    resolvedName = undefined; // quando existir o hidden o Check não pode ter name [da pau no node]
  }
  return (
    <div className={`option ${className} ${printMode ? 'print-mode' : ''}`}>
      <label className="checkable">
        {readOnlyOrUncheckedHiddenElement}
        <input
          checked={checked}
          data-type={dataType}
          disabled={disabled || printMode || readOnly}
          id={id}
          name={resolvedName}
          onChange={handleChange}
          type="checkbox"
          value={checkValue}
        />
        <label className="custom" htmlFor={id} />
        {label}
      </label>
      {complementaryElements && complementaryElements[checkValue]}
    </div>
  );
}
