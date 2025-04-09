'use client';

import { notFound } from "next/navigation";
import { Community } from "@/lib/data/communities";
import { formatSlug, formatLocation } from "@/lib/utils/formatSlug";
import CommunityClient from "./CommunityClient";

interface CommunityWrapperProps {
  params: {
    state: string;
    city: string;
    slug: string;
  };
  communities: Community[];
}

export default function CommunityWrapper({ params, communities }: CommunityWrapperProps) {
  const community = communities.find(
    (c) =>
      formatLocation(c.state) === params.state &&
      formatLocation(c.city) === params.city &&
      formatSlug(c.name) === params.slug
  );

  if (!community) {
    notFound();
  }

  return <CommunityClient params={params} communities={communities} />;
} 