interface Props {
  label: string;
  href?: string;
  onClick?: () => void;
}

export default function DropdownItem({ label, href, onClick }: Props) {
  return (
    <a
      className="rounded-md px-2 py-1 after:font-semibold hover:bg-sciquelGreen hover:font-semibold hover:text-sciquelHeading focus:outline-none"
      href={href ?? "#"}
      onClick={onClick}
    >
      {label}
    </a>
  );
}
