export default function AboutPage() {
  return (
    <div>
      <div className="-mt-20 flex w-screen justify-center bg-gradient-to-r from-teal-800 to-blue-900 pb-24 pt-36 text-white lg:py-36  lg:pt-44">
        <h1 className="text-center text-5xl">About Us</h1>
      </div>
      <div className="my-8 px-12">
        <div className="flex flex-col gap-3 text-lg lg:mx-auto lg:max-w-screen-md xl:max-w-screen-lg">
          <p>
            SciQuel is a new and growing non-profit science media organization
            that publishes science writing for the general public. We are
            passionate about making science understandable for a wide and
            not-always-technical audience, through the lens of scientists.
          </p>
          <p>
            Our mission is to benefit society by making scientific knowledge
            freely accessible. We want to{" "}
            <strong>truly change the world</strong> by inspiring people to think
            and talk about science on a daily basis—akin to how we collectively
            ponder sports or pop culture or the weather.
          </p>
          <p>
            We are <strong>scientists</strong> who know what it’s like to do
            research; we are <strong>writers</strong> who know what it’s like to
            write; we are <strong>artists</strong>, <strong>editors</strong>,{" "}
            <strong>engineers</strong>, and <strong>web developers</strong> who
            share the value that{" "}
            <strong>
              scientific knowledge is best placed in the public domain
            </strong>{" "}
            and the vision that society will come to take scientific literacy
            for granted. We believe that science can be taught, no matter how
            complicated, and that knowledge is worth expounding, no matter the
            vogue.
          </p>
          <p>
            If you are interested in writing or otherwise helping out, why not
            join a meaningful cause while exploring what excites you. Whether
            you want to learn more or simply wish to connect with a community of
            like-minded people, reach out to us at{" "}
            <a href="mailto:team@sciquel.org">team@sciquel.org</a>!
          </p>
        </div>
      </div>
    </div>
  );
}
