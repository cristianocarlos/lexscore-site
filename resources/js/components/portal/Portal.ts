import {useState} from 'react';
import {createPortal} from 'react-dom';

import {getDocument} from '@/utils/globals';
import {useDidMountEffect} from '@/utils/hooks';

import type {ReactNode} from 'react';

type IPPortal = {
  children: ReactNode;
  id: string;
};

export default function Portal({children, id}: IPPortal) {
  const [domReady, setDomReady] = useState(false);
  useDidMountEffect(() => {
    setDomReady(true);
  });
  const dom = getDocument().getElementById(id);
  return domReady && dom ? createPortal(children, dom) : null;
}
