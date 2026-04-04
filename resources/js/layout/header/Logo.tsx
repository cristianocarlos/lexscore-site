import {Link} from '@inertiajs/react';

import {getAppName} from '@/utils/import.meta';

export default function Logo({className = ''}: {className?: string}) {
  return (
    <Link className={`hover:brightness-95 ${className}`} href="/home">
      <img alt={getAppName()} src="/img/logo-without-outline.svg" />
    </Link>
  );
}
