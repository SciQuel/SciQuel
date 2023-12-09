import { ContactForm } from "@/components/ContactForm/ContactForm";

export default function ContactUsPage() {
  return (
    <div className="m-auto mb-8 mt-8 flex flex-1 flex-col items-center px-4 md:w-[768px]">
      <h1 className="  mb-6 w-full text-center text-4xl font-bold  text-sciquelTeal sm:text-5xl">
        Get Involved
      </h1>
      <p className="mb-2 w-full text-xl sm:mb-4 md:text-2xl">
        Believe scientific literacy is valuable? <br />
        Passionate about science and new scientific discoveries? <br />
        Interested in contributing to our reporting? <br />
      </p>
      <p className="mb-4 w-full text-xl md:text-2xl">
        If so, contact us at sciquel.team@gmail.com or fill out the form below.
      </p>
      <ContactForm endpoint="" />
    </div>
  );
}
