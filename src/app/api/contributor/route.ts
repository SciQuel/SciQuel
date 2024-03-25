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