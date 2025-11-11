# Distribution Checklist

> Pre-release verification checklist for Duckov Mod Manager

**Purpose**: Ensure quality and completeness before distributing releases to users.

**Usage**: Complete this checklist before every release. Mark items as complete with `[x]`.

---

## Pre-Build Checklist

### Code Quality

- [ ] All TypeScript compilation errors resolved
  ```bash
  npm run build:electron
  # Should complete without errors
  ```

- [ ] No linting errors or warnings
  ```bash
  npm run lint
  # Should show 0 errors, 0 warnings
  ```

- [ ] All tests passing
  ```bash
  npm run test
  # All tests should pass
  ```

- [ ] Test coverage acceptable (>70%)
  ```bash
  npm run test:coverage
  # Check coverage report
  ```

### Version Management

- [ ] Version bumped in `package.json`
  - Follow semantic versioning (MAJOR.MINOR.PATCH)
  - Update version number appropriately

- [ ] Version matches intended release
  - Double-check version number is correct
  - No typos or incorrect increments

- [ ] CHANGELOG.md updated (if exists)
  - New version section added
  - All changes documented

- [ ] Release notes prepared
  - See `RELEASE_NOTES.md` template
  - All new features documented
  - All bug fixes listed
  - Breaking changes highlighted

### Dependencies

- [ ] All dependencies up to date (security)
  ```bash
  npm audit
  # No high/critical vulnerabilities
  ```

- [ ] No unused dependencies
  ```bash
  npx depcheck
  # Review and remove unused packages
  ```

- [ ] Production dependencies verified
  ```bash
  npm list --prod
  # All required packages present
  ```

- [ ] Development dependencies not in production build
  - Check electron-builder config excludes dev deps

---

## Build Verification

### Build Process

- [ ] Clean build completed successfully
  ```bash
  npm run clean
  npm run build
  # No errors during build
  ```

- [ ] Production build optimized
  ```bash
  npm run build:prod
  # Optimization script runs without errors
  ```

- [ ] Build verification passed
  ```bash
  npm run build:verify
  # All verification checks pass
  ```

- [ ] Build report generated and reviewed
  - Check `build-report.json`
  - Bundle sizes acceptable
  - No unexpected files included

### Bundle Validation

- [ ] No test files in production bundle
  - No `*.spec.js` or `*.test.js` files
  - No `__tests__` directories
  - No test fixtures

- [ ] No source maps in production (optional for debug builds)
  - No `*.map` files if production mode
  - Source maps excluded from distribution

- [ ] No sensitive files included
  - No `.env` files
  - No `.git` directory
  - No development configuration

- [ ] Bundle size within acceptable limits
  - `dist/` < 10 MB
  - `web/dist/` < 50 MB
  - Total excluding node_modules < 100 MB

### Critical Files Present

- [ ] Main process entry: `dist/main.js`
- [ ] Preload script: `dist/preload.js`
- [ ] React app: `web/dist/index.html`
- [ ] Package manifest: `package.json`
- [ ] License file: `LICENSE`
- [ ] README: `README.md`

---

## Platform Builds

### Windows

- [ ] Windows NSIS installer builds (x64)
  ```bash
  npm run dist:win
  ```

- [ ] Windows NSIS installer builds (ia32)
  - Optional: Comment out if not needed

- [ ] Windows portable executable builds
  - Check `release/Duckov-Mod-Manager-*-portable.exe` exists

- [ ] Installer tested on Windows 10
  - Clean Windows 10 installation
  - Install via NSIS installer
  - Launch and verify works

- [ ] Installer tested on Windows 11
  - Windows 11 installation
  - Verify no compatibility issues

- [ ] Desktop shortcut created correctly
- [ ] Start menu shortcut created correctly
- [ ] Uninstaller works properly
- [ ] Windows SmartScreen behavior acceptable
  - Warning expected (not code-signed)
  - Ensure "Run anyway" option available

### macOS

- [ ] macOS DMG builds
  ```bash
  npm run dist:mac
  ```

