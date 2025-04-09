"use client";

import { useEffect, useState } from "react";
import MobileActionBar from "@/components/MobileActionBar";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function ClientBody({
  children
}: {
  children: React.ReactNode
}) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [paddingBottom, setPaddingBottom] = useState('0px');

  // Add padding to the bottom of the body when the mobile action bar is visible
  useEffect(() => {
    if (isMobile) {
      // 68px is the approximate height of the action bar (4rem + border)
      setPaddingBottom('68px');
    } else {
      setPaddingBottom('0px');
    }
  }, [isMobile]);

  return (
    <>
      <div style={{ paddingBottom }}>
        {children}
      </div>
      <MobileActionBar />
    </>
  );
}
