import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { SharedProfileDesktop } from "./SharedProfileDesktop";
import { SharedProfileMobile } from "./SharedProfileMobile";

export function SharedProfile() {
  const { isMobile } = useOutletContext<ContextType>();
  return isMobile ? <SharedProfileMobile /> : <SharedProfileDesktop />;
}
