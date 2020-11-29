export const EMAIL_REGEX_PATTER = /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(universidad.edu)\.ec$/;

export function fixYear (unparsedYear: string): number {
  let fixedYear = '';
  if (unparsedYear.length === 1) {
    fixedYear = '200' + unparsedYear;
  }
  if (unparsedYear.length === 2) {
    fixedYear = '20' + unparsedYear;
  }

  return Number(fixedYear);
}