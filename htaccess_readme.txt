

Refeshing page on build (on my local server) doesn't find the page,
so we use .htaccess file to direct any page not found errors to index.html -
this will push any 404 to index.html and thereby resolve the path inside
react.

ErrorDocument 404 /index.html