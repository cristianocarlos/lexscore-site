import {debounce as esToolkitDebounce} from 'es-toolkit/function';
import {useRef, useState} from 'react';

import {useDidMountEffect, useWillUnmountEffect} from '@/utils/hooks';

import type {PropsWithChildren} from 'react';

function useScrollEffect(cb: (prevPosition: number, currPosition: number) => void) {
  const previousPositionRef = useRef(0);

  const handleScroll = esToolkitDebounce(() => {
    const currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
    const previousPosition = previousPositionRef.current;
    const minimumScrollDelta = 30;
    if (Math.abs(currentPosition - previousPosition) < minimumScrollDelta) return;
    cb(previousPosition, currentPosition);
    previousPositionRef.current = currentPosition;
  }, 50);

  useDidMountEffect(() => {
    document.addEventListener('scroll', handleScroll);
  });

  useWillUnmountEffect(() => {
    document.removeEventListener('scroll', handleScroll);
  });
}

export default function PracticalHeader({
  children,
  className = '',
  height,
}: PropsWithChildren & {className?: string; height: number}) {
  const [shouldHide, setShouldHide] = useState(false);

  useScrollEffect((prevPosition, currPosition) => {
    setShouldHide(currPosition > height && currPosition > prevPosition);
  });

  return (
    <>
      <div
        className={`z-header fixed w-full transition-transform duration-500 ${shouldHide ? '-translate-y-full' : ''} ${className}`}
      >
        {children}
      </div>
      {/* para manter o conteúdo abaixo do header */}
      <div className={className} style={{height}} />
    </>
  );
}
