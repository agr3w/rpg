export function sortByOrderAsc(a, b) {
  return Number(a?.order || 0) - Number(b?.order || 0);
}

export function getMilestonesArray(milestonesObj) {
  const obj = milestonesObj || {};
  return Object.values(obj).filter(Boolean).sort(sortByOrderAsc);
}

export function getTodosArray(todosObj) {
  const obj = todosObj || {};
  return Object.values(obj).filter(Boolean);
}

export function computeFlowProgress(milestonesObj) {
  const milestones = getMilestonesArray(milestonesObj);

  let total = 0;
  let done = 0;

  for (const m of milestones) {
    const todos = getTodosArray(m?.todos);
    total += todos.length;
    done += todos.filter((t) => Boolean(t?.done)).length;
  }

  const pct = total ? Math.round((done / total) * 100) : 0;
  return { total, done, pct };
}