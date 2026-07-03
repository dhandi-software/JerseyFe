import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { RegisterDesktop, RegisterMobile } from "~/features/register";

export default function Register() {
  const { isMobile } = useOutletContext<ContextType>();
  return isMobile ? <RegisterMobile /> : <RegisterDesktop />;
}
