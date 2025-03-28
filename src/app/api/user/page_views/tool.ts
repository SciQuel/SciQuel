import prisma from "@/lib/prisma";
import { type ContributionType, type Prisma } from "@prisma/client";

interface getReadingHistoryI {
  userId: string;
  page?: number;
  limit?: number;
  distinct?: boolean;
}
type groupStoryType = {
  $group: {
    _id: {
      storyId: string;
      readDate?: {
        $dateToString: {
          format: string;
          date: string;
        };
      };
    };
    lastReadTime: {
      $last: string;
    };
  };
};

type aggregateResponeAnchorType = {
  _id: {
    storyId: {
      $oid: string;
    };
    readDate?: string;
  };
  lastReadTime: {
    $date: string;
  };
  storyInfo: {
    _id: {
      $oid: string;
    };
    title: string;
    summary: string;
    slug: string;
    thumbnailUrl: string;
    articlePublish: {
      $date: string;
    };
  }[];
  contributorsId: {
    _id: {
      $oid: string;
    };
    contributionType: ContributionType;
    contributorId: {
      $oid: string;
    };
  }[];
  contributorsName: [
    {
      _id: {
        $oid: string;
      };
      firstName: string;
      lastName: string;
    },
  ];
  bookmarked: { exist: number }[];
  brained: { exist: number }[];
};
type aggregateResponeCountType = {
  count: number;
}[];
export async function getReadingHistory(params: getReadingHistoryI) {
  const { userId, page = 0, limit = 10, distinct = false } = params;
  const groupStory: groupStoryType & Prisma.InputJsonValue = {
    $group: {
      _id: {
        storyId: "$storyId",
      },
      lastReadTime: {
        $last: "$createdAt",
      },
    },
  };
  if (!distinct) {
    groupStory.$group._id["readDate"] = {
      $dateToString: {
        format: "%Y-%m-%d",
        date: "$createdAt",
      },
    };
  }
  const paginatedResultPromise = prisma.pageView.aggregateRaw({
    pipeline: [
      //find read date data that match userId
      { $match: { userId: { $oid: userId } } },
      groupStory,
      //This will sort user read date in descending order.
      //it is requried to get the time that user last read the story
      {
        $sort: { createdAt: -1, lastReadTime: -1 },
      },
      //pagination setting
      {
        $skip: page * limit,
      },
      {
        $limit: limit,
      },
      //get storyInfo that match story id from read date data
      {
        $lookup: {
          from: "Story",
          localField: "_id.storyId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                slug: 1,
                summary: 1,
                title: 1,
                thumbnailUrl: 1,
                articlePublish: "$publishedAt",
              },
            },
          ],
          as: "storyInfo",
        },
      },
      //get contributorsId info that match story id from storyInfo
      {
        $lookup: {
          from: "StoryContribution",
          localField: "_id.storyId",
          foreignField: "storyId",
          pipeline: [
            {
              $project: {
                contributorId: 1,
                contributionType: 1,
              },
            },
          ],
          as: "contributorsId",
        },
      },
      //get contributor data that match contributor id from contributorsId info
      {
        $lookup: {
          from: "Contributor",
          localField: "contributorsId.contributorId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
              },
            },
          ],
          as: "contributorsName",
        },
      },
      //get bookmarked data that match story id from read date data. This to check if user readed story is bookmark
      {
        $lookup: {
          from: "Bookmark",
          localField: "_id.storyId",
          foreignField: "storyId",
          pipeline: [
            { $match: { userId: { $oid: userId } } },
            { $count: "exist" },
          ],
          as: "bookmarked",
        },
      },
      //get bookmarked data that match story id from read date data. This to check if user readed story is brained
      {
        $lookup: {
          from: "Brain",
          localField: "_id.storyId",
          foreignField: "storyId",
          pipeline: [
            { $match: { userId: { $oid: userId } } },
            { $count: "exist" },
          ],
          as: "brained",
        },
      },
    ],
  });
  const countResultPromise = prisma.pageView.aggregateRaw({
    pipeline: [
      { $match: { userId: { $oid: userId } } },
      groupStory,
      { $count: "count" },
    ],
  });
  const [paginatedResult, countResult] = await Promise.all([
    paginatedResultPromise,
    countResultPromise,
  ]);
  return {
    paginatedResult: (
      paginatedResult as unknown as aggregateResponeAnchorType[]
    ).map(
      ({
        lastReadTime,
        storyInfo,
        contributorsName,
        bookmarked,
        brained,
        contributorsId,
      }) => {
        return {
          lastRead: lastReadTime.$date,
          id: storyInfo[0]._id.$oid,
          storyTitle: storyInfo[0].title,
          storySlug: storyInfo[0].slug,
          storySummary: storyInfo[0].summary,
          storyThumbnailUrl: storyInfo[0].thumbnailUrl,
          articlePublish: storyInfo[0].articlePublish.$date,
          contributors: contributorsName.map((contributor, index) => ({
            id: contributor._id.$oid,
            firstName: contributor.firstName,
            lastName: contributor.lastName,
            type: contributorsId[index].contributionType,
          })),
          bookmarked: bookmarked.length !== 0,
          brained: brained.length !== 0,
        };
      },
    ),
    countResult: (countResult as unknown as aggregateResponeCountType)[0].count,
    maxPage: Math.ceil(
      (countResult as unknown as aggregateResponeCountType)[0].count / limit,
    ),
  };
}
