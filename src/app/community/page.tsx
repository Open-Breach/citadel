import { StillToCome, stillToComeMetadata } from "@/components/shell/still-to-come";

// The Community page is built in a later round.
export const metadata = stillToComeMetadata("Community");

export default function Page() {
  return <StillToCome name="Community" />;
}
