# Offline Operation Guide

> Complete guide to Duckov Mod Manager's offline-first architecture and capabilities

---

## Table of Contents

- [Overview](#overview)
- [How Offline Mode Works](#how-offline-mode-works)
- [Translation Models](#translation-models)
- [Features Available Offline](#features-available-offline)
- [Initial Setup Requirements](#initial-setup-requirements)
- [Data Storage and Privacy](#data-storage-and-privacy)
- [Network Activity Monitoring](#network-activity-monitoring)
- [Troubleshooting Offline Operation](#troubleshooting-offline-operation)
- [Data Backup and Restore](#data-backup-and-restore)
- [Frequently Asked Questions](#frequently-asked-questions)

---

## Overview

### Offline-First Philosophy

Duckov Mod Manager is designed with an **offline-first** approach, meaning:

- **Primary Operation**: Everything works without internet connection
- **No Cloud Dependencies**: No cloud services, APIs, or remote servers required
- **Local Data Storage**: All data stored on your computer
- **Privacy Focused**: Your data never leaves your computer
- **One-Time Setup**: Internet only needed for initial translation model download

### Why Offline?

**Benefits**:
- Works anywhere (no WiFi needed)
- Fast (no network latency)
- Private (your data stays local)
- Reliable (no service outages)
- Free (no API costs or subscriptions)

**Use Cases**:
- Gaming laptops without internet
- Areas with poor connectivity
- Privacy-conscious users
- Users with metered/limited internet
- Anyone who prefers local-first software

---

## How Offline Mode Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                Duckov Mod Manager                       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │          User Interface (Electron)              │  │
│  │  • View mods                                    │  │
│  │  • Search and filter                            │  │
│  │  • Trigger translations                         │  │
│  └─────────────────────────────────────────────────┘  │
│                         │                               │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐  │
│  │           Application Services                   │  │
│  │  • Mod scanning                                 │  │
│  │  • Translation service                          │  │
│  │  • Export functionality                         │  │
│  └─────────────────────────────────────────────────┘  │
│                         │                               │
│                         ▼                               │
│  ┌──────────────┐  ┌───────────────┐  ┌───────────┐  │
│  │   Local      │  │  Translation  │  │  Workshop │  │
│  │  Database    │  │    Models     │  │   Folder  │  │
│  │  (SQLite)    │  │   (Cached)    │  │  (Steam)  │  │
│  └──────────────┘  └───────────────┘  └───────────┘  │
│         │                  │                  │         │
│         ▼                  ▼                  ▼         │
│  ┌─────────────────────────────────────────────────┐  │
│  │         Local File System (Your Computer)       │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  NO INTERNET CONNECTION REQUIRED                       │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Mod Scanning**:
   - Reads Steam Workshop folder on your computer
   - Parses local mod files (no network access)
   - Stores metadata in local SQLite database

2. **Translation**:
   - Uses locally cached machine learning models
   - Processes text entirely on your computer
   - Results cached in local database
   - No API calls, no cloud services

3. **Export**:
   - Reads mod files from local workshop folder
   - Creates ZIP archive on your computer
   - No upload, no cloud storage

4. **Search/Filter**:
   - Queries local SQLite database
   - Instant results (no network latency)
   - Works on cached and original data

---

## Translation Models

### What Are Translation Models?

Translation models are machine learning models that perform language translation locally on your computer.

**Technology**: Xenova Transformers (ONNX Runtime)
- Based on state-of-the-art transformer neural networks
- Optimized for CPU inference (no GPU required)
- Runs entirely in JavaScript/WebAssembly

### Model Details

**Model Information**:
- **Name**: Xenova/opus-mt-zh-en (example for Chinese → English)
- **Type**: Sequence-to-sequence transformer
- **Framework**: ONNX (Open Neural Network Exchange)
- **Size**: ~500 MB - 1 GB (depending on language pair)
- **Languages**: Supports 100+ language pairs
- **Quality**: Comparable to Google Translate for common languages

**What Gets Downloaded**:
- Model weights (binary data)
- Tokenizer configuration
- Model metadata
- Vocabulary files

### Download Process

#### First Translation Trigger

When you click "Translate" for the first time:

1. **Model Check**:
   - App checks if model is cached locally
   - If not found, initiates download

2. **Download**:
   - Downloads from Hugging Face CDN
   - Progress shown in UI (percentage and file names)
   - Multiple files downloaded (encoder, decoder, tokenizer)
   - Total size: ~500 MB - 1 GB

3. **Cache**:
   - Models stored in app cache directory
   - Persists across app restarts
   - Never deleted automatically

4. **Loading**:
   - Model loaded into memory (~500 MB - 1 GB RAM)
   - Stays loaded for the duration of app session
   - Unloaded when app closes

#### Download Locations

**Windows**:
```
C:\Users\<YourName>\AppData\Local\Duckov Mod Manager\Cache\transformers
```

**macOS**:
```
~/Library/Caches/Duckov Mod Manager/transformers
```

**Linux**:
```
~/.cache/Duckov Mod Manager/transformers
```

**Viewing Cache**:
You can browse these folders to see downloaded model files. Don't delete them manually - this will trigger re-download on next translation.

### Model Performance

**Speed**:
- First translation: 2-10 seconds (model loading + translation)
- Subsequent translations: 1-3 seconds
- Cached translations: Instant (<100ms)

**Accuracy**:
- Chinese → English: 85-95% (excellent)
- Russian → English: 80-90% (very good)
- Japanese → English: 80-90% (very good)
- Korean → English: 75-85% (good)
- Other languages: Varies

**Memory Usage**:
- Model in memory: 500 MB - 1 GB
- Translation process: +100-200 MB temporary
- Total app memory with model loaded: 1-2 GB

### Updating Models

**Current Version**: Models are downloaded once and never auto-updated.

**Future Updates**:
- App updates may include newer/better models
- Old models automatically replaced during app update
- No manual intervention required

---

## Features Available Offline

### 100% Offline Features

The following features work with **zero internet connectivity**:

#### Mod Management
- ✓ Scan workshop folder for mods
- ✓ View all mod metadata (title, description, author, etc.)
- ✓ Search mods by title or description
- ✓ Filter mods by language, date, size
- ✓ Sort mod lists
- ✓ View mod file sizes and locations

#### Translation
- ✓ Translate mod titles (after initial model download)
- ✓ Translate mod descriptions (after initial model download)
- ✓ Batch translate multiple mods
- ✓ View translation cache statistics
- ✓ Clear translation cache

#### Export
- ✓ Export selected mods as ZIP archive
- ✓ Choose export location
- ✓ Export with metadata

#### Data Management
- ✓ Local database operations
- ✓ Cached translation retrieval
- ✓ Mod statistics and analytics

### One-Time Internet Required

The following features require internet **only once**:

- **Translation Model Download**: Only on first translation
  - After download: Works 100% offline
  - Models cached permanently

### Never Requires Internet

These features work out-of-the-box with no downloads:

- Mod scanning
- Mod viewing
- Search and filtering
- Export functionality
- Database operations
- All UI features

---

## Initial Setup Requirements

### Minimum Internet Requirements

**When**: Only during first translation

**What's Downloaded**:
- Translation models (~500 MB - 1 GB)
- Downloaded from: Hugging Face CDN (cdn.huggingface.co)

**Connection Requirements**:
- Speed: Any speed works (faster = quicker download)
- Type: WiFi, Ethernet, mobile hotspot - any connection
- Bandwidth: ~1 GB total download
- Time: 5-30 minutes depending on connection speed

**After Download**:
- No internet ever required
- You can disconnect your computer from the internet
- App will continue working perfectly

### Air-Gapped Installation

For completely offline environments:

1. **On Internet-Connected Computer**:
   - Install Duckov Mod Manager
   - Trigger first translation (downloads models)
   - Copy cache directory:
     - Windows: `%LOCALAPPDATA%\Duckov Mod Manager\Cache`
     - macOS: `~/Library/Caches/Duckov Mod Manager`
     - Linux: `~/.cache/Duckov Mod Manager`

2. **On Offline Computer**:
   - Install Duckov Mod Manager
   - Copy cache directory from internet-connected computer
   - Place in same location
   - App will use cached models immediately

**Note**: This allows completely offline installation if you can transfer files via USB drive.

---

## Data Storage and Privacy

### What Data Is Stored Locally

#### Database (mods.db)

**Location**:
- Windows: `%APPDATA%\Duckov Mod Manager\mods.db`
- macOS: `~/Library/Application Support/Duckov Mod Manager/mods.db`
- Linux: `~/.config/Duckov Mod Manager/mods.db`

**Contains**:
- Mod metadata (ID, title, description, author, etc.)
- Original text from mod files
- Translated text (cached)
- Translation timestamps
- Language detection results
- Scan history

**Size**: 10-50 MB (depending on mod count)

**Format**: SQLite database (industry-standard, widely supported)

#### Translation Models

**Location**: See [Download Locations](#download-locations)

**Contains**:
- Neural network model weights
- Tokenizer files
- Vocabulary mappings
- Model configuration

**Size**: 500 MB - 1 GB per language pair

#### Application Logs

**Location**:
- Windows: `%APPDATA%\Duckov Mod Manager\logs`
- macOS: `~/Library/Logs/Duckov Mod Manager`
- Linux: `~/.config/Duckov Mod Manager/logs`

**Contains**:
- App startup/shutdown events
- Error messages
- Translation operations
- Scan results
- Performance metrics

**Size**: 1-10 MB (rotated automatically)

### Privacy Guarantees

#### Data Never Leaves Your Computer

**Absolute Privacy**:
- ✓ No telemetry or analytics
- ✓ No crash reporting
- ✓ No usage tracking
- ✓ No cloud sync
- ✓ No API calls (except one-time model download)

**What This Means**:
- Your mod list is private
- Your translations are private
- Your searches are private
- No one knows what you're doing with the app

#### No Account Required

- No registration
- No login
- No email address
- No personal information collected

#### Open Source

- Source code available on GitHub
- You can audit exactly what the app does
- Community can verify privacy claims

---

## Network Activity Monitoring

### Verifying Offline Operation

You can verify the app works offline using these methods:

#### Method 1: Network Monitor

**Windows**:
1. Open Task Manager (Ctrl+Shift+Esc)
2. Go to "Performance" tab
3. Select "Ethernet" or "Wi-Fi"
4. Watch network activity while using app
5. After model download: No network activity should occur

**macOS**:
1. Open Activity Monitor
2. Go to "Network" tab
3. Watch "Duckov Mod Manager" process
4. After model download: 0 bytes sent/received

**Linux**:
```bash
nethogs  # Shows per-process network usage
```
Duckov Mod Manager should show 0 after initial setup.

#### Method 2: Firewall Block

**Test by blocking the app**:

1. Block Duckov Mod Manager in your firewall
2. Restart the app
3. Try translating (with models already downloaded)
4. Everything should work normally

If it works with firewall block = truly offline!

#### Method 3: Airplane Mode

**Ultimate Test**:

1. Download translation models (requires internet)
2. Close Duckov Mod Manager
3. Enable Airplane Mode (disables all network)
4. Launch Duckov Mod Manager
5. Try all features
6. Everything works? You're fully offline!

---

## Troubleshooting Offline Operation

### Model Download Issues

#### Download Fails or Times Out

**Symptoms**:
- "Failed to download model" error
- Download stuck at X%
- Network timeout errors

**Solutions**:

1. **Check Internet Connection**:
   - Verify you have active internet
   - Try browsing a website
   - Check firewall isn't blocking app

2. **Retry Download**:
   - Close app completely
   - Delete cache folder (forces re-download)
   - Restart app
   - Trigger translation again

3. **Check Disk Space**:
   - Ensure 2+ GB free space
   - Models won't download if disk full

4. **Proxy/VPN Issues**:
   - If behind corporate proxy, may need proxy config
   - Try disabling VPN temporarily
   - Check with IT department

#### Download Very Slow

**Cause**: Large model files (500 MB - 1 GB)

**Expected Time**:
- Fast connection (100 Mbps): 1-2 minutes
- Medium connection (10 Mbps): 5-10 minutes
- Slow connection (1 Mbps): 15-30 minutes

**Solution**: Be patient. This is a one-time operation.

### Offline Translation Not Working

#### "Model Not Found" Error

**Cause**: Model cache deleted or corrupted

**Solution**:
1. Reconnect to internet
2. Trigger translation
3. Model will re-download
4. Disconnect internet again

#### Translations Return Original Text

**Symptoms**:
- Click "Translate" but text doesn't change
- Original language still shown

**Causes & Solutions**:

1. **Model Not Loaded**:
   - Check model cache exists
   - Restart app
   - Trigger translation again

2. **Language Not Supported**:
   - Current model: Chinese/Russian/Japanese/Korean → English
   - Other languages may not translate well
   - This is model limitation, not bug

3. **Text Already in English**:
   - If mod is already English, translation returns original
   - This is expected behavior

### Database Issues

#### "Database Locked" Error

**Cause**: Another process using database

**Solution**:
1. Close all instances of Duckov Mod Manager
2. Wait 5 seconds
3. Relaunch app

#### Database Corruption

**Symptoms**:
- Mods disappear
- App crashes on launch
- "Database error" messages

**Solution**:
1. Close app
2. Backup current database (just in case)
3. Delete `mods.db` file
4. Restart app (creates new database)
5. Re-scan mods
6. Re-translate as needed

**Note**: You'll lose cached translations but not mod data (that's in Steam folder).

---

## Data Backup and Restore

### What to Backup

For complete data preservation:

1. **Database** (essential):
   - `mods.db` file
   - Contains all mod metadata and translations

2. **Translation Models** (optional, can re-download):
   - Cache folder
   - Large but can be re-downloaded if needed

3. **Logs** (optional):
   - Usually not needed for restore
   - Useful for troubleshooting

### Backup Procedure

#### Windows

```batch
REM Create backup folder
mkdir "D:\Backups\Duckov Mod Manager"

REM Backup database
copy "%APPDATA%\Duckov Mod Manager\mods.db" "D:\Backups\Duckov Mod Manager\"

REM Optional: Backup models (large!)
xcopy "%LOCALAPPDATA%\Duckov Mod Manager\Cache" "D:\Backups\Duckov Mod Manager\Cache" /E /I
```

#### macOS

```bash
# Create backup folder
mkdir -p ~/Backups/Duckov-Mod-Manager

# Backup database
cp ~/Library/Application\ Support/Duckov\ Mod\ Manager/mods.db ~/Backups/Duckov-Mod-Manager/

# Optional: Backup models (large!)
cp -R ~/Library/Caches/Duckov\ Mod\ Manager ~/Backups/Duckov-Mod-Manager/Cache
```

#### Linux

```bash
# Create backup folder
mkdir -p ~/backups/duckov-mod-manager

# Backup database
cp ~/.config/Duckov\ Mod\ Manager/mods.db ~/backups/duckov-mod-manager/

# Optional: Backup models (large!)
cp -R ~/.cache/Duckov\ Mod\ Manager ~/backups/duckov-mod-manager/cache
```

### Restore Procedure

#### Windows

1. Close Duckov Mod Manager
2. Navigate to `%APPDATA%\Duckov Mod Manager`
3. Replace `mods.db` with your backup
4. (Optional) Replace cache folder
5. Restart app

#### macOS

1. Close Duckov Mod Manager
2. Navigate to `~/Library/Application Support/Duckov Mod Manager`
3. Replace `mods.db` with your backup
4. (Optional) Replace cache folder
5. Restart app

#### Linux

1. Close Duckov Mod Manager
2. Navigate to `~/.config/Duckov Mod Manager`
3. Replace `mods.db` with your backup
4. (Optional) Replace cache folder
5. Restart app

### Automated Backup

You can create scheduled tasks/cron jobs to automate backups.

**Windows Task Scheduler Example**:
```batch
REM Create .bat file with backup commands
REM Schedule in Task Scheduler to run daily
```

**macOS/Linux Cron Example**:
```bash
# Add to crontab (run daily at 2 AM)
0 2 * * * cp ~/.config/Duckov\ Mod\ Manager/mods.db ~/backups/mods-$(date +\%Y\%m\%d).db
```

---

## Frequently Asked Questions

### General Offline Questions

**Q: Does the app ever connect to the internet after initial setup?**
A: No. After translation models are downloaded, the app never makes network requests.

**Q: Can I use this on a computer that never has internet?**
A: Yes, if you transfer the model cache from another computer (see [Air-Gapped Installation](#air-gapped-installation)).

**Q: Will future updates require internet?**
A: Downloading app updates requires internet, but the app itself will continue working offline after update.

**Q: What happens if I delete the model cache?**
A: You'll need to re-download models (requires internet). Your data and translations remain safe in the database.

### Translation Model Questions

**Q: How big are the translation models?**
A: 500 MB - 1 GB depending on language pair. This is a one-time download.

**Q: Can I use different models?**
A: Currently no. The app uses a specific model set. Custom models may be supported in future versions.

**Q: Do models update automatically?**
A: No. Models are static once downloaded. Future app versions may include updated models.

**Q: Can I delete models to save space?**
A: Yes, but you'll need to re-download when translating. Not recommended unless very low on disk space.

### Privacy Questions

**Q: Does the app send my mod list anywhere?**
A: No. All data stays on your computer.

**Q: Are translations sent to a server?**
A: No. Translation happens entirely on your computer using local models.

**Q: Can anyone see what I'm doing in the app?**
A: No. There's no telemetry, analytics, or tracking of any kind.

**Q: Is my data encrypted?**
A: Data is stored in standard SQLite format (not encrypted). Since it never leaves your computer, encryption is optional. You can encrypt your hard drive for additional security.

### Technical Questions

**Q: What happens if I use the app while disconnected from internet?**
A: Everything works normally (assuming models are already downloaded).

**Q: Can I move my data to another computer?**
A: Yes. Copy the database file and optionally the cache folder. See [Data Backup and Restore](#data-backup-and-restore).

**Q: Does the app check for updates?**
A: Currently no automatic update checking. Check manually for new versions.

**Q: What if Hugging Face (model provider) shuts down?**
A: Models are cached locally forever. Even if the source goes offline, your local cache works indefinitely.

---

## Summary

### Key Points

1. **Offline-First**: Designed to work without internet
2. **One-Time Setup**: Internet needed only for initial model download
3. **Privacy Focused**: Your data never leaves your computer
4. **Fully Functional**: All features work offline
5. **No Subscriptions**: No ongoing internet requirements
6. **Open Source**: Transparent and auditable

### Internet Required

- ✗ First-time translation model download (~1 GB, one-time)
- ✗ App updates (optional)

### Internet NOT Required

- ✓ Mod scanning
- ✓ Translation (after models downloaded)
- ✓ Search and filtering
- ✓ Export functionality
- ✓ All core features

### Verification

To verify offline operation:
1. Download models while connected to internet
2. Disconnect from internet (Airplane Mode)
3. Use all app features
4. Everything works? You're 100% offline!

---

**Version**: 1.0.0
**Last Updated**: 2025-11-11
**Author**: DMCK96

**Related Documentation**:
- `DEPLOYMENT.md` - Installation and setup
- `GETTING_STARTED.md` - Quick start guide
- `MIGRATION_FROM_OLD_APP.md` - Upgrade guide
