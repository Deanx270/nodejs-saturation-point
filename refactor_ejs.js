const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'views');
const files = fs.readdirSync(viewsDir).filter(f => f.endsWith('.ejs'));

const headRegex = /<head>[\s\S]*?<\/head>/;
const headerRegex = /<nav class="navbar-sticky"[^>]*>[\s\S]*?<\/nav>/;
const adminSubnavRegex = /<div class="admin-subnav">[\s\S]*?<\/div>\s*<\/div>/; // Note the nested container div
const footerRegex = /<footer class="footer">[\s\S]*?<\/footer>/;
const scriptsRegex = /<script src="https:\/\/code\.jquery\.com\/jquery[\s\S]*?(?=<\/body>)/;

files.forEach(file => {
  let content = fs.readFileSync(path.join(viewsDir, file), 'utf-8');
  
  content = content.replace(headRegex, `<head>\n  <%- include('partials/head') %>\n</head>`);
  content = content.replace(headerRegex, `<%- include('partials/header') %>`);
  
  // Admin subnav only in admin files
  if (file.startsWith('admin-')) {
    // The regex for admin-subnav might be tricky due to nesting, let's be careful.
    // It's `<div class="admin-subnav"> ... </div>` where the inner div is closed, then outer.
    const subnavRegex = /<div class="admin-subnav">[\s\S]*?<\/div>\s*<\/div>/;
    content = content.replace(subnavRegex, `<%- include('partials/admin-subnav') %>`);
  }

  content = content.replace(footerRegex, `<%- include('partials/footer') %>`);
  
  // Scripts
  // For scripts, we replace everything from `<script src="https://code.jquery.com` to just before `</body>`
  // Wait, some pages have custom scripts!
  // Like auth.js and inline scripts.
  // We should ONLY replace the global script tags.
});
