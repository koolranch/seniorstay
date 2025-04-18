export const parseServices = (servicesData: string | string[] | null | undefined): string[] => {
  if (Array.isArray(servicesData)) {
    // Already an array of strings (hopefully)
    return servicesData.filter((item): item is string => typeof item === 'string');
  }
  if (typeof servicesData === 'string') {
    try {
      // Attempt to parse if it's a JSON string array
      const parsed = JSON.parse(servicesData);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string');
      }
    } catch (e) {
      // If parsing fails or it wasn't JSON, treat as comma-separated
      return servicesData.split(',').map(s => s.trim()).filter(Boolean);
    }
    // If it was a string but not valid JSON array, treat as comma-separated
    return servicesData.split(',').map(s => s.trim()).filter(Boolean);
  }
  return []; // Return empty array if null, undefined, or unexpected type
};

export const deriveCommunityType = (
  description: string | null | undefined,
  services: string | null | undefined
): string => {
  const combinedText = `${description || ''} ${services || ''}`.toLowerCase();

  if (combinedText.includes('memory care')) {
    return 'Memory Care';
  }
  if (combinedText.includes('assisted living')) {
    return 'Assisted Living';
  }
  if (combinedText.includes('independent living')) {
    return 'Independent Living';
  }
  if (combinedText.includes('skilled nursing')) {
    return 'Skilled Nursing';
  }
  // Add more specific types if needed
  
  return 'Senior Living'; // Default fallback
}; 