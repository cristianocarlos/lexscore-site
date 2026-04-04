import {type TSvgMapNames} from '~/phpgen/yii-svg-map';

export type TRouteNavDTO = {apiDeleteUrl: string; apiSaveUrl: string; createUrl: string; indexUrl: string; updatePath: string}
export type TPhoneDTO = {country_data?: TCountryDTO; extension?: string; id: number; is_main?: boolean; is_restrict?: boolean; number: string; type?: number; type_desc?: string}
export type TCountryDTO = {dialing_code: string; id: string; iso2_id: string}
