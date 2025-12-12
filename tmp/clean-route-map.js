const fs = require('fs');
const path = require('path');

const routeMapPath = path.join(__dirname, '../scripts/route-map.json');
const data = JSON.parse(fs.readFileSync(routeMapPath, 'utf8'));

// Filter out admin entries from links
const originalLinksCount = data.links.length;
data.links = data.links.filter(link => {
  return !link.file.includes('admin/') && !link.file.includes('Admin');
});

const removedLinks = originalLinksCount - data.links.length;

// Filter admin routes if any exist
const originalRoutesCount = data.routes.length;
data.routes = data.routes.filter(route => {
  return !route.path.includes('admin');
});

const removedRoutes = originalRoutesCount - data.routes.length;

fs.writeFileSync(routeMapPath, JSON.stringify(data, null, 2));
console.log(`✓ Cleaned route-map.json:`);
console.log(`  - Removed ${removedLinks} admin link(s), ${data.links.length} links remain`);
console.log(`  - Removed ${removedRoutes} admin route(s), ${data.routes.length} routes remain`);
