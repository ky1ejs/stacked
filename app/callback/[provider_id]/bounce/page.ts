import { redirect } from "next/navigation";

export default function Page({
  params,
  searchParams,
}: {
  params: { provider_id: string };
  searchParams?: { [key: string]: string };
}) {
  if (!searchParams) {
    return "Error";
  }
  const query = new URLSearchParams(searchParams);
  redirect(`/callback/${params.provider_id}?${query.toString()}`);
}
