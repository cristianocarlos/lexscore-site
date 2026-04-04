import '@/components/formigo/styles/reset.css';
import '@/components/formigo/styles/form.css';

import {useFormigoContext} from '@/components/formigo/utils/withContext';
import {usePageFormUrls} from '@/shared/utils/usePageSlice';
import {getWindowLocation} from '@/utils/globals';

import ButtonSet from './ButtonSet';
import CheckGroup from './check-group/CheckGroup';
import Hidden from './Hidden';
import FormElement from './layout/FormElement';
import FormSection from './layout/FormSection';
import RadioGroup from './radio-group/RadioGroup';
import TextArea from './text-area/TextArea';
import EmailInput from './text-input/EmailInput';
import TextInput from './text-input/TextInput';

import type {TFormigoFormFeatures, TFormigoRequestMethod} from '@/components/formigo/types/formigo';
import type {ComponentProps} from 'react';

type IPFormigo = ComponentProps<'form'> & {
  apiRequestMethod?: TFormigoRequestMethod;
  formFeatures?: TFormigoFormFeatures;
};

Formigo.ButtonSet = ButtonSet;
Formigo.Element = FormElement;
Formigo.Section = FormSection;

export default function Formigo(props: IPFormigo) {
  const {action, apiRequestMethod, children, method, ...htmlProps} = props;

  const {formId, recordId} = useFormigoContext();
  const formUrls = usePageFormUrls();

  return (
    <form
      {...htmlProps}
      action={action || formUrls.apiSave} // O EDGE não resolve a url sozinha, por isso o window.location
      data-method={apiRequestMethod || (recordId ? 'put' : 'post')}
      data-pathname={action || getWindowLocation()}
      id={formId}
      method={method || 'post'}
    >
      {children}
    </form>
  );
}

export {CheckGroup, EmailInput, Hidden, RadioGroup, TextArea, TextInput};
