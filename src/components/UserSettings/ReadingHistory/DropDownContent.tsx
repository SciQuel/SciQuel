import Link from "next/link";
import Bookmark from "../../../../public/assets/images/bookmark-final.svg";
import Lightbulb from "../../../../public/assets/images/oi-lightbulb.svg";
import Share from "../../../../public/assets/images/oi-share-alt.svg";
import { ReadingHistory as ReadingHistoryType } from '../../../app/user-settings/actions/getReadingHistory'


interface Props {
  data: ReadingHistoryType
  bookMarkedReadingsIds: string[];
  brainedReadingIds: string[];
  handleBrainClick: (storyId: string) => void;
  handleBookmarkClick: (storyId: string) => void;
}



const DropDownContent: React.FC<Props> = ({
  data,
  bookMarkedReadingsIds,
  brainedReadingIds,
  handleBrainClick,
  handleBookmarkClick,
}) => {
  return (
    <>
      <ul className="  scrollbar-cyan mb-2 max-h-[500px] overflow-y-scroll">
        {data.length === 0 && <p className="font-bold text-md"> No Readings </p>}
        {data.map((reading) => (
          <li className="mb-5" key={crypto.randomUUID()}>
            <div className="flex  items-center gap-7">
              <img
                src={reading.story.thumbnailUrl}
                alt={`Thumbnail of ${reading.story.title}`}
                className="h-20 w-20 rounded-md object-cover"
              />
              <div>
                <Link
                  href={`/stories/${new Date(
                    reading.createdAt,
                  ).getUTCFullYear()}/${new Date(reading.createdAt).getUTCMonth() + 1
                    }/${new Date(reading.createdAt).getUTCDate()}/${reading.story.slug
                    }`}
                >
                  <p className="font-bold">{reading.story.title}</p>
                </Link>
                <p className="text-sm font-light">{`By ${reading.story.title}`}</p>
                <p className="text-sm font-light">{`Viewed ${reading.diffInDays} days ago`}</p>
              </div>

              {/* Icons */}
              <div className="ml-auto mr-5 flex items-center ">
                <button className="cursor-pointer">
                  <Bookmark
                    fill={`${bookMarkedReadingsIds.includes(reading.story.id)
                      ? "yellow"
                      : "none"
                      }`}
                    width="50px"
                    height="20px"
                    onClick={() => handleBookmarkClick(reading.story.id)}
                  />
                </button>
                <button
                  onClick={() => handleBrainClick(reading.story.id)}
                  className="cursor-pointer"
                >
                  <Lightbulb
                    width={`${brainedReadingIds.includes(reading.story.id)
                      ? "30px"
                      : "20px"
                      }`}
                    height="20px"
                  />
                </button>
                <button className="cursor-pointer">
                  <Share width="50px" height="20px" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
export default DropDownContent;
