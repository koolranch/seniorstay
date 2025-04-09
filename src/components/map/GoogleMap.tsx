"use client";

import { useEffect, useRef, useState } from "react";
import { GoogleMap as GoogleMapComponent, LoadScript, Marker } from '@react-google-maps/api';

interface Location {
  lat: number;
  lng: number;
}

interface Marker {
  id: number;
  position: Location;
  title: string;
  link: string;
}

interface GoogleMapProps {
  markers: Marker[];
  location?: Location;
  zoom?: number;
}

export default function GoogleMap({ markers, location, zoom = 12 }: GoogleMapProps) {
  // Use the first marker as the center location if no location provided
  const centerLocation = location || (markers && markers.length > 0 ? markers[0].position : { lat: 40.7128, lng: -74.0060 });

  const mapContainerStyle = {
    width: '100%',
    height: '100%'
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMapComponent
        mapContainerStyle={mapContainerStyle}
        center={centerLocation}
        zoom={zoom}
        options={{
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ],
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            title={marker.title}
            label={{
              text: marker.title,
              className: "map-marker-label"
            }}
          />
        ))}
      </GoogleMapComponent>
    </LoadScript>
  );
}
