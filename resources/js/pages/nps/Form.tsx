import './Form.css';

import YiiLang from '~/phpgen/yii-lang';
import YiiModel from '~/phpgen/yii-model';

import {useState} from 'react';

import Formigo, {RadioGroup, TextArea, TextInput} from '@/components/formigo/Formigo';
import FormigoSnippet from '@/components/formigo/snippet/FormigoSnippet';
import SubmitDecorator, {useHandleFetchSubmit} from '@/components/formigo/SubmitDecorator';
import {getSection3Questions, getSection4Questions} from '@/pages/nps/questions';
import {getSequenceOptions} from '@/utils/helper';
import {queryStringParse} from '@/utils/queryString';

import type {TButtonMouseEventHandler} from '@/types/common';

function Form() {
  const [success, setSuccess] = useState(false);

  const parsedQs = queryStringParse(window.location.search);

  const handleFetchSubmit = useHandleFetchSubmit();

  const handleSubmit: TButtonMouseEventHandler = async (e) => {
    const responseData = await handleFetchSubmit(e);
    setSuccess(responseData.success);
  };

  if (success) return <div className="agg--message-info">{YiiLang.page('Obrigado')}</div>;

  const options = getSequenceOptions(1, 10);

  const s3 = getSection3Questions();
  const s4 = getSection4Questions();

  return (
    <Formigo action="/api/nps/send" className="nps-form">
      <Formigo.Section>
        <header className="mb-8 text-2xl font-bold mb-8">
          Penal
        </header>

        <div className="agg--form-row">
          <TextInput attribute={YiiModel.attr('RespondentMailingList.reml_pers_name')} label={YiiLang.misc('textName')} />
          <TextInput
            attribute={YiiModel.attr('RespondentMailingList.reml_pers_joti')}
            label={YiiLang.misc('textJobTitle')}
          />
        </div>
        <TextInput
          attribute={YiiModel.attr('RespondentMailingList.reml_comp_name')}
          label={YiiLang.misc('textCompany')}
        />
        <h3 className="text-transparent">{'.'}</h3>
        <RadioGroup
          attribute={['Answer', 'answ_ques', '5']}
          initValue={parsedQs.v}
          label="Em uma escala de 0 a 10, o quanto você recomendaria nosso escritório a um colega ou a outro executivo?"
          options={options}
          pattern="filled"
        />
        <TextArea
          attribute={['Answer', 'answ_ques', '6']}
          label="Por favor, conte o principal motivo para essa nota"
        />
        <h3>{s3.title}</h3>
        {s3.options.map((data) => {
          return (
            <RadioGroup
              attribute={['Answer', 'answ_ques', data.id.toString()]}
              key={data.id}
              label={data.label}
              options={options}
              pattern="filled"
            />
          )
        })}
        <h3>{s4.title}</h3>
        {s4.subs.map((subData, index) => {
          return (
            <div key={index}>
              <h4>{subData.title}</h4>
              {subData.options.map((data) => {
                return (
                  <RadioGroup
                    attribute={['Answer', 'answ_ques', data.id.toString()]}
                    key={data.id}
                    label={data.label}
                    options={options}
                    pattern="filled"
                  />
                )
              })}
            </div>
          )
        })}
      </Formigo.Section>
      <Formigo.ButtonSet>
        <FormigoSnippet.SubmitButton onClick={handleSubmit}>{YiiLang.misc('textSend')}</FormigoSnippet.SubmitButton>
      </Formigo.ButtonSet>
    </Formigo>
  );
}

export default SubmitDecorator(Form);
