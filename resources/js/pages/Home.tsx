import Layout from '@/layout/Layout';
import Nav from '@/pages/Nav';

export default () => {
  return (
    <Layout>
      <Layout.Content className="flex flex-col gap-8 mt-8">
        <Nav/>
        <div className="bg-amber-500">oi</div>
      </Layout.Content>
    </Layout>
  );
};
