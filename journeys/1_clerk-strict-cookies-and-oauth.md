
## Summary
When the user has authenticated with a provider and is redirected to the callback URL, Clerk's `__client-uat` cookie is not passed to our callback route as it uses the `SameSite: Strict`, which configures the browser to only send the given cookie when the user has NOT arrived at the current link from a referral.

I tried a few ways of circuventing this, see below.

## Making the callback URL public
**Didn't work**.

Clerk's middleware allows you to designate given paths as public, and won't enforce authentication in order for the user to navigate to them.

Sadly this doesn't seem to for any routes under `/api`, but I can't seem to find documentation on this being the case... Any time I set an api route public, auth would still be enforced.

Additionally, would probably still cause an authentication issue when looking up the user from the remaining cookies (`__clerk_db_jwt` and `__session`) may not be enough to authorize them? I'm not sure what Clerk's implementation is...

## Redirect within our site
**Worked!**

With this approach, I created a new page and made it public. I then set this page up to take the query params it was given and forward them to the actual callback handler path. This forwarding (redirect) isn't subject to the `SameSite: Strict` rule and the `__client-uat` cookie is forwarded!

I'm still not totally happy with this solution as this redirect just feels silly... I'll reach out to Clerk about this and may think of some other ideas.

## What the internet said
I did a bit of googling and it turns out that `SameSite: Strict` just seems to be a blocker for OAuth callbacks. I'm a bit surprised about this, I don't fully believe it's true since many sites would have to choose between not using this CSRF feature or integrating with other sites!

[Here's one](https://stackoverflow.com/a/42220786) intersting StackOverflow answer I'll link to in particular.

**ChatGPT came up with this when I asked it**
It sounds like you're facing a common issue related to SameSite cookie policies when working with OAuth callbacks. The SameSite attribute is designed to enhance user privacy and security by preventing cross-site request forgery (CSRF) attacks.

In your case, since the OAuth callback is initiated from a different site, the browser may treat it as a third-party request, and if your cookies have the SameSite attribute set to "Strict," they won't be sent with the request. To resolve this issue, you can consider the following options:

1. **Change SameSite Attribute:**
   - Relax the SameSite attribute to "Lax" instead of "Strict" for your authentication cookies. This allows cookies to be sent with top-level navigations initiated by third-party websites.
   - Example:
     ```javascript
     Set-Cookie: yourCookieName=yourCookieValue; SameSite=Lax; Secure; HttpOnly
     ```

2. **Use a Separate Domain for OAuth Callbacks:**
   - If possible, use a separate subdomain for your OAuth callbacks. Cookies set on the main domain won't be sent to subdomains with a strict SameSite policy, and vice versa.

3. **Handle OAuth Callback Server-Side:**
   - Instead of relying on cookies sent by the client, handle the OAuth callback server-side. Extract the necessary information from the callback request and authenticate the user without relying on cookies.

4. **Update OAuth Provider Configuration:**
   - Check if your OAuth provider allows you to configure the redirect URI or other settings that might affect how cookies are handled during the OAuth callback.

5. **Prompt Users to Enable Third-Party Cookies:**
   - Instruct your users to enable third-party cookies for your site. However, this may not be a feasible solution in all cases as many users have privacy concerns and may not want to enable third-party cookies.

Before making changes, it's important to understand the security implications of relaxing the SameSite attribute and ensure that your authentication system remains secure. Always consider the specific requirements and constraints of your application.