import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { CreateAccountDesktop } from "~/features/manager/create-account/CreateAccountDesktop";
import { CreateAccountMobile } from "~/features/manager/create-account/CreateAccountMobile";

export default function ManagerCreateAccountRoute() {
  const { isMobile } = useOutletContext<ContextType>();
  return isMobile ? <CreateAccountMobile /> : <CreateAccountDesktop />;
}
