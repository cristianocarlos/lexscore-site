import {Link} from '@inertiajs/react';
import {Fragment} from 'react';

import SvgMap from '@/components/common/SvgMap';
import {usePageMetaData} from '@/shared/utils/usePageSlice';

export default function BreadCrumbs({className = ''}: {className?: string}) {
  const {breadCrumbs} = usePageMetaData();
  if (!breadCrumbs) return undefined;
  return (
    <nav className={`flex items-center gap-2 text-sm text-gray-500 ${className}`}>
      {breadCrumbs.map((data, index) => {
        return (
          <Fragment key={index}>
            {data.path ? (
              <Link href={data.path}>{data.label}</Link>
            ) : (
              <span className="text-brand-700 font-semibold">{data.label}</span>
            )}
            {index + 1 < breadCrumbs.length ? <SvgMap className="-rotate-90" name="feather-chevron-down" /> : undefined}
          </Fragment>
        );
      })}
    </nav>
  );
}
