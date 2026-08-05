import { MenuScreen } from "@/components/admin/MenuScreen";

export const dynamic = "force-dynamic";

export default async function FoodMenuPage() {
  return (
    <MenuScreen
      kind="food"
      title="Food Menu"
      description="Dishes, prices and availability. Anything published here appears in the Dining section of the site."
    />
  );
}
