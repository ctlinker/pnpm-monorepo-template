const fs = require('node:fs');
const path = require('node:path');

const pkgBaseDir = path.resolve(__dirname, '..', '..', 'packages');
const docsBaseDir = path.resolve(__dirname, '..', 'packages');

function sync() {
  if (!fs.existsSync(pkgBaseDir)) return;
  if (!fs.existsSync(docsBaseDir)) fs.mkdirSync(docsBaseDir, { recursive: true });

  const pkgs = fs
    .readdirSync(pkgBaseDir)
    .filter((f) => fs.statSync(path.join(pkgBaseDir, f)).isDirectory());

  for (const pkg of pkgs) {
    const srcDir = path.join(pkgBaseDir, pkg, 'src');
    if (fs.existsSync(srcDir)) {
      const versions = fs
        .readdirSync(srcDir)
        .filter((v) => fs.statSync(path.join(srcDir, v)).isDirectory() && v !== 'latest')
        .sort((a, b) =>
          b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }),
        );

      if (versions.length > 0) {
        const latestVer = versions[0];
        const latestVerDir = path.join(srcDir, latestVer);
        
        // Ensure docs/packages/<pkg>/src/<version> exists
        const targetDir = path.join(docsBaseDir, pkg, 'src', latestVer);
        fs.mkdirSync(targetDir, { recursive: true });

        // Sync README.md to index.md
        const readmePath = path.join(pkgBaseDir, pkg, 'README.md');
        if (fs.existsSync(readmePath)) {
          fs.copyFileSync(readmePath, path.join(targetDir, 'index.md'));
        }

        // Sync CHANGELOG.md to changelog.md
        const changelogPath = path.join(pkgBaseDir, pkg, 'CHANGELOG.md');
        if (fs.existsSync(changelogPath)) {
          fs.copyFileSync(changelogPath, path.join(targetDir, 'changelog.md'));
        }

        // Handle symlink for latest
        const latestLink = path.join(docsBaseDir, pkg, 'src', 'latest');
        try {
          if (fs.existsSync(latestLink)) {
            fs.unlinkSync(latestLink);
          }
          fs.symlinkSync(latestVer, latestLink, 'dir');
        } catch (err) {
          console.error(`Failed to sync ${pkg} latest link:`, err.message);
        }
      }
    }
  }
}

sync();
