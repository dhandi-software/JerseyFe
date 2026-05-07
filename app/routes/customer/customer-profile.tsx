import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { ProfileDesktop, ProfileMobile } from "~/features/customer/profile";

export default function CustomerProfile() {
  const { isMobile } = useOutletContext<ContextType>();
  return isMobile ? <ProfileMobile /> : <ProfileDesktop />;
}
