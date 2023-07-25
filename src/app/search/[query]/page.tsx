import Search from "@/components/Search";

interface Params {
  params: {
    query: string;
  };
}

export default async function SearchPage({ params }: Params) {
  const { query } = params;
  console.log("params", params);
  console.log("query", query);
  return (
    <div>
      <Search query={query} />
    </div>
  );
}
