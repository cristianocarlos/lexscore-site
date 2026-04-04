const size = 40;
const borderDiff = 0; // Diferença 2px em cima e 2px embaixo por caisa da borda com sombra
const resolvedPadding = (size / 10) * 4;
const resolvedSize = size - borderDiff;
const heightStyle = {height: size};
const appendStyle = {width: resolvedSize}; // Diferença 2px em cima e 2px embaixo por caisa da borda com sombra
const prependStyle = {width: resolvedSize}; // Diferença 2px em cima e 2px embaixo por caisa da borda com sombra
const iconPaddingLeft = size - borderDiff;
const iconPaddingRight = size - borderDiff;

export function resolveInputStyle(hasPrepend?: boolean, hasAppend?: boolean) {
  return {
    paddingLeft: hasPrepend ? iconPaddingLeft : resolvedPadding,
    paddingRight: hasAppend ? iconPaddingRight : resolvedPadding,
  };
}

export {appendStyle, heightStyle, prependStyle, resolvedPadding, resolvedSize, size};
