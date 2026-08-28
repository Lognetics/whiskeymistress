import { MenuScreen } from "@/components/admin/MenuScreen";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  return (
    <MenuScreen
      title="Menu"
      description="Every item guests can order — bottle service, grills, cocktails, beverages and puffs. Prices and availability update the site immediately."
    />
  );
}
