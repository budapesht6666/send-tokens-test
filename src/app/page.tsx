import { SendNativeTokenForm } from '@/components/wallet/send-native-token-form';

export default function Home() {
  return (
    <div className="mt-4">
      <h1 className="sr-only">Send tokens</h1>

      <section className="w-full max-w-xl mx-auto space-y-6">
        <SendNativeTokenForm />
      </section>
    </div>
  );
}
