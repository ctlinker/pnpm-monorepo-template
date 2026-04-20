const fs = require('node:fs');
const path = require('node:path');

const pkgBaseDir = path.resolve(__dirname, '..', '..', 'packages');
const docsBaseDir = path.resolve(__dirname, '..', 'packages');

/**
 * Recursively copy a directory or file.
 * Uses fs.cpSync which is available in Node.js 16.7.0+.
 */
function copyRecursiveSync(src, dest) {
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true, force: true });
  }
}

function sync() {
  if (!fs.existsSync(pkgBaseDir)) return;
  if (!fs.existsSync(docsBaseDir))
    fs.mkdirSync(docsBaseDir, { recursive: true });

  const pkgs = fs
    .readdirSync(pkgBaseDir)
    .filter((f) => fs.statSync(path.join(pkgBaseDir, f)).isDirectory());

  for (const pkg of pkgs) {
    const pkgPath = path.join(pkgBaseDir, pkg);
    const srcDir = path.join(pkgPath, 'src');

    if (fs.existsSync(srcDir)) {
      const versions = fs
        .readdirSync(srcDir)
        .filter(
          (v) =>
            fs.statSync(path.join(srcDir, v)).isDirectory() && v !== 'latest',
        )
        .sort((a, b) =>
          b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }),
        );

      if (versions.length > 0) {
        // Sync each version
        for (const version of versions) {
          const versionSrcDir = path.join(srcDir, version);
          const targetDir = path.join(docsBaseDir, pkg, 'src', version);

          // Ensure target directory exists and is clean
          if (fs.existsSync(targetDir)) {
            fs.rmSync(targetDir, { recursive: true, force: true });
          }
          fs.mkdirSync(targetDir, { recursive: true });

          // 1. Copy everything from the versioned source directory
          copyRecursiveSync(versionSrcDir, targetDir);

          // 2. Sync root README.md to index.md (acts as the main landing page for the version)
          const readmePath = path.join(pkgPath, 'README.md');
          if (fs.existsSync(readmePath)) {
            fs.copyFileSync(readmePath, path.join(targetDir, 'index.md'));
          }

          // 3. Sync root CHANGELOG.md to changelog.md
          const changelogPath = path.join(pkgPath, 'CHANGELOG.md');
          if (fs.existsSync(changelogPath)) {
            fs.copyFileSync(
              changelogPath,
              path.join(targetDir, 'changelog.md'),
            );
          }
        }

        // Handle symlink for 'latest' (pointing to the characteristically highest version)
        const latestVer = versions[0];
        const latestLink = path.join(docsBaseDir, pkg, 'src', 'latest');
        try {
          if (fs.existsSync(latestLink)) {
            // Check if it's a symlink; if so, unlink it
            const stats = fs.lstatSync(latestLink);
            if (stats.isSymbolicLink()) {
              fs.unlinkSync(latestLink);
            } else {
              // If it's a directory (legacy behavior), remove it
              fs.rmSync(latestLink, { recursive: true, force: true });
            }
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
