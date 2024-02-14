import { NextResponse, type NextRequest } from "next/server";

export function POST(req: NextRequest) {
  try {
    // 假设你能从请求中解析出所需的数据
    const quizData = {
      /* 你的处理逻辑 */
    };

    // 使用 NextResponse 创建 JSON 响应
    return new NextResponse(
      JSON.stringify({ message: "Quiz received", quizData }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("处理请求时出错:", error);
    return new NextResponse(JSON.stringify({ error: "内部服务器错误" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
