import { SendNativeTokenFormContainer } from '@/components/wallet/SendNativeTokenFormContainer';

export default function Home() {
  return (
    <div className="mt-4">
      <h1 className="sr-only">Send tokens</h1>

      <section className="w-full max-w-xl mx-auto space-y-6">
        <SendNativeTokenFormContainer />
      </section>
    </div>
  );
}
