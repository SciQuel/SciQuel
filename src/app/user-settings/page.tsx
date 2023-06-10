import GreetingCard from "@/components/UserSettings/GreetingCard";

export default function UserSetting() {
  return (
    <div className="relative flex grow flex-col pt-6 md:pl-56">
      <GreetingCard />
      <div className="mt-6 flex min-h-[180px] w-full rounded-md border bg-white"></div>

      <div className="mt-6 flex grow flex-wrap gap-6 border-4">
        <div className="min-h-[300px] basis-full rounded-md border bg-white lg:flex-1"></div>
        <div className="min-h-[300px] basis-full rounded-md border bg-white lg:flex-1"></div>
      </div>
    </div>
  );
}
