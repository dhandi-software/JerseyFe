import { ChatDesktop, ChatMobile } from "~/features/admin/chat";
import { useEffect, useState } from "react";

export function meta() {
  return [
    { title: "Chat Designer - FCSV Sistem" },
    { name: "description", content: "Chat with Customer and Team." },
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
        return <ChatMobile title="Chat Designer" />;
    }

    return <ChatDesktop title="Chat Designer" />;
}
