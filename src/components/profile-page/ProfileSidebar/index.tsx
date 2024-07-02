import Avatar from "@/components/Avatar";
import FooterIcon from "@/components/Footer/FooterIcon";
import TopicTag from "@/components/TopicTag";
import { type Contributor } from "@prisma/client";

interface Props {
  contributor: Contributor;
}

export default function ProfileSidebar({ contributor }: Props) {
  return (
    <div className="h-dvh -mt-10 flex w-screen flex-1 flex-col items-center bg-[#84B59F] p-6 pt-16 text-left md:min-h-[calc(100vh_-_4rem)] md:w-fit md:max-w-xs">
      <div className="flex min-h-fit w-fit flex-col gap-2 px-3 md:h-[calc(100vh_-_9rem)] md:w-fit md:px-0">
        <Avatar
          imageUrl={"/example.png" ?? undefined}
          label="Image"
          size="6xl"
          className="h-60 w-60 self-center"
        />
        <h1 className="text-2xl">
          {contributor.firstName} {contributor.lastName}
        </h1>
        <div className="flex gap-2">
          <TopicTag name="BIOLOGY"></TopicTag>
          <TopicTag name="CHEMISTRY"></TopicTag>
        </div>
        <p className="flex-1">{contributor.bio}</p>
        <div className="mt-3 flex self-center md:self-start">
          <FooterIcon type="instagram" />
          <FooterIcon type="facebook" />
        </div>
      </div>
    </div>
  );
}
