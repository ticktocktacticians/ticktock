export function truncate(str: string, maxlength: number = 30) {
  return (str.length > maxlength) ?
    str.slice(0, maxlength - 1) + ' ...' : str;
}
