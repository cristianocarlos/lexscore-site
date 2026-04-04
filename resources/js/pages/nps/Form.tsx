import YiiLang from '~/phpgen/yii-lang';
import YiiModel from '~/phpgen/yii-model';

import {useState} from 'react';

import Formigo, {TextInput} from '@/components/formigo/Formigo';
import FormigoSnippet from '@/components/formigo/snippet/FormigoSnippet';
import SubmitDecorator, {useHandleFetchSubmit} from '@/components/formigo/SubmitDecorator';

import type {TButtonMouseEventHandler} from '@/types/common';

function Form() {
  const [success, setSuccess] = useState(false);

  const handleFetchSubmit = useHandleFetchSubmit();

  const handleSubmit: TButtonMouseEventHandler = async (e) => {
    const responseData = await handleFetchSubmit(e);
    setSuccess(responseData.success);
  };

  if (success) return <div className="agg--message-info">{YiiLang.page('Obrigado')}</div>;

  return (
    <Formigo action="/api/nps/send">
      <Formigo.Section>
        <TextInput attribute={YiiModel.attr('RespondentMailingList.reml_pers_name')} label={YiiLang.misc('textName')} />
        <TextInput
          attribute={YiiModel.attr('RespondentMailingList.reml_pers_joti')}
          label={YiiLang.misc('textJobTitle')}
        />
        <TextInput
          attribute={YiiModel.attr('RespondentMailingList.reml_comp_name')}
          label={YiiLang.misc('textCompany')}
        />
      </Formigo.Section>
      <Formigo.ButtonSet>
        <FormigoSnippet.SubmitButton onClick={handleSubmit}>{YiiLang.misc('textSend')}</FormigoSnippet.SubmitButton>
      </Formigo.ButtonSet>
    </Formigo>
  );
}

export default SubmitDecorator(Form);
