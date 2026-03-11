import Avatar from "@/components/Avatar";
import FooterIcon from "@/components/Footer/FooterIcon";
import TopicTag from "@/components/TopicTag";
import { type Contributor, type StoryTopic } from "@prisma/client";

interface Props {
  contributor: Contributor;
  topTopics: StoryTopic[];
}

export default function ProfileSidebar({ contributor, topTopics }: Props) {
  const socials = Object.fromEntries(
    (contributor.socialLinks ?? []).map((l) => [
      l.platform.toLowerCase(),
      l.url,
    ]),
  );

  return (
    <div className="-mt-10 flex h-dvh w-screen flex-1 flex-col items-center bg-[#84B59F] p-6 pt-16 text-left md:min-h-[calc(100vh_-_4rem)] md:w-fit md:max-w-xs">
      <div className="flex min-h-fit w-fit flex-col gap-2 px-3 md:h-[calc(100vh_-_9rem)] md:w-fit md:px-0">
        <Avatar
          imageUrl={contributor.avatarUrl ?? undefined}
          label="Image"
          size="6xl"
          className="h-60 w-60 self-center"
        />
        <h1 className="text-2xl">
          {contributor.firstName} {contributor.lastName}
        </h1>
        <div className="flex gap-2">
          {topTopics[0] && <TopicTag name={topTopics[0]} />}
          {topTopics[1] && <TopicTag name={topTopics[1]} />}
        </div>
        <p className="flex-1">{contributor.bio}</p>
        <div className="mt-3 flex self-center md:self-start">
          {socials.instagram && (
            <a
              href={socials.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FooterIcon type="instagram" />
            </a>
          )}

          {socials.facebook && (
            <a
              href={socials.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FooterIcon type="facebook" />
            </a>
          )}

          {socials.youtube && (
            <a
              href={socials.youtube}
              target="_blank"
              rel="noreferrer"
              aria-label="youtube"
            >
              <FooterIcon type="youtube" />
            </a>
          )}

          {socials.arrow && (
            <a
              href={socials.arrow}
              target="_blank"
              rel="noreferrer"
              aria-label="arrow"
            >
              <FooterIcon type="arrow" />
            </a>
          )}
          {socials.website && (
            <a
              href={socials.website}
              target="_blank"
              rel="noreferrer"
              aria-label="website"
            >
              <FooterIcon type="website" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
