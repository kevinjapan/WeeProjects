
export default function truncate(str,len) {
  if(str !== null && str !== "" && str.length > len) {
    return str.substring(0, len) + '..';
  }
  return str
}


// we gen slug from title - may hold legit chars we can't use in the slug
export const generate_slug = src => {
   // order is important
   return src.replace(/\?/g,'').trim().replace(/ /g,'-')
}
