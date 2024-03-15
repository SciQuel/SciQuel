import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

/**
 * one api for every single story a contributor has worked on sorted by time (given the user id)
 * one api for the same thing, but for stories that have been staff picked
 * I'll do do a single api that determines if we should do staff picked based on input
 * 
 * example url: http://localhost:3000/api/contributor?userId=647ad6fda9efff3abe83044f&staffPick=True
 * Parameter: userId(id), staffPick(string: "True" | "False")
 * return: all contributions by the userId ordered in descending order by story creation date
 */

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");
        const staffPick: "True" | "False" = url.searchParams.get("staffPick") as "True" | "False";
        if (staffPick !== 'True' && staffPick !== "False") {
            throw new Error("Invalid staffPick parameter");
        }
        const isStaffPick = (staffPick === "True");
        let contributions = null
        if (isStaffPick){
            contributions = await prisma.storyContribution.findMany({
                where: {
                    userId: userId as string,
                    story: {
                        staffPick: true,
                    },
                },
                orderBy: {  
                    story: {
                        createdAt: "desc",
                    },
                },
            });
        }else{
            contributions = await prisma.storyContribution.findMany({
                where: {
                    userId: userId as string,
                },
                orderBy: {
                    story: {
                        createdAt: "desc",
                    },
                },
            });
        }
        return NextResponse.json({ contributions });
    } catch (e: unknown) {
        if (e instanceof Error) {
            return NextResponse.json({ error: e.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
        }
    }
}
// export async function GET(req: NextRequest) {
//   try {
//     // 获取所有contributions并包括相关的user和story信息
//     const contributions = await prisma.storyContribution.findMany({
//       include: {
//         user: true,
//         story: true,
//       },
//     });

//     // 将contributions映射到contributors，并包含最新的story信息
//     const contributorsWithLatestStory = contributions.map((contribution) => ({
//       contributor: contribution.user,
//       latestStory: contribution.story,
//     }));

//     // 对contributors根据最新故事的updateDate以及staffPick进行排序
//     contributorsWithLatestStory.sort((a, b) => {
//       // 按故事的更新日期降序排序
//       const dateComparison =
//         b.latestStory.updatedAt.getTime() - a.latestStory.updatedAt.getTime();
//       if (dateComparison !== 0) return dateComparison;

//       // 如果更新日期相同，按staffPick排序
//       return b.latestStory.staffPick === a.latestStory.staffPick
//         ? 0
//         : b.latestStory.staffPick
//         ? -1
//         : 1;
//     });

//     // 提取排序后的contributors信息
//     const sortedContributors = contributorsWithLatestStory.map(
//       (item) => item.contributor,
//     );

//     return NextResponse.json({ contributors: sortedContributors });
//   } catch (e) {
//     return NextResponse.json({ error: "Server Error" }, { status: 500 });
//   }
// }

/*

export async function GET(req: NextRequest) {
    try {
        // 获取所有contributions并包括相关的contributor和story信息
        const contributions = await prisma.contribution.findMany({
            include: {
                contributor: true, // 确保有一个反向关联到Contributor的链接
                story: true,
            },
        });

        // 将contributions映射到contributors，并保留最新的story信息
        let contributorsMap = new Map();
        contributions.forEach(contribution => {
            let contributor = contributorsMap.get(contribution.contributorId) || {
                ...contribution.contributor,
                latestStory: null,
            };

            if (!contributor.latestStory || contributor.latestStory.updatedAt < contribution.story.updatedAt) {
                contributor.latestStory = contribution.story;
            }

            contributorsMap.set(contribution.contributorId, contributor);
        });

        let sortedContributors = Array.from(contributorsMap.values()).sort((a, b) => {
            // 首先按故事的更新日期降序排序
            const dateComparison = b.latestStory.updatedAt.getTime() - a.latestStory.updatedAt.getTime();
            if (dateComparison !== 0) return dateComparison;

            // 如果更新日期相同，按staffPick排序
            return (b.latestStory.staffPick === a.latestStory.staffPick) ? 0 : b.latestStory.staffPick ? -1 : 1;
        });

        return NextResponse.json({ contributors: sortedContributors });
    } catch (e) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

*/
