import { SawpPageContainer } from './_components/SawpPageContainer';

export default async function SawpPage() {
  return (
    <div className="mt-4">
      <h1 className="sr-only">Sawp page</h1>

      <section className="w-full max-w-xl mx-auto space-y-6">
        <SawpPageContainer />
      </section>
    </div>
  );
}
