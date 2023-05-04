
export default function truncate(str,len) {
  if(str !== null && str !== "" && str.length > len) {
    return str.substring(0, len) + '..';
  }
  return str
}
