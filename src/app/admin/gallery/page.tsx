import { PageHeading } from "@/components/admin/Shell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import type { FieldDef } from "@/components/admin/fields";
import { saveGalleryImage } from "@/lib/actions/admin";
import { getAllGallery } from "@/lib/content";
import { getAdminAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

const fields: FieldDef[] = [
  {
    name: "image_url",
    label: "Image URL",
    type: "url",
    required: true,
    span: 2,
    placeholder: "https://…",
    hint: "Upload to Supabase Storage (bucket: media) and paste the public URL.",
  },
  {
    name: "alt",
    label: "Alt text",
    type: "text",
    required: true,
    span: 2,
    hint: "Describe the photo for screen readers and search engines.",
  },
  {
    name: "category",
    label: "Category",
    type: "text",
    required: true,
    placeholder: "Interior",
    hint: "Becomes a filter chip in the gallery.",
  },
  { name: "sort_order", label: "Sort order", type: "number", min: 0, defaultValue: 0 },
  { name: "width", label: "Width (px)", type: "number", min: 1, defaultValue: 1400 },
  { name: "height", label: "Height (px)", type: "number", min: 1, defaultValue: 933 },
  { name: "is_published", label: "Published", type: "checkbox", defaultValue: true },
];

export default async function GalleryPage() {
  const [access, images] = await Promise.all([getAdminAccess(), getAllGallery()]);

  return (
    <div>
      <PageHeading
        title="Gallery"
        description="Interiors, dining, lounge, entertainment and events. Categories become the filter chips guests use."
      />

      <ResourceManager
        title="image"
        table="gallery_images"
        records={images}
        fields={fields}
        saveAction={saveGalleryImage}
        readOnly={access.mode !== "authorized"}
        addLabel="Add image"
        listConfig={{
          primary: "alt",
          secondary: "category",
          image: "image_url",
          badges: ["is_published"],
        }}
      />
    </div>
  );
}
