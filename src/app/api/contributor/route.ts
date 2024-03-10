import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { type StoryContribution, ContributionType } from "@prisma/client";
import { getContributionSchema } from "./schema";

export async function GET(req: NextRequest) {
    try {
        // 获取所有contributions并包括相关的user和story信息
        const contributions = await prisma.storyContribution.findMany({
            include: {
                user: true,
                story: true,
            },
        });

        // 将contributions映射到contributors，并包含最新的story信息
        const contributorsWithLatestStory = contributions.map(contribution => ({
            contributor: contribution.user,
            latestStory: contribution.story,
        }));

        // 对contributors根据最新故事的updateDate以及staffPick进行排序
        contributorsWithLatestStory.sort((a, b) => {
            // 按故事的更新日期降序排序
            const dateComparison = b.latestStory.updatedAt.getTime() - a.latestStory.updatedAt.getTime();
            if (dateComparison !== 0) return dateComparison;

            // 如果更新日期相同，按staffPick排序
            return (b.latestStory.staffPick === a.latestStory.staffPick) ? 0 : b.latestStory.staffPick ? -1 : 1;
        });

        // 提取排序后的contributors信息
        const sortedContributors = contributorsWithLatestStory.map(item => item.contributor);

        return NextResponse.json({ contributors: sortedContributors });
    } catch (e) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

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