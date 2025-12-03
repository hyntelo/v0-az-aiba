const fs = require('fs');
const path = require('path');

function incrementBuildNumber() {
  const versionFilePath = path.join(__dirname, '../lib/version.json');
  
  // Read current version
  let versionInfo = { buildNumber: 0 };
  try {
    if (fs.existsSync(versionFilePath)) {
      const content = fs.readFileSync(versionFilePath, 'utf-8');
      versionInfo = JSON.parse(content);
    }
  } catch (error) {
    console.warn('Could not read existing version file, starting from 0');
  }
  
  // Increment build number
  versionInfo.buildNumber = (versionInfo.buildNumber || 0) + 1;
  
  // Write back to file
  fs.writeFileSync(versionFilePath, JSON.stringify(versionInfo, null, 2));
  
  console.log(`✓ Build number incremented to: ${versionInfo.buildNumber}`);
  return versionInfo;
}

incrementBuildNumber();
