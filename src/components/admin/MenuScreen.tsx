import { PageHeading } from "@/components/admin/Shell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { AVAILABILITY_OPTIONS, type FieldDef } from "@/components/admin/fields";
import { saveMenuItem } from "@/lib/actions/admin";
import { getAllMenuCategories, getAllMenuItems } from "@/lib/content";
import { getAdminAccess } from "@/lib/auth";

/** The single menu screen — every category and item, in menu order. */
export async function MenuScreen({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [access, categories, items] = await Promise.all([
    getAdminAccess(),
    getAllMenuCategories(),
    getAllMenuItems(),
  ]);

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const fields: FieldDef[] = [
    {
      name: "category_id",
      label: "Category",
      type: "select",
      required: true,
      options: categoryOptions,
      span: 2,
    },
    { name: "name", label: "Name", type: "text", required: true, span: 2 },
    {
      name: "group_label",
      label: "Group",
      type: "text",
      placeholder: "Whiskey",
      hint: "Optional sub-heading, e.g. Whiskey / Cognac / Bubbly.",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      span: 2,
      placeholder: "One or two lines describing the dish.",
    },
    {
      name: "price_major",
      label: "Price (₦)",
      type: "price",
      required: true,
      min: 0,
      hint: "Whole naira — stored internally in kobo.",
    },
    { name: "currency", label: "Currency", type: "text", defaultValue: "NGN" },
    {
      name: "image_url",
      label: "Image URL",
      type: "url",
      span: 2,
      placeholder: "https://…",
      hint: "Paste any public image URL, or a Supabase Storage link.",
    },
    {
      name: "availability",
      label: "Availability",
      type: "select",
      required: true,
      options: AVAILABILITY_OPTIONS,
      defaultValue: "available",
    },
    {
      name: "sort_order",
      label: "Sort order",
      type: "number",
      min: 0,
      defaultValue: 0,
    },
    {
      name: "dietary_tags",
      label: "Dietary tags",
      type: "text",
      span: 2,
      placeholder: "vegetarian, spicy, gluten-free",
      hint: "Comma separated.",
    },
    { name: "is_signature", label: "Signature dish", type: "checkbox" },
    {
      name: "is_published",
      label: "Published",
      type: "checkbox",
      defaultValue: true,
    },
  ];

  const categoryName = new Map(categories.map((c) => [c.id, c.name]));
  const records = items.map((item) => ({
    ...item,
    category_name: categoryName.get(item.category_id) ?? "Uncategorised",
  }));

  return (
    <div>
      <PageHeading title={title} description={description} />

      {categoryOptions.length === 0 ? (
        <p className="mb-6 rounded-xl border border-amber-400/25 bg-amber-500/8 px-5 py-4 font-ui text-[0.697rem] text-amber-200">
          Create a category first — every item must belong to one.
        </p>
      ) : null}

      <ResourceManager
        title="item"
        table="menu_items"
        records={records}
        fields={fields}
        saveAction={saveMenuItem}
        readOnly={access.mode !== "authorized"}
        addLabel="Add item"
        emptyLabel="No items yet. Add your first one to see it on the site."
        listConfig={{
          primary: "name",
          secondary: "category_name",
          image: "image_url",
          price: "price_minor",
          badges: ["availability", "is_signature", "is_published"],
        }}
      />
    </div>
  );
}
