interface Props {
  endpoint: string;
}

export function ContactForm({ endpoint }: Props) {
  return (
    <form className="flex w-full flex-col" method="post" action={endpoint}>
      <label htmlFor="contact-name-input" className="text-xl font-semibold">
        Name{" "}
        <span className=" text-base font-normal text-sciquelCaption">
          (required)
        </span>
      </label>
      <input
        id="contact-name-input"
        className="mb-2 rounded-md border-2  border-sciquelTeal p-1 text-xl"
        type="text"
        name="name"
        required={true}
      ></input>

      <label htmlFor="contact-email-input" className=" text-xl font-semibold">
        Email{" "}
        <span className="text-base font-normal  text-sciquelCaption">
          (required)
        </span>
      </label>
      <input
        required={true}
        type="email"
        name="email"
        id="contact-email-input"
        className="mb-2 rounded-md border-2 border-sciquelTeal p-1 text-xl"
      ></input>

      <label htmlFor="contact-comment-input" className=" text-xl font-semibold">
        Message
      </label>
      <textarea
        className="rounded-md border-2 border-sciquelTeal  p-1 text-xl"
        id="contact-comment-input"
        name="comment"
        rows={8}
      ></textarea>

      <button
        type="submit"
        className="my-4 w-fit rounded-md bg-sciquelTeal px-4 py-2 text-xl font-semibold text-white transition-colors duration-100 hover:bg-[#046969] focus:bg-[#046969] focus:ring-4 focus:ring-[#a1c2be] sm:text-2xl"
      >
        Get Involved!
      </button>
    </form>
  );
}
