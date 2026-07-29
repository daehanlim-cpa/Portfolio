import { redirect } from "next/navigation";

/** The chat now lives at the root. Kept so existing links and shares survive. */
export default function ChatPage() {
    redirect("/");
}
