import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";
import type { NextApiRequest } from "next";

export async function GET(req: NextApiRequest, { params }) {
  const { id } = params;

  if (typeof id !== "string") {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://gateway.ipfs.io/ipfs/${id}`);
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
