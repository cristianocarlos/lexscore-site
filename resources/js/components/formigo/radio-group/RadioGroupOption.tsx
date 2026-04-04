import type {
  IPRadioGroup,
  TCheckGroupOrRadioGroupComplementaryElements,
} from '@/components/formigo/types/checkGroupOrRadioGroup';
import type {TInputChangeEventHandler, TInputMouseEventHandler} from '@/types/common';
import type {ReactElement} from 'react';

type TRadioTableOptionProps = {
  checked: boolean;
  complementaryElements?: TCheckGroupOrRadioGroupComplementaryElements;
  disabled: IPRadioGroup['disabled'];
  handleChange: TInputChangeEventHandler;
  handleClick: TInputMouseEventHandler;
  id: string;
  label: ReactElement;
  name?: string;
  printMode: IPRadioGroup['printMode'];
  readOnly: IPRadioGroup['readOnly'];
  value: string;
};

export default function RadioGroupOption(props: TRadioTableOptionProps) {
  const {
    checked,
    complementaryElements,
    disabled,
    handleChange,
    handleClick,
    id,
    label,
    name,
    printMode,
    readOnly,
    value,
  } = props;
  return (
    <div className={`option ${printMode ? 'print-mode' : ''}`}>
      <label className="checkable">
        <input
          checked={checked}
          disabled={disabled || readOnly || printMode}
          id={id}
          name={name}
          onChange={handleChange}
          onClick={handleClick}
          type="radio"
          value={value}
        />
        <label className="custom" htmlFor={id} />
        {label}
      </label>
      {complementaryElements && complementaryElements[value]}
    </div>
  );
}
