import { useOutletContext } from "react-router";
import { ChatDesktop, ChatMobile } from "~/features/admin/chat";

export function meta() {
  return [
    { title: "Chat - FCSV Sistem" },
    { name: "description", content: "Chat with Customer and Desain." },
  ];
}

export default function ChatPage() {
  const { isMobile } = useOutletContext<{ isMobile: boolean }>();
  return isMobile ? <ChatMobile title="Chat" /> : <ChatDesktop title="Chat" />;
}
