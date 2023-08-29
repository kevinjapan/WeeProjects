
export default function truncate(str,len,trailing = true) {
   if(str) {
   if(str !== "" && str.length > len) {
      return trailing ? str.substring(0, len) + '..' : str.substring(0, len) 
      }
   }
   return str
}


// we gen slug from title - may hold legit chars we can't use in the slug
export const generate_slug = src => {
   // order is important
   return src.replace(/\?/g,'').trim().replace(/ /g,'-')
}
