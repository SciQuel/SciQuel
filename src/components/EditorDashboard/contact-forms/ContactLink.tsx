import MessageIcon from "./MessageIcon";

export default function ContactLink() {
  return (
    <a
      href="/editor/dashboard/contact"
      className="mx-4 rounded-full border-2 border-teal-900 px-3 py-1 text-base text-teal-950"
    >
      View Messages <MessageIcon />
    </a>
  );
}
