import BoardContainer from '@/components/BoardPage/BoardContainer';

type BoardPageProps = {
  params: Promise<{ id: string }>;
};

async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params;
  return <BoardContainer boardId={id} />;
}
export default BoardPage;
