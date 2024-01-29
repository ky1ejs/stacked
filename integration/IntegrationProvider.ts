import { IntegrationProviderId } from "@prisma/client";

type IntegrationProvider = {
  id: IntegrationProviderId;
  displayName: string;
  clientId: string;
  clientSecret: string;
  authUrlBuilder: () => string;
  handleAuthCallback: (request: Request, userId: string) => Promise<void>;
};

export default IntegrationProvider;
