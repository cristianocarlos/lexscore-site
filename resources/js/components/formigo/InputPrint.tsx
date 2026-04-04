import FormEmptyDesc from '@/components/formigo/layout/FormEmptyDesc';

export default function InputPrint({value}: {value?: number | string}) {
  return <div>{value || <FormEmptyDesc />}</div>;
}
