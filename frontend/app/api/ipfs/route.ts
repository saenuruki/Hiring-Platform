import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();

    const json = {
      title: data.get("title") as string,
      description: data.get("description") as string,
      goals: data.get("goals") as string,
      skills: data.get("skills") as string,
    };

    const res = await pinata.upload.json(json);
    return NextResponse.json({ hash: res.IpfsHash }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
