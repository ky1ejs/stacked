import prisma from "@/prisma/db";
import { IntegrationProviderId } from "@prisma/client";
import Tokens from "./tokens";

export type AuthCallbackHandler = (
  code: string,
  provider: IntegrationProvider,
  host: string,
) => Promise<Tokens>;

class IntegrationProvider {
  id: IntegrationProviderId;
  displayName: string;
  clientId: string;
  clientSecret: string;
  scope: string;
  authUri: string;
  private _handleAuthCallback: AuthCallbackHandler;

  constructor(
    id: IntegrationProviderId,
    displayName: string,
    clientId: string,
    clientSecret: string,
    scope: string,
    authUri: string,
    _handleAuthCallback: AuthCallbackHandler,
  ) {
    this.id = id;
    this.displayName = displayName;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.scope = scope;
    this.authUri = authUri;
    this._handleAuthCallback = _handleAuthCallback;
  }

  buildRedirectUri(host: string) {
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    return `${protocol}://${host}/callback/${this.id.toLowerCase()}/bounce`;
  }

  buildAuthUrl(host: string) {
    const state = (Math.random() + 1).toString(36).substring(7);
    const params = new URLSearchParams();
    params.append("client_id", this.clientId);
    params.append("redirect_uri", this.buildRedirectUri(host));
    params.append("scope", this.scope);
    // params.append("approval_prompt", "force");
    params.append("response_type", "code");
    params.append("state", state);

    return this.authUri + "?" + params.toString();
  }

  async handleAuthCallback(request: Request, userId: string) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      throw new Error("Code not provided.");
    }
    const tokens = await this._handleAuthCallback(
      code,
      this,
      new URL(request.url).host,
    );
    await prisma.userIntegration.upsert({
      where: {
        integration_user_unique: {
          userId: userId,
          integrationProvider: this.id,
        },
      },
      update: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      create: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        integrationProvider: this.id,
        userId,
      },
    });
  }
}

export default IntegrationProvider;
