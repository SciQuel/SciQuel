export default function AboutPage() {
  return (
    <div>
      <div className="-mt-20 flex w-screen justify-center bg-gradient-to-r from-teal-800 to-blue-900 pb-24 pt-36 text-white lg:py-36  lg:pt-44">
        <h1 className="text-center text-5xl">About Us</h1>
      </div>
      <div className="my-8 px-12">
        <div className="flex flex-col gap-3 text-lg lg:mx-auto lg:max-w-screen-md xl:max-w-screen-lg">
          <p>
            SciQuel is a new and growing non-profit science media organization.
            We are scientists, developers, writers, and illustrators who create
            original content (articles, podcasts, and videos) meant for a
            non-technical audience. We are passionate about{" "}
            <span className="font-bold">
              making science understandable for the general public
            </span>{" "}
            through the lens of scientists.
          </p>
          <p>
            Our mission is to benefit society by making scientific knowledge
            freely accessible. We want to truly change the world by inspiring
            people to think and talk about science on a daily basis.
          </p>
          <p>
            If you are interested in helping out, learning more, or just
            connecting with a community of like-minded people, reach out to
            <a href="mailto:team@sciquel.org"> team@sciquel.org!</a>
          </p>
        </div>
      </div>
    </div>
  );
}
