import Layout from '@/layout/Layout';
import Form from '@/pages/nps/Form';

export default () => {
  return (
    <Layout>
      <Layout.Content className="flex flex-col gap-8 mt-8">
        <Form />
      </Layout.Content>
    </Layout>
  );
};
