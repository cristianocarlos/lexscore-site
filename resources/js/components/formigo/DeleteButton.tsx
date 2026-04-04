import YiiLang from '~/phpgen/yii-lang';

import SvgMap from '@/components/common/SvgMap';
import ModalButton from '@/components/portal/ModalButton';

import DeleteHandler from './DeleteHandler';

import type {TDeleteHandlerProps} from './DeleteHandler';
import type {ReactNode} from 'react';

export type IPDeleteButton = {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  handleConfirm: TDeleteHandlerProps['handleConfirm'];
  socketId?: TDeleteHandlerProps['socketId']; // Pode ser necessário para controle de sockets
  url: TDeleteHandlerProps['url'];
};

export default function DeleteButton(props: IPDeleteButton) {
  const {children, className, disabled, handleConfirm, socketId, url} = props;
  return (
    <ModalButton
      className={`mf__delete-button ml-auto ${className}`}
      disabled={disabled}
      hasAnimation={true}
      modalTitle={YiiLang.formigo('textFormDeleteConfirmTitle')}
      renderModal={({handleClose}) => {
        return (
          <DeleteHandler handleConfirm={handleConfirm} handleModalClose={handleClose} socketId={socketId} url={url} />
        );
      }}
    >
      {children || <SvgMap label={YiiLang.formigo('labelFormDeleteButton')} name="linecons-trash" />}
    </ModalButton>
  );
}
