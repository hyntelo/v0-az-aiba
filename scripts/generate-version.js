const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getBuildNumber() {
  try {
    // Get total commit count as the incremental build number
    const buildNumber = execSync('git rev-list --count HEAD', { encoding: 'utf-8' }).trim();
    
    const versionInfo = {
      buildNumber: parseInt(buildNumber, 10),
    };
    
    // Write to a JSON file
    const outputPath = path.join(__dirname, '../lib/version.json');
    fs.writeFileSync(outputPath, JSON.stringify(versionInfo, null, 2));
    
    console.log(`✓ Build number generated: ${buildNumber}`);
    return versionInfo;
  } catch (error) {
    console.error('Error generating build number:', error.message);
    // Fallback
    const fallback = {
      buildNumber: 0,
    };
    
    const outputPath = path.join(__dirname, '../lib/version.json');
    fs.writeFileSync(outputPath, JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

getBuildNumber();

