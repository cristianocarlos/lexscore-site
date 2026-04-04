import {zustandFormigoGetData} from '@/components/formigo/zustand/store';
import {immerGetValueIn} from '@/utils/immerHelper';
import {zustandScreenGetData} from '@/utils/zustand/screen/store';

import type {TErrorBoundaryDebugStateRows} from '@/components/portal/ErrorBoundary';

export const stateToolGetDebugState = (stateLogRows: TErrorBoundaryDebugStateRows) => {
  const debugState: {[p: string]: unknown} = {};
  stateLogRows.forEach((data) => {
    let storeData;
    switch (data.storeId) {
      case 'formigo':
        storeData = immerGetValueIn(zustandFormigoGetData(), data.dataKeyPath);
        break;
      case 'screen':
        storeData = immerGetValueIn(zustandScreenGetData(), data.dataKeyPath);
        break;
      default:
    }
    // força null, undefined não envia nem akey vazia
    debugState[data.storeId + ',' + data.dataKeyPath] = storeData || null;
  });
  return debugState;
};
