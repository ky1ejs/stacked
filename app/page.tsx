import IntegrationProvider from "@/integration/IntegrationProvider";
import PROVIDERS from "@/integration/providers";
import prisma from "@/prisma/db";
import { SignInButton, UserButton, currentUser } from "@clerk/nextjs";
import { IntegrationProviderId } from "@prisma/client";
import { headers } from "next/headers";

const ApiProviderComponent = ({
  provider,
  integratedIds,
}: {
  provider: IntegrationProvider;
  integratedIds: IntegrationProviderId[];
}) => {
  const headersList = headers();
  const host = headersList.get("host");

  if (!host) throw new Error("No host");

  return (
    <div className="m-2 border border-black px-12 py-6">
      <h3>{provider.displayName}</h3>
      <div className="m-2 rounded bg-slate-400 px-6 py-1">
        <a href={provider.buildAuthUrl(host)}>Link</a>
        {integratedIds.includes(provider.id) && <div>✅</div>}
      </div>
    </div>
  );
};

export default async function Home() {
  const user = await currentUser();
  const userAndIntegrations = await prisma.user.findUnique({
    where: { clerkId: user!.id },
    include: { UserIntegration: true },
  });
  const integrationIds =
    userAndIntegrations?.UserIntegration.map((i) => i.integrationProvider) ??
    [];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col text-center">
        <h1 className="mb-6 text-4xl">Stacked</h1>
        <div>Your id: {userAndIntegrations?.id}</div>
        <div className="border">
          <SignInButton />
          <UserButton afterSignOutUrl="/" />
        </div>
        {Array.from(PROVIDERS.values()).map((provider) => (
          <ApiProviderComponent
            key={provider.id}
            provider={provider}
            integratedIds={integrationIds}
          />
        ))}
      </div>
    </main>
  );
}

// 1. how do we do auth?
// 2. how do we store data?
