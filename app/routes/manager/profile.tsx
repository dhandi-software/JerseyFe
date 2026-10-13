import { useOutletContext } from "react-router";
import { SharedProfileDesktop, SharedProfileMobile } from "~/features/shared/profile";

export default function ManagerProfileRoute() {
  const { isMobile } = useOutletContext<{ isMobile: boolean }>();
  return isMobile ? <SharedProfileMobile /> : <SharedProfileDesktop />;
}