- [ ] macOS ZIP archive builds

- [ ] Tested on Intel Mac
  - macOS 10.15 (Catalina) or later
  - Install and verify functionality

- [ ] Tested on Apple Silicon (M1/M2)
  - Native performance verified
  - No Rosetta emulation required

- [ ] DMG layout correct
  - App icon positioned properly
  - Applications folder shortcut present
  - Background image displays

- [ ] Gatekeeper warning acceptable
  - Right-click → Open works
  - Warning message user-friendly

- [ ] App permissions handled
  - File system access works
  - No unexpected permission prompts

### Linux

- [ ] Linux AppImage builds
  ```bash
  npm run dist:linux
  ```

- [ ] Debian package (.deb) builds
- [ ] RPM package (.rpm) builds

- [ ] AppImage tested on Ubuntu 22.04
  - Make executable and run
  - Desktop integration offered
  - Verify all features work

- [ ] .deb tested on Debian/Ubuntu
  ```bash
  sudo dpkg -i Duckov-Mod-Manager-*.deb
  ```
  - Installation successful
  - Dependencies satisfied
  - App launches from menu

- [ ] .rpm tested on Fedora/RHEL
  ```bash
  sudo rpm -i Duckov-Mod-Manager-*.rpm
  ```
  - Installation successful
  - App launches correctly

- [ ] Desktop file integration correct
  - Shows in application menu
  - Icon displays properly
  - Correct category

---

## Functional Testing

### Core Functionality

- [ ] App launches successfully
  - Windows: No console window (unless debug build)
  - macOS: Opens without errors
  - Linux: Launches from desktop file

- [ ] Workshop path configuration works
  - Can browse for folder
  - Can manually enter path
  - Path validation works
  - Invalid paths show error

- [ ] Mod scanning functionality
  - Scans workshop folder successfully
  - Correct mod count displayed
  - Mod metadata extracted properly
  - Large mod collections (1000+) handled

- [ ] Search functionality
  - Real-time search works
  - Results accurate
  - Performance acceptable
  - Handles special characters

- [ ] Filter functionality
  - Language filters work
  - Sort options work
  - Filters combine correctly
  - Clear filters works

- [ ] Mod details display
  - All fields populated correctly
  - Original text shown
  - Formatting preserved

### Translation Features

- [ ] Translation model download
  - First translation triggers download
  - Progress indicator shows
  - Download completes successfully
  - Model size ~500 MB - 1 GB

- [ ] Offline translation works
  - Translates Chinese mods
  - Translates Russian mods
  - Translates Japanese mods
  - Translates Korean mods

- [ ] Translation caching
  - Cached translations instant
  - Cache persists across restarts
  - Cache stats accurate

- [ ] Translation quality acceptable
  - Mod titles translate well
  - Descriptions understandable
  - Technical terms mostly correct

- [ ] Batch translation
  - Multiple mods translate
  - Progress shown
  - No crashes with large batches

### Export Functionality

- [ ] Single mod export
  - Export dialog opens
  - File save dialog works
  - ZIP created successfully
  - ZIP contains correct files

- [ ] Multiple mod export
  - Batch export works
  - All selected mods included
  - File size appropriate
  - ZIP structure correct

- [ ] Export to different locations
  - Desktop export works
  - Documents export works
  - Custom paths work
  - Path validation works

### Error Handling

- [ ] Invalid workshop path handling
  - Clear error message
  - Suggests next steps
  - Doesn't crash app

- [ ] Missing translation models
  - Prompts for download
  - Gracefully handles download failure
  - Provides retry option

- [ ] Network errors (model download)
  - Clear error message
  - Doesn't crash app
  - Retry mechanism works

- [ ] Database errors
  - Corrupt database handled
  - Clear error message
  - Recovery possible

- [ ] Disk space errors
  - Low disk space detected
  - Clear warning shown
  - Prevents data corruption

---

## Offline Operation

- [ ] Offline mode verified
  - Disconnect from internet
  - All features still work (after model download)
  - No error messages about connectivity

