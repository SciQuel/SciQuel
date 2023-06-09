export default function UserSetting() {
  return (
    <div className="flex grow flex-wrap overflow-y-scroll border-4 border-red-400 p-6">
      <div className="min-h-[300px] w-full rounded-md border bg-white"></div>

      <div className="mt-6 flex min-h-[180px] w-full rounded-md border bg-white"></div>

      <div className="mt-6 flex grow flex-wrap gap-6">
        <div className="min-h-[300px] flex-1 rounded-md border bg-white"></div>
        <div className="min-h-[300px] flex-1 rounded-md border bg-white"></div>
      </div>
    </div>
  );
}
