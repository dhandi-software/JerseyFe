import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { EditAccountDesktop, EditAccountMobile } from "~/features/manager/users";

export default function ManagerEditAccountRoute() {
  const { isMobile } = useOutletContext<ContextType>();
  return isMobile ? <EditAccountMobile /> : <EditAccountDesktop />;
}
