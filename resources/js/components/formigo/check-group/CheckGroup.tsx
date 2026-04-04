import '@/components/formigo/styles/check-and-radio.css';

import CheckOption from '@/components/formigo/check/CheckOption';
import FieldWrapper from '@/components/formigo/FieldWrapper';
import Label from '@/components/formigo/Label';
import {getNoValueHiddenElement} from '@/components/formigo/utils/checkOrRadio';
import useHtmlProps from '@/components/formigo/utils/useHtmlProps';
import useValidators, {VALIDATION_TYPES} from '@/components/formigo/utils/useValidators';
import {maxSizeValidator, minSizeValidator} from '@/components/formigo/utils/validators';
import {
  useDispatchFormigoInputPrepare,
  useSelectorFormigoAttrValue,
  useSelectorFormigoInputReadyValue,
} from '@/components/formigo/zustand/hooks';
import {hasValue, valueAsString} from '@/utils/helper';
import {useDidMountEffect} from '@/utils/hooks';

import CheckGroupDescriptionsHidden from './CheckGroupDescriptionsHidden';
import CheckGroupValuesHidden from './CheckGroupValuesHidden';
import useCheckGroupHandlers from './useCheckGroupHandlers';

import type {
  IPCheckGroup,
  TCheckGroupOrRadioGroupOptionRows,
  TCheckGroupValue,
} from '@/components/formigo/types/checkGroupOrRadioGroup';

// Quando o id das options é um sequencial, iniciando em zero, precisa um hack pra nunca ser convertido em array no json
// Uma option {id: '.', label: null} com hiddenOptions = {['.']}
// Acontece pelo índice ser um sequencial iniciando em zero, isso faz com que a conversão do PHP
// "adivinhe" o tipo do valor, convertendo em um json array

export default function CheckGroup<GOptionData extends TCheckGroupOrRadioGroupOptionRows[number]>(
  props: IPCheckGroup<GOptionData>,
) {
  const {
    attribute,
    className = '',
    descriptionsAttribute,
    disabled,
    disabledOptions,
    forceValidateOnSubmit,
    handleChange,
    hiddenOptions,
    initValue,
    label,
    maxSize,
    minSize,
    optionLabelFormatter,
    options,
    pattern = 'default',
    printMode,
    readOnly,
    required,
    refComponent,
    readOnlyOptions,
    resolveComplementaryElements,
    validateOnlyOnSubmit,
    validators,
    valuesAttribute,
  } = props;

  /**
   * HANDLERS
   */

  const {handleInputChange} = useCheckGroupHandlers({
    attribute,
    disabled,
    handleChange,
    options,
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

  const resolvedValidators = validators || [];

  useDidMountEffect(() => {
    if (maxSize) {
      resolvedValidators.push(maxSizeValidator({attribute, maxSize}));
    }
    if (minSize) {
      resolvedValidators.push(minSizeValidator({attribute, minSize}));
    }
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
      validationType: VALIDATION_TYPES.checkGroup,
    },
    resolvedValidators,
  );

  /**
   * COMPONENT
   */

  const attrValue = useSelectorFormigoAttrValue<TCheckGroupValue>(attribute);

  if (!isReady) return null;

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
  const hasHiddenOptions = !!hiddenOptions;
  const hasReadOnlyOptions = !!readOnlyOptions;

  const renderOptions = (initName?: string) => {
    return options.map((data) => {
      const dataId = valueAsString(data.id);
      const name = initName && initName + '[' + dataId + ']';
      const id = initProps.id + '_' + dataId;
      if (hasHiddenOptions && hiddenOptions.includes(dataId)) {
        return <input disabled={disabled} id={id} key={dataId} name={name} type="hidden" value={dataId} />;
      }
      // Quando for '' o checkedValue tem que virar undefined, caso contrário, se uma das options for 0, vai dar como checked '' == 0 true
      const checkedValue = attrValue && hasValue(attrValue[dataId]) ? attrValue[dataId] : undefined;
      const optionLabel = optionLabelFormatter ? optionLabelFormatter(data) : data.label;
      const optionDisabled = hasDisabledOptions && disabledOptions.includes(dataId);
      const optionReadOnly = hasReadOnlyOptions && readOnlyOptions.includes(dataId);
      return (
        <CheckOption
          checkValue={dataId}
          className="box"
          complementaryElements={complementaryElements}
          dataType="check-group"
          disabled={disabled || optionDisabled}
          handleChange={handleInputChange}
          id={id}
          key={dataId}
          label={
            <Label className="option-label" htmlFor={id}>
              {optionLabel}
            </Label>
          }
          name={name}
          preventUncheckHidden={true}
          printMode={printMode}
          readOnly={readOnly || optionReadOnly}
          value={checkedValue}
        />
      );
    });
  };

  // Com hidden options sempre vai existir valor
  const noValueHiddenElement = hasHiddenOptions
    ? undefined
    : getNoValueHiddenElement({
        disabled: disabled || printMode,
        initName: initProps.name,
        value: attrValue,
      });

  const resolvedLabel = label || initProps.label;
  const resolvedInitName = typeof noValueHiddenElement === 'undefined' ? initProps.name : undefined; // quando existir o hidden o Check não pode ter name [da pau no node]

  return (
    <FieldWrapper
      attribute={attribute}
      className={`mf__formigo__check-and-radio check-and-radio check-group ${className} ${pattern}-option`}
      role="listbox"
    >
      {resolvedLabel ? <label className="agg--form-input-label">{resolvedLabel}</label> : null}
      {noValueHiddenElement}
      <div className="option-list">{renderOptions(resolvedInitName)}</div>
      {!descriptionsAttribute ? null : (
        <CheckGroupDescriptionsHidden attribute={descriptionsAttribute} disabled={disabled} options={options} />
      )}
      {!valuesAttribute ? null : (
        <CheckGroupValuesHidden attribute={valuesAttribute} attrValue={attrValue} disabled={disabled} />
      )}
    </FieldWrapper>
  );
}
