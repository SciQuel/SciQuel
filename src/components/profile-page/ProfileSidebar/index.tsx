import Avatar from "@/components/Avatar";
import FooterIcon from "@/components/Footer/FooterIcon";
import TopicTag from "@/components/TopicTag";
import { type Contributor } from "@prisma/client";

interface Props {
  contributor: Contributor;
}

export default function ProfileSidebar({ contributor }: Props) {
  return (
    <div className="flex h-fit min-h-[calc(100vh_-_4rem)] w-fit flex-1 flex-col bg-[#84B59F] p-6 pt-16 text-left">
      <div className="flex flex-1 flex-col gap-2">
        <Avatar
          imageUrl={"/example.png" ?? undefined}
          label="Image"
          size="6xl"
          className="h-60 w-60"
        />
        <h1 className="text-2xl">
          {contributor.firstName} {contributor.lastName}
        </h1>
        <div className="flex gap-2">
          <TopicTag name="BIOLOGY"></TopicTag>
          <TopicTag name="CHEMISTRY"></TopicTag>
        </div>
        <p>{contributor.bio}</p>
      </div>

      <div className="mt-3 flex">
        <FooterIcon type="instagram" />
        <FooterIcon type="facebook" />
      </div>
    </div>
  );
}
