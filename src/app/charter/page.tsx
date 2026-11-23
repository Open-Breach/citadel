import { StillToCome, stillToComeMetadata } from "@/components/shell/still-to-come";

// The Charter page is built in a later round.
export const metadata = stillToComeMetadata("Charter");

export default function Page() {
  return <StillToCome name="Charter" />;
}
