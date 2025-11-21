import { HistoryPageContainer } from './_components/HistoryPageContainer';

export default async function HistoryPage() {
  return (
    <div className="mt-4">
      <h1 className="mb-2">Transfers history</h1>
      <HistoryPageContainer />
    </div>
  );
}
