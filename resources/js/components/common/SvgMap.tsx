import {type TSvgMapNames, SVG_MAP_NAMES_HASH} from '~/phpgen/yii-svg-map';

type IPSvgMap = {
  className?: string;
  label?: string;
  name: TSvgMapNames;
  spinner?: boolean;
  title?: string;
};

export default function SvgMap({className, label, name, spinner, title}: IPSvgMap) {
  return (
    <>
      <svg
        className={`size-1em fill-current ${name} ${className} ${spinner ? 'animate-spin' : ''} ${!label ? '' : 'mr-1 inline'}`}
      >
        {title ? <title>{title}</title> : null}
        <use
          className="pointer-events-none"
          xlinkHref={'/img/icon-sprite-map.svg' + '?' + SVG_MAP_NAMES_HASH + '#icon-' + name}
        />
      </svg>
      {label}
    </>
  );
}
