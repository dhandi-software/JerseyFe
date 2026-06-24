import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { UserListDesktop, UserListMobile } from "~/features/manager/users";

export default function ManagerUsersRoute() {
  const { isMobile } = useOutletContext<ContextType>();
  return isMobile ? <UserListMobile /> : <UserListDesktop />;
}
