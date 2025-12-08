/**
 * Feature flag utility for managing application feature toggles.
 *
 * @module featureFlags
 *
 * @example
 * // Check if a feature is enabled
 * if (isFeatureEnabled('darkMode')) {
 *   // Enable dark mode
 * }
 *
 * @example
 * // Enable a feature flag
 * setFeatureFlag('betaFeature', true);
 *
 * @example
 * // Access all feature flags
 * console.log(FEATURE_FLAGS);
 *
 * @typedef {Object} FEATURE_FLAGS
 * @property {boolean} newDashboard - Flag for the new dashboard feature.
 * @property {boolean} betaFeature - Flag for beta features.
 * @property {boolean} darkMode - Flag for dark mode.
 *
 * @function isFeatureEnabled
 * @param {string} flag - The name of the feature flag to check.
 * @returns {boolean} Whether the feature is enabled.
 *
 * @function setFeatureFlag
 * @param {string} flag - The name of the feature flag to set.
 * @param {boolean} value - The value to set for the feature flag.
 */
const FEATURE_FLAGS = {
  newDashboard: false,
  betaFeature: false,
  darkMode: true,
  // Add more flags as needed
};

export function isFeatureEnabled(flag) {
  // In production, you might load flags from environment variables or remote config
  return !!FEATURE_FLAGS[flag];
}

export function setFeatureFlag(flag, value) {
  FEATURE_FLAGS[flag] = !!value;
}

export default {
  isFeatureEnabled,
  setFeatureFlag,
  FEATURE_FLAGS,
};