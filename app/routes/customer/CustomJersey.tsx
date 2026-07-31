import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { CustomJerseyDesktop } from "~/features/customer/custom-jersey/CustomJerseyDesktop";
import { CustomJerseyMobile } from "~/features/customer/custom-jersey/CustomJerseyMobile";

export default function CustomJerseyRoute() {
  const { isMobile } = useOutletContext<ContextType>();
  return isMobile ? (
    <CustomJerseyMobile title="Custom Jersey" />
  ) : (
    <CustomJerseyDesktop title="Custom Jersey" />
  );
}

export function meta() {
  return [
    { title: "Custom Jersey - FCSV" },
    { name: "description", content: "Buat jersey custom Anda sendiri di FCSV" },
  ];
}