- [ ] Translation works offline
  - Tested with internet disabled
  - Translation performance unchanged
  - Cache functioning

- [ ] Mod scanning works offline
  - No internet required
  - All features available

- [ ] Export works offline
  - ZIP creation succeeds
  - No network dependency

---

## Performance Testing

### Startup Performance

- [ ] Cold start time < 5 seconds
  - First launch after install
  - Time from click to usable UI

- [ ] Warm start time < 3 seconds
  - Subsequent launches
  - Acceptable performance

### Operation Performance

- [ ] Mod scanning performance
  - 100 mods: < 10 seconds
  - 1000 mods: < 30 seconds
  - 5000 mods: < 2 minutes

- [ ] Search performance
  - Instant results (< 100ms)
  - Handles large mod lists
  - No lag during typing

- [ ] Translation performance
  - First translation: 2-10 seconds (model load)
  - Subsequent: 1-3 seconds
  - Cached: < 100ms

### Memory Usage

- [ ] Idle memory usage < 300 MB
- [ ] With model loaded < 1.5 GB
- [ ] No memory leaks detected
  - Run for extended period
  - Memory usage stable
  - No continuous growth

### Disk Usage

- [ ] App installation size
  - Windows: ~150-200 MB
  - macOS: ~150-200 MB
  - Linux: ~150-200 MB

- [ ] Translation models size
  - ~500 MB - 1 GB per language pair
  - Within documented range

- [ ] Database growth
  - Reasonable size for mod count
  - No excessive bloat

---

## Documentation

### User Documentation

- [ ] `DEPLOYMENT.md` reviewed and updated
  - Installation instructions accurate
  - Platform-specific steps correct
  - Troubleshooting section current

- [ ] `GETTING_STARTED.md` reviewed
  - Quick start accurate
  - Screenshots described (if not included)
  - Common tasks documented

- [ ] `OFFLINE_OPERATION.md` reviewed
  - Offline features documented
  - Model download process clear
  - Privacy guarantees stated

- [ ] `MIGRATION_FROM_OLD_APP.md` current
  - Migration steps accurate (if applicable)
  - Breaking changes documented

- [ ] `RELEASE_NOTES.md` complete
  - Current version documented
  - All changes listed
  - Known issues stated

### Developer Documentation

- [ ] `README.md` updated
  - Build instructions current
  - Requirements accurate
  - Links working

- [ ] `DEVELOPMENT.md` current
  - Development setup works
  - Dependencies documented
  - Scripts explained

- [ ] `ARCHITECTURE.md` reflects current state
  - Diagrams accurate
  - Data flows correct

### In-App Help

- [ ] Error messages user-friendly
  - Clear language
  - Actionable steps
  - No technical jargon (unless necessary)

- [ ] Tooltips helpful (if present)
- [ ] Help links work (if present)

---

## Security

### Application Security

- [ ] No hardcoded secrets or API keys
  - Search codebase for credentials
  - Check environment files

- [ ] Renderer process sandboxed
  - `sandbox: true` in BrowserWindow
  - Context isolation enabled
  - No node integration in renderer

- [ ] IPC channels validated
  - All channels whitelisted
  - Input validation on all handlers
  - No arbitrary code execution

- [ ] External content handled safely
  - No remote code execution
  - CSP headers set (if applicable)

### Dependency Security

- [ ] No critical vulnerabilities
  ```bash
  npm audit
  # No high or critical issues
  ```

- [ ] Dependencies from trusted sources
  - All from npm registry
  - No suspicious packages

- [ ] SBOM generated (if required)
  - Software Bill of Materials
  - For enterprise/compliance

---

## Distribution Assets

### Build Artifacts

- [ ] All platform builds in `release/` folder
  - Windows: .exe files
  - macOS: .dmg and .zip
  - Linux: .AppImage, .deb, .rpm

- [ ] File naming consistent
  - Format: `Duckov-Mod-Manager-{version}-{platform}.{ext}`
  - Version matches package.json
  - No typos

