import { useOutletContext } from "react-router";
import { CreateAccountDesktop, CreateAccountMobile } from "~/features/admin/create-account";

export default function ManagerCreateAccountRoute() {
  const { isMobile } = useOutletContext<{ isMobile: boolean }>();
  return isMobile ? <CreateAccountMobile /> : <CreateAccountDesktop />;
}
