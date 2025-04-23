// This file is maintained for backward compatibility
// Import the unified Community type from the central location
import type { Community as CentralCommunity, InternalCommunity as CentralInternalCommunity } from "@/types/community";

// Create type aliases for backward compatibility
export type Community = CentralCommunity;

// Legacy InternalCommunity type for backward compatibility
export interface InternalCommunity extends CentralInternalCommunity {
  // Any additional properties needed for backward compatibility can be added here
} 