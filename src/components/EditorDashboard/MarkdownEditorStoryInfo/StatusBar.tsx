interface Props {
  wordStats: Record<string, number>;
}

export default function StatusBar({ wordStats }: Props) {
  return (
    <div className="flex flex-row border-t bg-slate-100 px-2 py-1 text-xs">
      <div>Word Count: {wordStats["WordNode"] ?? 0}</div>
    </div>
  );
}
