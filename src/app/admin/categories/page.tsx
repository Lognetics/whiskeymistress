import { PageHeading } from "@/components/admin/Shell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { EYEBROW_OPTIONS, type FieldDef } from "@/components/admin/fields";
import { saveCategory } from "@/lib/actions/admin";
import { getAllMenuCategories } from "@/lib/content";
import { getAdminAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

const fields: FieldDef[] = [
  {
    name: "eyebrow",
    label: "Eyebrow",
    type: "select",
    required: true,
    options: EYEBROW_OPTIONS,
    defaultValue: "Table Service",
    hint: "Small-caps label printed above the section title.",
  },
  { name: "name", label: "Name", type: "text", required: true },
  {
    name: "slug",
    label: "Slug",
    type: "text",
    required: true,
    placeholder: "bottle-service",
    hint: "Lowercase letters, numbers and hyphens.",
  },
  { name: "sort_order", label: "Sort order", type: "number", min: 0, defaultValue: 0 },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    span: 2,
    placeholder: "Shown under the category name on the site.",
  },
  { name: "is_published", label: "Published", type: "checkbox", defaultValue: true },
];

export default async function CategoriesPage() {
  const [access, categories] = await Promise.all([
    getAdminAccess(),
    getAllMenuCategories(),
  ]);

  return (
    <div>
      <PageHeading
        title="Menu Categories"
        description="The sections of the menu, in the order guests read them. Deleting a category removes its items too."
      />

      <ResourceManager
        title="category"
        table="menu_categories"
        records={categories}
        fields={fields}
        saveAction={saveCategory}
        readOnly={access.mode !== "authorized"}
        addLabel="Add category"
        listConfig={{
          primary: "name",
          secondary: "description",
          badges: ["eyebrow", "is_published"],
        }}
      />
    </div>
  );
}
