export const hasMainScreeningProgramItem = (programItems: unknown) =>
  Array.isArray(programItems) &&
  programItems.some((item: any) => item?.type === 'screening' && item?.isMainProgram)
