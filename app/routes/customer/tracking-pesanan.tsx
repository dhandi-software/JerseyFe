import { TrackingPesananDesktop, TrackingPesananMobile } from "~/features/customer/tracking";

export default function TrackingPesananRoute() {
  return (
    <>
      <div className="block md:hidden w-full">
        <TrackingPesananMobile />
      </div>
      <div className="hidden md:block w-full">
        <TrackingPesananDesktop />
      </div>
    </>
  );
}
