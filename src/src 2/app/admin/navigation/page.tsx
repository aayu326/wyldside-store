"use client";
import Crud from "@/components/admin/Crud";
import { PageHead, Panel } from "@/components/admin/ui";
import { useStore } from "@/lib/store";
import type { NavItem } from "@/lib/types";

export default function NavigationManager() {
  const { state, set } = useStore();
  return (
    <>
      <PageHead title="Navigation" sub="Menu items in the storefront header. Link a category to show its subcategories in a dropdown." />
      <Panel>
        <Crud<NavItem>
          noun="Menu item" items={state.nav} onChange={(v) => set("nav", v)} reorder search={false}
          blank={{ label: "", href: "/shop", category: "" }}
          fields={[
            { key: "label", label: "Label", required: true },
            { key: "href", label: "Link", required: true, hint: "Internal path such as /shop?cat=gaming, or /about." },
            { key: "category", label: "Dropdown from category", type: "select", options: [{ value: "", label: "None" }, ...state.categories.map((c) => ({ value: c.slug, label: c.name }))], render: (r) => state.categories.find((c) => c.slug === r.category)?.name ?? "None" },
          ]}
        />
      </Panel>
    </>
  );
}
