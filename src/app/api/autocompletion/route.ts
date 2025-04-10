import { autoCompleteTask } from "@/services/externalDataService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || !body.title) {
      return NextResponse.json(
        {
          message:
            "Invalid request body: missing required fields (title, description)",
        },
        { status: 400 }
      );
    }

    const res = await autoCompleteTask(body);
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching data from GPT: " + error },
      { status: 503 }
    );
  }
}
