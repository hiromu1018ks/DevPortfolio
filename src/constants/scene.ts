export const DEFAULT_CAMERA_POSITION = [0, 0, 10] as const;
export const FOG_NEAR = 10;
export const FOG_FAR = 30;

export const ANIMATION_SETTINGS = {
  rotationSpeed: {
    slow: 0.1,
    medium: 0.2,
    fast: 0.3,
  },
  mouseInfluence: {
    position: 0.5,
    rotation: 0.1,
  },
  particleCount: {
    low: 100,
    medium: 200,
    high: 500,
  },
} as const;