import { useOutletContext } from "react-router";
import { ContactDesktop, ContactMobile } from "~/features/landing/contact";

export default function ContactRoute() {
  const { isMobile } = useOutletContext<{ isMobile: boolean }>();
  return isMobile ? <ContactMobile /> : <ContactDesktop />;
}
