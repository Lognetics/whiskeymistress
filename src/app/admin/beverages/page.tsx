import { MenuScreen } from "@/components/admin/MenuScreen";

export const dynamic = "force-dynamic";

export default async function BeverageMenuPage() {
  return (
    <MenuScreen
      kind="beverage"
      title="Beverage Menu"
      description="Cocktails, mocktails, juices, coffee, tea and water — plus any alcoholic listings you choose to publish. Prices and availability update the site immediately."
    />
  );
}
