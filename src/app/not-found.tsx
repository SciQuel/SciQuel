import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mt-20 flex grow flex-col items-center justify-center">
      <div className="flex flex-row">
        <div className="flex flex-col text-sciquelMuted2">
          <h2 className="text-4xl font-bold">Oops! Page Not Found</h2>
          <p className="mt-3 text-xl">
            Please navigate back to <Link href="/">SciQuel</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
