import Layout from '@/layout/Layout';
import Form from '@/pages/nps/Form';
import Nav from '@/pages/Nav';

export default () => {
  return (
    <Layout>
      <Layout.Content className="flex flex-col gap-8 mt-8">
        <Nav/>
        <Form />
      </Layout.Content>
    </Layout>
  );
};
