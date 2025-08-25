export function toPermissionPayload(flat: string[]) {
  const map: Record<string, Set<string>> = {};
  for (const item of flat) {
    const [entityType, action] = item.split(":");
    if (!entityType || !action) continue;
    const entity = entityType.toUpperCase();
    const act = action.toUpperCase();          
    if (!map[entity]) map[entity] = new Set();
    map[entity].add(act);
  }
  return Object.entries(map).map(([entityType, actions]) => ({
    entityType,
    actionTypes: Array.from(actions),
  }));
}
