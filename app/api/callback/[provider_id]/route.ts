// export const fetchCache = "default-no-store";

import PROVIDERS from "@/integration/providers";
import prisma from "@/prisma/db";
import { getAuth } from "@clerk/nextjs/server";
import { IntegrationProviderId } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { provider_id: string } },
) {
  const userId = getAuth(request).userId;
  if (!userId) {
    return new Response("Not signed in.", { status: 401 });
  }

  if (!params.provider_id) {
    return new Response("Provider ID not provided.", { status: 500 });
  }

  const idKey =
    params.provider_id.toUpperCase() as keyof typeof IntegrationProviderId;
  const id = IntegrationProviderId[idKey];
  const provider = PROVIDERS.get(id);

  if (!provider) {
    return new Response("Provider not found.", { status: 500 });
  }

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: { clerkId: userId },
  });

  await provider.handleAuthCallback(request, user.id);

  return NextResponse.redirect(new URL(request.url).origin + "/");
}
