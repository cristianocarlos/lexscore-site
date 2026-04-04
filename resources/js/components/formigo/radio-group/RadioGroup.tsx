import '@/components/formigo/styles/check-and-radio.css';

import FieldWrapper from '@/components/formigo/FieldWrapper';
import Label from '@/components/formigo/Label';
import {getNoValueHiddenElement} from '@/components/formigo/utils/checkOrRadio';
import {resolveInputValue} from '@/components/formigo/utils/helper';
import useHtmlProps from '@/components/formigo/utils/useHtmlProps';
import useValidators, {VALIDATION_TYPES} from '@/components/formigo/utils/useValidators';
import {
  useDispatchFormigoInputPrepare,
  useSelectorFormigoAttrValue,
  useSelectorFormigoInputReadyValue,
} from '@/components/formigo/zustand/hooks';
import {valueAsString} from '@/utils/helper';
import {useDidMountEffect} from '@/utils/hooks';

import RadioGroupOption from './RadioGroupOption';
import useRadioGroupHandlers from './useRadioGroupHandlers';

import type {IPRadioGroup, TCheckGroupOrRadioGroupOptionRows} from '@/components/formigo/types/checkGroupOrRadioGroup';

export default function RadioGroup<GOptionData extends TCheckGroupOrRadioGroupOptionRows[number]>(
  props: IPRadioGroup<GOptionData>,
) {
  const {
    attribute,
    className = '',
    disabled,
    disabledOptions,
    forceValidateOnSubmit,
    handleChange,
    initValue,
    label,
    optionLabelFormatter,
    options,
    pattern = 'default',
    preventUncheck,
    printMode,
    readOnly,
    refComponent,
    required,
    resolveComplementaryElements,
    title,
    validateOnlyOnSubmit,
    validators,
  } = props;

  /**
   * HANDLERS
   */

  const {handleInputChange, handleInputClick} = useRadioGroupHandlers({
    attribute,
    disabled,
    handleChange,
    preventUncheck,
    readOnly,
    refComponent,
    validateOnlyOnSubmit,
  });

  /**
   * INIT
   */

  const initProps = useHtmlProps({
    attribute,
    label,
  });

  const inputPrepare = useDispatchFormigoInputPrepare(attribute);
  const isReady = useSelectorFormigoInputReadyValue(attribute);

  useDidMountEffect(() => {
    inputPrepare(initValue);
  });

  /**
   * VALIDATORS
   */

  useValidators(
    {
      attribute,
      disabled,
      forceValidateOnSubmit,
      readOnly,
      required,
      validationType: VALIDATION_TYPES.radioGroup,
    },
    validators || [],
  );

  /**
   * COMPONENT
   */

  const attrValue = useSelectorFormigoAttrValue(attribute);

  if (!isReady) return null;

  const resolvedInputValue = resolveInputValue(attrValue, undefined, 'RadioGroup', attribute);

  const complementaryElements =
    typeof resolveComplementaryElements === 'function'
      ? resolveComplementaryElements({
          attribute,
          disabled,
          options,
          printMode,
          refComponent,
        })
      : undefined;

  const hasDisabledOptions = !!disabledOptions;

  const renderOptions = (initName?: string) => {
    return options.map((data) => {
      const dataId = valueAsString(data.id);
      const id = initProps.id + '_' + dataId;
      const optionLabel = optionLabelFormatter ? optionLabelFormatter(data) : data.label;
      const optionDisabled = hasDisabledOptions && disabledOptions.includes(dataId);
      return (
        <RadioGroupOption
          checked={resolvedInputValue === dataId}
          complementaryElements={complementaryElements}
          disabled={disabled || optionDisabled}
          handleChange={handleInputChange}
          handleClick={handleInputClick}
          id={id}
          key={dataId}
          label={
            <Label className="option-label" htmlFor={id}>
              {optionLabel}
            </Label>
          }
          name={initName}
          printMode={printMode}
          readOnly={readOnly}
          value={dataId}
        />
      );
    });
  };

  const readOnlyOrNoValueHiddenElement =
    readOnly && attrValue ? (
      <input disabled={disabled || printMode} name={initProps.name} type="hidden" value={resolvedInputValue} />
    ) : (
      getNoValueHiddenElement({
        disabled: disabled || printMode,
        initName: initProps.name,
        value: resolvedInputValue,
      })
    );

  const resolvedLabel = label || initProps.label;
  const resolvedInitName = typeof readOnlyOrNoValueHiddenElement === 'undefined' ? initProps.name : undefined; // quando existir o hidden o Check não pode ter name [da pau no node]

  const classNameSet = `mf__formigo__check-and-radio check-and-radio radio-group ${className} ${pattern}-option`;

  return (
    <FieldWrapper attribute={attribute} className={classNameSet} data-test="form-element-radio-group" role="radiogroup">
      {resolvedLabel ? <label className="agg--form-input-label">{resolvedLabel}</label> : null}
      {readOnlyOrNoValueHiddenElement}
      <div className="option-list" title={title}>
        {renderOptions(resolvedInitName)}
      </div>
    </FieldWrapper>
  );
}
