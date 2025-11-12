# Proficio

> Track your progress, break bad habits, and build a better you.

Proficio is a cross-platform habit tracking application that helps you monitor your journey away from bad habits. Built with Tauri, SvelteKit, and TypeScript, it provides a clean, intuitive interface to visualize your progress in real-time.

<img src="https://github.com/user-attachments/assets/0da86c4c-684f-478a-9729-c53edc235011" width="250">
<img src="https://github.com/user-attachments/assets/953f001d-a941-4e09-bb83-02a9c40f3792" width="250">
<img src="https://github.com/user-attachments/assets/89d55858-4171-49d3-984a-7b7c2004e190" width="250">


## 🌟 Features

- **Real-time Tracking**: Live counter showing days, hours, and minutes since you started
- **Visual Progress**: Beautiful circular progress indicators to visualize your journey
- **Milestone Badges**: Automatic badges for weeks, months, and years of progress
- **Dark Mode**: Full dark mode support for comfortable viewing any time
- **Data Export**: Export your habit history to CSV for analysis
- **Reset & Restart**: Reset counters when needed while maintaining your history
- **Local Storage**: All data stored locally on your device using SQLite
- **Cross-platform**: Available on Windows, macOS, Linux, and Android

## 📦 Requirements

### Running the Application

- No additional requirements - just download and run!

### Building from Source

- [Bun](https://bun.sh/) (JavaScript runtime and package manager)
- [Rust](https://www.rust-lang.org/tools/install) via rustup
- [Node.js](https://nodejs.org/) (v18 or higher, if not using Bun)

### Building for Android

- [Android Studio](https://developer.android.com/studio) with SDK and NDK
- Java Development Kit (JDK) 17 or higher
- Gradle (included in Android project)

## 🔧 Installation

### Install from Releases

1. Download the appropriate release for your platform from the [Releases](https://github.com/MordechaiHadad/proficio/releases) page
2. Extract the archive
3. Run the application

### Install from Source

1. Clone the repository:
   ```bash
   git clone https://github.com/MordechaiHadad/proficio.git
   cd proficio
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Run in development mode:
   ```bash
   bun run tauri dev
   ```

4. Build for production:
   ```bash
   bun run tauri build
   ```

### Building for Android

1. Initialize Android project:
   ```bash
   bun run tauri android init
   ```

2. Build and run on Android device or emulator:
   ```bash
   bun run tauri android dev
   ```

## ❓ Usage

### Adding a Habit

1. Click the **"Add Habit"** tab in the bottom navigation
2. Enter a name for your habit (up to 20 characters)
3. Choose an icon that represents your habit:
   - Smoking
   - Drinking
   - Exercise
   - Sugar
   - Gaming
   - Screen Time
   - Fast Food
4. Click **"Add Habit"** to start tracking

### Tracking Progress

- Your dashboard shows all active habits with real-time counters
- Each habit card displays:
  - Days, hours, and minutes since you started
  - A circular progress indicator
  - Milestone badges (weeks, months, years)
  - Reset and delete buttons

### Resetting a Counter

1. Click the **"Reset Counter"** button on any habit card
2. Confirm the reset in the dialog
3. Your previous streak is saved in the history, and a new tracking session begins

### Deleting a Habit

1. Click the trash icon on any habit card
2. Confirm the deletion
3. All tracking history for that habit will be permanently removed

### Exporting Data

1. Go to the **Settings** tab
2. Click **"Export CSV"** under Data Management
3. Your habit history will be saved to your Downloads folder as a CSV file

## ⚙ Configuration

### Dark Mode

Toggle dark mode from the Settings page. Your preference is saved locally.

### Data Storage

All data is stored locally in a SQLite database (`proficio.db`) in your application data directory:

- **Windows**: `%APPDATA%\com.morde.proficio`
- **macOS**: `~/Library/Application Support/com.morde.proficio`
- **Linux**: `~/.local/share/com.morde.proficio`
- **Android**: Internal app storage

### Database Schema

The application uses three main tables:

- `habits`: Stores habit definitions (name, icon, description)
- `habit_tracking`: Records tracking sessions with start dates and failure dates
- `app_settings`: Stores application preferences like dark mode


## 📱 Platform Support

- ✅ Windows
- ✅ macOS
- ✅ Linux
- ✅ Android (via Tauri Mobile)

## 🚀 Development

### Project Structure

```
proficio/
├── src/                          # Frontend source code
│   ├── lib/                      # Shared components and utilities
│   │   ├── components/           # Reusable Svelte components
│   │   ├── sveltlana/            # Custom UI component library
│   │   ├── db.ts                 # Database operations
│   │   └── index.ts              # Type definitions and utilities
│   └── routes/                   # SvelteKit routes
│       ├── +page.svelte          # Dashboard
│       ├── add/                  # Add habit page
│       └── settings/             # Settings page
├── src-tauri/                    # Rust backend
│   ├── src/                      # Rust source code
│   ├── migrations/               # Database migrations
│   ├── capabilities/             # Tauri permissions
│   └── gen/                      # Generated Android project
└── package.json                  # Dependencies and scripts
```

### Running Tests

```bash
bun run check
```

### Type Checking

```bash
bun run check:watch
```

## 📊 CSV Export Format

Exported CSV files contain the following columns:

- **Habit Name**: The name of the tracked habit
- **Start Date**: When the tracking session began
- **Failure Date**: When the habit was reset (empty if still ongoing)
- **Days Lasted**: Number of days the streak lasted

## 🎨 Customization

### Adding New Icons

Edit `src/lib/index.ts` and add your icon to the `icons` object:

```typescript
export const icons = {
  // ... existing icons
  your_icon: {
    name: "Your Habit",
    icon: YourIconComponent,
  },
};
```

### Modifying Database Schema

1. Create a new migration in `src-tauri/migrations/`
2. Update the migration version in `src-tauri/src/lib.rs`
3. Implement the schema changes in SQL

## 🔍 Troubleshooting

### Database Issues

If you experience database errors:

1. Close the application completely
2. Backup your database file (optional)
3. Restart the application - migrations will run automatically

### Android Build Issues

If Android builds fail:

1. Ensure Android SDK and NDK are properly installed
2. Set `ANDROID_HOME` environment variable
3. Run `bun run tauri android init` again

### Dark Mode Not Persisting

If dark mode preference doesn't save:

1. Check application data directory permissions
2. Ensure the database is writable
3. Try resetting app settings from the Settings page
