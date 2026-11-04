import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { localSakhiReply, type ChatTurn } from "@/lib/sakhi-local-reply";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(4000),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(36),
});

function sanitizeText(s: string): string {
  return s.replace(/\0/g, "").trim().slice(0, 4000);
}

function validateAlternatingUserEnds(messages: ChatTurn[]): boolean {
  if (messages.length === 0) return false;
  if (messages[0].role !== "user") return false;
  if (messages[messages.length - 1].role !== "user") return false;
  for (let i = 0; i < messages.length; i++) {
    const want: "user" | "assistant" = i % 2 === 0 ? "user" : "assistant";
    if (messages[i].role !== want) return false;
  }
  return true;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 422 }
    );
  }

  const { messages } = parsed.data;
  const cleaned: ChatTurn[] = messages.map((m) => ({
    role: m.role,
    content: sanitizeText(m.content),
  }));

  if (!cleaned.every((m) => m.content.length > 0)) {
    return NextResponse.json({ error: "Empty message" }, { status: 422 });
  }

  if (!validateAlternatingUserEnds(cleaned)) {
    return NextResponse.json(
      { error: "Messages must alternate user/assistant and end with user." },
      { status: 422 }
    );
  }

  const reply = localSakhiReply(cleaned);

  return NextResponse.json(
    { reply },
    { headers: { "Cache-Control": "no-store" } }
  );
}
