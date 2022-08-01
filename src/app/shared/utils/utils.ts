export const waitMs = async (timeMs: number): Promise<void> => {
  await new Promise((r, j) => setTimeout(() => r(j), timeMs));
};
