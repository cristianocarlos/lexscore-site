import YiiLang from '~/phpgen/yii-lang';

import Formigo from '@/components/formigo/Formigo';
import axiosFormigoApi from '@/components/formigo/snippet/axiosFormigoApi';

import type {TModalCloseHandler} from '@/components/portal/Modal';
import type {TButtonMouseEventHandler} from '@/types/common';

export type TDeleteHandlerProps = {
  handleConfirm: () => void;
  handleModalClose: TModalCloseHandler;
  socketId?: string;
  url: string;
};

const preventDoubleSubmission: TButtonMouseEventHandler = (e) => {
  const {currentTarget} = e;
  currentTarget.disabled = true;
  window.setTimeout(() => {
    currentTarget.disabled = false;
  }, 2000);
};

export default function DeleteHandler(props: TDeleteHandlerProps) {
  const {handleConfirm, handleModalClose, url} = props;
  const handleDelete: TButtonMouseEventHandler = async (e) => {
    e.preventDefault();
    preventDoubleSubmission(e);
    await axiosFormigoApi.recordDelete(url);
    handleConfirm();
    handleModalClose();
  };

  return (
    <>
      <div className="mb-4">{YiiLang.formigo('textFormDeleteConfirmAsk')}</div>
      <Formigo.ButtonSet hasFeedback={false}>
        <button className="agg--button-primary" onClick={handleDelete}>
          {YiiLang.formigo('labelFormDeleteConfirmDeleteButton')}
        </button>
        <button onClick={handleModalClose} type="button">
          {YiiLang.formigo('labelFormDeleteConfirmCancelButton')}
        </button>
      </Formigo.ButtonSet>
    </>
  );
}
