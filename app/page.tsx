import { SignInButton, UserButton } from "@clerk/nextjs";

const Input = () => (
  <div className="min-w-[150px]">
    <input className="border m-1 rounded"></input>
  </div>
)

export const LoginButton = () => {
  return (
    <a className="button__login" href="/api/auth/login">
      Log In
    </a>
  );
};

type ApiProvider = {
  name: string;
  color: string;
  connectionStatus: "connected" | "disconnected";
}

const ApiProviderComponent = ({provider}: {provider: ApiProvider}) => (
  <div className="border border-black m-2 px-12 py-6">
    <h3>{provider.name}</h3>
    {provider.connectionStatus === "connected" ? "✅" : <button>Connect</button>}
  </div>

)

export default function Home() {
  const proviers: ApiProvider[] = [
    {
      name: "Spotify",
      color: "green",
      connectionStatus: "connected"
    },
    {
      name: "Strava",
      color: "orange",
      connectionStatus: "disconnected"
    }
  ]
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col text-center">
        <h1 className="text-4xl mb-6">Stacked</h1>
        <div className="border">
          <SignInButton/>
          <UserButton afterSignOutUrl="/" />
        </div>
        { proviers.map((provider) => (<ApiProviderComponent key={provider.name} provider={provider}/>))}
      </div>
    </main>
  );
}

// 1. how do we do auth?
// 2. how do we store data?
