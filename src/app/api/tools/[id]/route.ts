import { NextRequest, NextResponse } from "next/server";
import { deleteTool } from "@/lib/tools";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Tool id is required" }, { status: 400 });
  }

  const { success, error } = await deleteTool(id);
  if (!success) {
    return NextResponse.json({ error: error ?? "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
