import Link from "next/link";
import { Panel, PanelHeader, PanelRow } from "@/components/ui/panel";

export default function NotFoundPage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-20 pt-14 sm:px-6">
      <Panel>
        <PanelHeader label="404" title="Page not found" description="The resource does not exist or moved." />
        <PanelRow>
          <Link href="/" className="text-sm text-accent hover:text-fg">
            Return to home
          </Link>
        </PanelRow>
      </Panel>
    </div>
  );
}
