import Feedback from '@/components/portal/Feedback';
import BrowserTitle from '@/layout/BrowserTitle';
import Header from '@/layout/header/Header';
import Content from '@/layout/main/Content';
import Rows from '@/layout/main/Rows';
import Top from '@/layout/main/Top';

import type {PropsWithChildren} from 'react';

Layout.Top = Top;
Layout.Content = Content;
Layout.Rows = Rows;

export default function Layout({children, hideHeader}: PropsWithChildren & {hideHeader?: boolean}) {
  return (
    <>
      <BrowserTitle />
      {hideHeader ? undefined : <Header />}
      <main className="agg--layout-canvas-width flex flex-wrap gap-8">{children}</main>
      <Feedback />
    </>
  );
}
