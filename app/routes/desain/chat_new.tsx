import { useOutletContext } from "react-router";
import { ChatDesktop, ChatMobile } from "~/features/admin/chat";

export function meta() {
  return [
    { title: "Chat Designer - FCSV Sistem" },
    { name: "description", content: "Chat with Customer and Team." },
  ];
}

export default function ChatPage() {
  const { isMobile } = useOutletContext<{ isMobile: boolean }>();
  return isMobile ? <ChatMobile title="Chat Designer" /> : <ChatDesktop title="Chat Designer" />;
}
