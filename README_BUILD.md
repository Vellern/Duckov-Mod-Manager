# Build Documentation

Complete guide for building and distributing the Duckov Mod Manager Electron application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Commands](#build-commands)
- [Output Locations](#output-locations)
- [Build Process](#build-process)
- [Troubleshooting](#troubleshooting)
- [Bundle Size Expectations](#bundle-size-expectations)
- [Performance Targets](#performance-targets)
- [Advanced Configuration](#advanced-configuration)

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version`

2. **npm** (v9 or higher)
   - Included with Node.js
   - Verify: `npm --version`

3. **Git** (for version control)
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify: `git --version`

### Platform-Specific Requirements

#### Windows
- Windows 7 or higher
- No additional requirements for building Windows executables

#### macOS
- macOS 10.15 (Catalina) or higher
- Xcode Command Line Tools: `xcode-select --install`
- For code signing: Valid Apple Developer account

#### Linux
- Ubuntu 18.04 or higher (or equivalent)
- Required packages:
  ```bash
  sudo apt-get install build-essential libssl-dev
  ```

### Initial Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd duckov-mod-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Verify setup:
   ```bash
   npm run test
   ```

## Build Commands

### Development Builds

#### Web Development Server
```bash
npm run web:dev
```
Starts Vite dev server on http://localhost:3001 with hot module replacement.

#### Electron Development
```bash
npm run electron:dev
```
Builds Electron code and starts the app.

#### Watch Mode
```bash
npm run electron:watch
```
Watches Electron source files and rebuilds automatically.

### Production Builds

#### Standard Build
```bash
npm run build
```
Compiles both web (React) and Electron (TypeScript) code.
- Output: `dist/` and `web/dist/`
- No optimization or verification

#### Production Build with Optimization
```bash
npm run build:prod
```
Builds and optimizes the application:
- Removes test files and fixtures
- Removes source maps (production mode)
- Cleans up node_modules
- Generates build size report

#### Build Verification
```bash
npm run build:verify
```
Verifies build output:
- Checks for required files
- Ensures no test files
- Validates bundle sizes
- Checks for sensitive files

### Distribution Builds

#### All Platforms (Current Platform)
```bash
npm run dist
```
Creates installer for the current platform.

#### Windows
```bash
npm run dist:win
```
Creates Windows installers:
- NSIS installer (x64, ia32)
- Portable executable (x64)

#### macOS
```bash
npm run dist:mac
```
Creates macOS distributables:
- DMG installer
- ZIP archive

#### Linux
```bash
npm run dist:linux
```
Creates Linux packages:
- AppImage (universal)
- Debian package (.deb)
- RPM package (.rpm)

#### All Platforms (Cross-platform)
```bash
npm run dist:all
```
Builds for Windows, macOS, and Linux.
Note: Cross-platform builds may have limitations.

#### Directory Build (No Installer)
```bash
npm run dist:dir
```
Creates unpacked directory without installer.
Useful for testing before creating distributables.

### Utility Commands

#### Clean Build Artifacts
```bash
npm run clean
```
Removes:
- `dist/`
- `web/dist/`
- `release/`
- Build reports

#### Clean Everything
```bash
npm run clean:all
```
Removes build artifacts and `node_modules/`.
Run `npm install` after this command.

#### Component Builds
```bash
npm run build:web        # Build React app only
npm run build:electron   # Build Electron code only
```

## Output Locations

### Build Outputs

```
duckov-mod-manager/
├── dist/                      # Compiled Electron code
│   ├── main.js               # Main process entry point
│   ├── preload.js            # Preload script
│   ├── database/             # Database modules
│   ├── services/             # Service modules
│   └── utils/                # Utility modules
│
├── web/dist/                  # Compiled React app
│   ├── index.html            # Entry HTML
│   ├── assets/               # Bundled JS/CSS/images
│   └── ...
│
└── release/                   # Electron-builder output
    ├── win-unpacked/         # Windows unpacked (for testing)
    ├── mac/                  # macOS unpacked
    ├── linux-unpacked/       # Linux unpacked
    ├── *.exe                 # Windows installers
    ├── *.dmg                 # macOS disk images
    ├── *.AppImage            # Linux AppImages
    ├── *.deb                 # Debian packages
    └── *.rpm                 # RPM packages
```

### Build Reports

```
duckov-mod-manager/
├── build-report.json          # Size and optimization report
└── verification-report.json   # Build verification results
```

## Build Process

### Complete Build Workflow

The production build process follows these steps:

1. **Clean Previous Builds** (optional but recommended)
   ```bash
   npm run clean
   ```

2. **Install/Update Dependencies**
   ```bash
   npm install
   ```

3. **Run Tests** (recommended)
   ```bash
   npm run test
   ```

4. **Build Application**
   ```bash
   npm run build:prod
   ```

   This step:
   - Compiles React app with Vite (web/dist/)
   - Compiles Electron TypeScript code (dist/)
   - Removes test files and fixtures
   - Removes source maps in production
   - Cleans up node_modules
   - Generates build-report.json

5. **Verify Build**
   ```bash
   npm run build:verify
   ```

   Checks:
   - Critical files exist
   - No test files in build
   - No source maps (production)
   - No sensitive files
   - Bundle sizes within limits
   - Generates verification-report.json

6. **Create Distributables**
   ```bash
   npm run dist:win    # Windows
   npm run dist:mac    # macOS
   npm run dist:linux  # Linux
   ```

### Quick Production Build

```bash
npm run clean && npm install && npm run test && npm run dist
```

This single command:
1. Cleans previous builds
2. Installs dependencies
3. Runs tests
4. Builds with optimization
5. Verifies build
6. Creates installers

## Troubleshooting

### Common Issues

#### Build Fails with TypeScript Errors

**Problem:** TypeScript compilation errors

**Solution:**
```bash
# Check for type errors
npm run build:electron

# If errors persist, try cleaning
npm run clean
npm install
npm run build
```

#### Missing Dependencies

**Problem:** Module not found errors

**Solution:**
```bash
# Reinstall dependencies
npm run clean:all
npm install

# Rebuild native modules
npm run postinstall
```

#### Electron Builder Fails

**Problem:** electron-builder packaging fails

**Solution:**
```bash
# Clear electron-builder cache
rm -rf node_modules/.cache/electron-builder

# Rebuild
npm run dist:dir  # Test unpacked first
npm run dist      # Then create installer
```

#### Large Bundle Size

**Problem:** Bundle exceeds expected size

**Solution:**
1. Check build-report.json for size breakdown
2. Verify optimization ran: `npm run build:prod`
3. Check for accidentally included files
4. Review vite.config.ts rollup options

#### Source Maps in Production

**Problem:** .map files in production build

**Solution:**
```bash
# Set production mode explicitly
NODE_ENV=production npm run build:prod
```

#### Native Module Issues (sqlite3)

**Problem:** sqlite3 or other native modules fail to load

**Solution:**
```bash
# Rebuild native modules for Electron
npm run postinstall

# Or manually
./node_modules/.bin/electron-builder install-app-deps
```

#### Code Signing Issues (macOS)

**Problem:** App not signed or notarized

**Solution:**
1. Ensure valid Apple Developer certificate
2. Check build/notarize.js configuration
3. Set environment variables:
   ```bash
   export APPLE_ID="your-apple-id"
   export APPLE_ID_PASSWORD="app-specific-password"
   ```

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
# Verbose electron-builder output
DEBUG=electron-builder npm run dist

# Vite debug mode
DEBUG=vite:* npm run build:web
```

### Verification Failures

If `npm run build:verify` fails:

1. Check verification-report.json for details
2. Review failed checks
3. Fix issues and rebuild
4. Re-run verification

## Bundle Size Expectations

### Target Sizes (Production)

#### Compiled Code
- **dist/** (Electron code): < 10 MB
- **web/dist/** (React app): < 50 MB
- **Total (without node_modules)**: < 60 MB

#### Full Application
- **Windows installer (NSIS)**: 80-150 MB
- **Windows portable**: 100-180 MB
- **macOS DMG**: 80-150 MB
- **Linux AppImage**: 100-180 MB

### Size Optimization Tips

1. **Check Dependencies**
   ```bash
   npm ls --depth=0
   ```
   Remove unused dependencies.

2. **Analyze Bundle**
   Review build-report.json after running:
   ```bash
   npm run build:prod
   ```

3. **Vite Bundle Analyzer**
   Add to vite.config.ts temporarily:
   ```typescript
   import { visualizer } from 'rollup-plugin-visualizer';

   plugins: [
     react(),
     visualizer({ open: true })
   ]
   ```

4. **Check ASAR Archive**
   After building, inspect:
   ```bash
   npx asar list release/win-unpacked/resources/app.asar
   ```

## Performance Targets

### Build Times

Target build times on modern hardware (SSD, 8GB RAM, 4-core CPU):

- **Web build** (`npm run build:web`): 10-30 seconds
- **Electron build** (`npm run build:electron`): 5-15 seconds
- **Full build** (`npm run build`): 15-45 seconds
- **Optimized build** (`npm run build:prod`): 20-60 seconds
- **Distribution** (`npm run dist`): 2-5 minutes

### Runtime Performance

Expected application performance:

- **Startup time**: < 3 seconds
- **Mod list load (1000 mods)**: < 2 seconds
- **Search/filter response**: < 100ms
- **Export operation**: < 5 seconds
- **Memory usage (idle)**: 100-200 MB
- **Memory usage (1000 mods loaded)**: 200-400 MB

### Optimization Checks

Verify optimizations are applied:

1. **Source maps removed** (production):
   ```bash
   find dist web/dist -name "*.map" | wc -l
   # Should output: 0
   ```

2. **Comments removed**:
   Check dist/main.js for absence of comments

3. **Minification applied**:
   Check web/dist/assets/*.js files are minified

4. **Tree-shaking effective**:
   Review bundle size in build-report.json

## Advanced Configuration

### Environment-Specific Builds

#### Development Build
```bash
NODE_ENV=development npm run build
```
- Includes source maps
- Keeps comments
- No minification

#### Production Build
```bash
NODE_ENV=production npm run build:prod
```
- No source maps
- Removes comments
- Full minification
- Tree-shaking enabled

### Custom Electron Builder Configuration

Edit `electron-builder.json` for advanced options:

```json
{
  "compression": "maximum",
  "asar": true,
  "files": ["dist/**/*", "web/dist/**/*", "!**/*.map"]
}
```

### Custom Vite Configuration

Edit `vite.config.ts` for build customization:

```typescript
export default defineConfig(({ mode }) => ({
  build: {
    minify: 'esbuild',
    rollupOptions: {
      // Custom rollup options
    }
  }
}))
```

### Build Optimization Script

Customize `scripts/build-optimize.js` to add custom optimizations:

```javascript
// Add custom cleanup patterns
const PATTERNS_TO_REMOVE = [
  '**/*.spec.js',
  '**/*.test.js',
  // Add your patterns
];
```

### Build Verification Script

Customize `scripts/verify-build.js` to add custom checks:

```javascript
// Add custom file checks
const criticalFiles = [
  { path: '...', name: '...' },
  // Add your files
];
```

### CI/CD Integration

The GitHub Actions workflow (`.github/workflows/build.yml`) automates:

- Building on push/PR
- Running tests
- Creating releases
- Uploading artifacts

Customize workflow for your needs:

```yaml
name: Build
on:
  push:
    branches: [main, electron]
  pull_request:
    branches: [main]
```

## Best Practices

### Before Building

1. Update version in package.json
2. Update CHANGELOG.md
3. Run all tests: `npm run test:ci`
4. Commit all changes
5. Tag release (optional): `git tag v1.0.0`

### For Releases

1. Build for all platforms: `npm run dist:all`
2. Test installers on target platforms
3. Verify application functionality
4. Create GitHub release with installers
5. Update documentation

### Security

1. Never commit .env files
2. Use environment variables for secrets
3. Verify no sensitive data in builds
4. Run verification: `npm run build:verify`
5. Check build reports for unexpected files

### Performance

1. Profile before and after changes
2. Monitor bundle sizes
3. Use build reports to track growth
4. Optimize dependencies regularly
5. Remove unused code

## Support

For issues or questions:

1. Check this documentation
2. Review build reports (build-report.json, verification-report.json)
3. Check GitHub Issues
4. Review Electron Builder docs: https://www.electron.build/
5. Review Vite docs: https://vitejs.dev/

## License

See LICENSE file for details.
