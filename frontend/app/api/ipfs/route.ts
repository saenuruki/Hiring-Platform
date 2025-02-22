import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";
import type { NextApiRequest } from "next";

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

export async function GET(req: NextApiRequest) {
  // const { id } = req.query;
  console.log(req);

  return NextResponse.json({ error: "Test" }, { status: 200 });

  // if (typeof id !== "string") {
  //   return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  // }

  // try {
  //   const res = await fetch(`https://gateway.ipfs.io/ipfs/${id}`);
  //   const data = await res.json();
  //   return NextResponse.json(data, { status: 200 });
  // } catch (e) {
  //   console.log(e);
  //   return NextResponse.json(
  //     { error: "Internal Server Error" },
  //     { status: 500 }
  //   );
  // }
}