- [ ] File sizes reasonable
  - Windows installer: 150-250 MB
  - macOS DMG: 150-250 MB
  - Linux AppImage: 150-250 MB

### Checksums

- [ ] Checksums generated
  ```bash
  # Example for SHA256
  sha256sum release/* > checksums.txt
  ```

- [ ] Checksums verified
  - Recalculate and compare
  - All files included

### Release Package

- [ ] Release notes prepared
  - See `RELEASE_NOTES.md`
  - Formatted for GitHub release

- [ ] Screenshots prepared (optional)
  - Main window
  - Key features
  - Installation wizard

- [ ] README for release (optional)
  - Quick start
  - Download links
  - System requirements

---

## GitHub Release

### Pre-Release Steps

- [ ] All changes committed
  ```bash
  git status
  # Should be clean
  ```

- [ ] All changes pushed to repository
  ```bash
  git push origin electron
  ```

- [ ] Tag created
  ```bash
  git tag -a v1.0.0 -m "Release version 1.0.0"
  git push origin v1.0.0
  ```

### Release Creation

- [ ] GitHub release created
  - Go to repository → Releases → New Release
  - Tag: v{version}
  - Title: Duckov Mod Manager v{version}

- [ ] Release notes added
  - Copy from RELEASE_NOTES.md
  - Format for GitHub (markdown)

- [ ] Build artifacts uploaded
  - All platform builds
  - Checksum file
  - Any additional assets

- [ ] Release type set correctly
  - Pre-release if beta/RC
  - Latest release if stable

### Post-Release Verification

- [ ] Download links work
  - Test each platform download
  - Verify file integrity

- [ ] Release notes display correctly
  - Formatting good
  - Links working
  - No typos

- [ ] Auto-update metadata correct (if applicable)
  - latest.yml generated
  - Signature valid

---

## Communication

### User Communication

- [ ] Release announcement prepared
  - For website/blog (if exists)
  - For social media (if applicable)
  - For community forums

- [ ] Known issues communicated
  - Documented in release notes
  - Workarounds provided
  - Severity indicated

### Developer Communication

- [ ] Breaking changes documented
  - Migration guide provided
  - Examples given

- [ ] API changes documented (if applicable)

---

## Post-Release Monitoring

### First 24 Hours

- [ ] Monitor for critical issues
  - GitHub issues
  - User reports
  - Crash reports (if telemetry exists)

- [ ] Prepare hotfix plan
  - Critical bugs identified
  - Fix prioritization
  - Hotfix release if needed

### First Week

- [ ] User feedback collected
  - Common questions documented
  - FAQ updated
  - Documentation improved

- [ ] Usage patterns analyzed (if telemetry exists)
  - Feature adoption
  - Performance metrics
  - Error rates

---

## Rollback Plan

### In Case of Critical Issues

- [ ] Previous version available
  - Links to old releases maintained
  - Downgrade instructions documented

- [ ] Rollback procedure documented
  - Steps to revert
  - Data migration backwards (if needed)

- [ ] Communication plan
  - How to notify users
  - Where to post updates

---

## Sign-Off

**Release Manager**: _______________________  Date: __________

**QA Tester**: _______________________  Date: __________

**Developer**: _______________________  Date: __________

---

## Notes

Use this section for release-specific notes, issues encountered, or deviations from the checklist.

```
[Add notes here]
```

---

**Checklist Version**: 1.0
**Last Updated**: 2025-11-11
**For Release**: v1.0.0

---

## Tips for Using This Checklist

1. **Copy for Each Release**: Don't modify this template. Copy and complete for each release.

2. **Version Control**: Store completed checklists in `releases/v{version}/checklist.md`

3. **Automation**: Many items can be automated in CI/CD:
   - Tests
   - Linting
   - Build verification
   - Security scanning

4. **Progressive Enhancement**: Start with critical items, add more as process matures.

5. **Team Review**: Have multiple people verify critical items.

6. **Time Estimation**: First release: 2-3 days. Subsequent: 4-8 hours.

7. **Parallel Tasks**: Many items can be done in parallel by multiple team members.
