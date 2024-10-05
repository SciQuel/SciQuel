import { NextRequest, NextResponse } from "next/server";
import { lockPreQuiz } from "../grade/tools";

export async function GET(req: NextRequest) {
  try {
    lockPreQuiz("6615de2dff8288fc265e4bad", "6488c6f6f5f617c772f6f61a");
    return new NextResponse(
      JSON.stringify({
        message: "Test complete",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
