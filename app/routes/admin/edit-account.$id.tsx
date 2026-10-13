import { useOutletContext } from "react-router";
import { EditAccountDesktop, EditAccountMobile } from "~/features/admin/users";

export default function EditAccountPage() {
  const { isMobile } = useOutletContext<{ isMobile: boolean }>();
  return isMobile ? <EditAccountMobile /> : <EditAccountDesktop />;
}
