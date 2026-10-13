import { useOutletContext } from "react-router";
import { CustomJerseyDetailDesktop } from "~/features/customer/custom-jersey/CustomJerseyDetailDesktop";
import { CustomJerseyDetailMobile } from "~/features/customer/custom-jersey/CustomJerseyDetailMobile";

export default function CustomJerseyDetailRoute() {
  const { isMobile } = useOutletContext<{ isMobile: boolean }>();
  return isMobile ? <CustomJerseyDetailMobile /> : <CustomJerseyDetailDesktop />;
}
