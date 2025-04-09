import type { Community } from "@/lib/data/communities";

export function formatSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatLocation(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getCommunityPath(community: Community): string {
  const stateSlug = formatLocation(community.state);
  const citySlug = formatLocation(community.city);
  const nameSlug = formatSlug(community.name);
  
  return `/community/${stateSlug}/${citySlug}/${nameSlug}`;
} 