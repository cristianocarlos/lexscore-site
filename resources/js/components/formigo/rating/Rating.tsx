import '@/components/formigo/styles/rate.css';

import {useRef} from 'react';

import FieldWrapper from '@/components/formigo/FieldWrapper';
import {RatingContext} from '@/components/formigo/rating/RatingContext';
import RatingGuide from '@/components/formigo/rating/RatingGuide';
import RatingOptions from '@/components/formigo/rating/RatingOptions';
import {getNoValueHiddenElement} from '@/components/formigo/utils/checkOrRadio';
import {resolveInputValue} from '@/components/formigo/utils/helper';
import useHtmlProps from '@/components/formigo/utils/useHtmlProps';
import useValidators, {VALIDATION_TYPES} from '@/components/formigo/utils/useValidators';
import {useDispatchFormigoInputPrepare, useSelectorFormigoAttrValue} from '@/components/formigo/zustand/hooks';
import {useDidMountEffect} from '@/utils/hooks';

import useRadioGroupHandlers from '../radio-group/useRadioGroupHandlers';

import type {TCheckGroupOrRadioGroupOptionRows} from '@/components/formigo/types/checkGroupOrRadioGroup';
import type {TRatingProps} from '@/components/formigo/types/rating';

Rating.Options = RatingOptions;
Rating.Guide = RatingGuide;

export default function Rating<GOptionData extends TCheckGroupOrRadioGroupOptionRows[number]>(
  props: TRatingProps<GOptionData>,
) {
  const {
    attribute,
    className = '',
    children,
    disabled,
    forceValidateOnSubmit,
    handleChange,
    initValue,
    label,
    preventUncheck,
    printMode,
    readOnly,
    refComponent,
    required,
    validateOnlyOnSubmit,
    validators,
  } = props;

  const refHtmlOptionList = useRef<HTMLDivElement>(null);

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

  const resolvedInputValue = resolveInputValue(attrValue, undefined, 'RadioGroup', attribute);

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

  return (
    <RatingContext
      value={{
        ...props,
        handleInputChange,
        handleInputClick,
        inputId: initProps.id,
        inputName: typeof readOnlyOrNoValueHiddenElement === 'undefined' ? initProps.name : undefined, // quando existir o hidden o Check não pode ter name [da pau no node]
        inputValue: resolvedInputValue,
        refHtmlOptionList,
      }}
    >
      <FieldWrapper attribute={attribute} className={`mf__formigo__rate ${className}`} role="radiogroup">
        <label className="agg--form-input-label">{label}</label>
        {readOnlyOrNoValueHiddenElement}
        {children || (
          <>
            <Rating.Options />
            <Rating.Guide />
          </>
        )}
      </FieldWrapper>
    </RatingContext>
  );
}
