export interface HasId {
  id: number;
}

/**
 * Base interface to use in models that have id.
 */
export interface HasId {
  id: number;
}

/**
 * Base interface to use in models that have id and geometry.
 */
export interface GeometricEntity extends HasId {
  geojson?: string;
}

/**
 * Base interface that expands the GeometricEntity.
 */
export interface PetroGeobaseEntity extends GeometricEntity {
  well_types?: number[];
  well_count?: number;
  blocks_count?: number;
  fields_count?: number;
  seismic_projects_count?: number;
}

/**
 * Base interface to use in models that have id.
 */
export interface PointEntity extends HasId {
  lat?: number;
  long?: number;
}
