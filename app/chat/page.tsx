import { redirect } from "next/navigation";

/** The chat moved from /chat to the root, and then to /ask. Kept so old links survive. */
export default function ChatPage() {
    redirect("/ask");
}
