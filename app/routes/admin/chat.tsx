import { ChatDesktop, ChatMobile } from "~/features/admin/chat";
import { useEffect, useState } from "react";
import type { Route } from "./+types/chat";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chat - FSCV Sistem" },
    { name: "description", content: "Chat with Customer and Desain." },
  ];
}

export default function ChatPage() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    if (isMobile) {
        return <ChatMobile title="Chat" />;
    }

    return <ChatDesktop title="Chat" />;
}
