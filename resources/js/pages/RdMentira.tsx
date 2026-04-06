import Layout from '@/layout/Layout';
import axiosAppApi from '@/utils/xhr/axiosAppApi';

import type {TButtonMouseEvent} from '@/types/common';

type TProps = {
  rows: Array<{
    reml_uuid: string;
    respondent_relation: {
      resp_mail: string;
    };
  }>;
};

type TFlatRows = Array<{id: string; email: string}>;

export default ({rows}: TProps) => {
  const flatRows = [] as TFlatRows;
  rows.forEach((data) => {
    flatRows.push({email: data.respondent_relation.resp_mail, id: data.reml_uuid});
  });

  const onClick = async (e: TButtonMouseEvent) => {
    e.preventDefault();
    const response = await axiosAppApi.post('/api/rd-mentira', {rows: flatRows});
    console.log(response);
  };

  return (
    <Layout hideHeader={true}>
      <h1 className="bg-pink-500 flex basis-full items-center flex-col">
        <div className="text-white text-6xl font-bold">RD Mentirinha</div>
      </h1>
      <Layout.Content className="flex flex-col gap-8 mt-8">
        <ul>
          {flatRows.map((data) => {
            return <li key={data.id}>{data.email}</li>;
          })}
        </ul>
        <button onClick={onClick} type="button">
          Enviar
        </button>
      </Layout.Content>
    </Layout>
  );
};
