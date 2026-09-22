export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

// Finish the assembly while the hero is still visible. No extra scroll track.
export function getSceneFrame(scrollOffset, viewportHeight, reduceMotion = false) {
  const progress = reduceMotion ? 1 : clamp(scrollOffset / Math.max(1, viewportHeight * 0.48));
  const eased = 1 - (1 - progress) ** 3;
  const distance = 1 - eased;
  return {
    progress,
    rotateX: 17 * distance,
    rotateY: -23 * distance,
    rotateZ: 6 * distance,
    scale: 0.9 + eased * 0.1,
    spread: distance,
  };
}

export function getEntryFrame(top, viewportHeight, reduceMotion = false) {
  const progress = reduceMotion ? 1 : clamp((viewportHeight - top) / Math.max(1, viewportHeight * 0.6));
  return { rotateX: 9 * (1 - progress), offset: 26 * (1 - progress) };
}

export function getApproachStage(trackTop, stickyTop, distance, count = 3) {
  if (count <= 1) return 0;
  const progress = clamp((stickyTop - trackTop) / Math.max(1, distance));
  return Math.min(count - 1, Math.floor(progress * count));
}
