import env from "@/lib/env";

export default async function MessageIcon() {
  const count = await fetch(`${env.NEXT_PUBLIC_SITE_URL}/api/contact/count`);
  const json = await count.json();

  console.log(json);

  if (json.new_messages) {
    return (
      <span className="rounded-full bg-sciquelTeal px-2 text-white">
        {json.new_messages} new
      </span>
    );
  } else {
    return <></>;
  }
}
