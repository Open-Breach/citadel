import { Footer } from "@/components/shell/footer";
import { Navigation } from "@/components/shell/navigation";

const target = "https://example.org/support";

/** The navigation and the footer while a support target is configured. */
export default function SupportLinkFixture() {
  return (
    <main id="content" className="pt-36">
      <div data-testid="with-support">
        <div className="px-5">
          <Navigation supportUrl={target} fixed={false} />
        </div>
        <Footer supportUrl={target} />
      </div>
    </main>
  );
}
