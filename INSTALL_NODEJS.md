# Installing Node.js for CampaignForge

Node.js is required to run the React frontend. Follow these steps to install it:

## Quick Installation (Recommended)

### Option 1: Download from Official Website (Easiest)

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Download the **LTS (Long Term Support)** version for Windows
   - Choose the Windows Installer (.msi) - 64-bit

2. **Install Node.js:**
   - Run the downloaded installer
   - Follow the installation wizard (accept defaults)
   - **Important**: Make sure to check "Add to PATH" during installation

3. **Verify Installation:**
   - Close and reopen your terminal/PowerShell
   - Run these commands:
     ```bash
     node --version
     npm --version
     ```
   - You should see version numbers (e.g., v18.17.0 and 9.6.7)

4. **Restart Your Terminal:**
   - After installation, close and reopen PowerShell/Command Prompt
   - Navigate to your project:
     ```bash
     cd "C:\Users\Ankith M\Desktop\Hackathon\frontend"
     ```

5. **Install React Dependencies:**
   ```bash
   npm install
   ```

6. **Start the React App:**
   ```bash
   npm start
   ```

### Option 2: Using Chocolatey (If you have it)

If you have Chocolatey package manager installed:
```bash
choco install nodejs-lts
```

### Option 3: Using Winget (Windows 10/11)

```bash
winget install OpenJS.NodeJS.LTS
```

## After Installation

Once Node.js is installed:

1. **Navigate to frontend directory:**
   ```bash
   cd "C:\Users\Ankith M\Desktop\Hackathon\frontend"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

The React app will open automatically at `http://localhost:3000`

## Troubleshooting

### If npm is still not recognized after installation:

1. **Restart your terminal** - Close and reopen PowerShell/Command Prompt
2. **Check PATH:**
   - Node.js should be in: `C:\Program Files\nodejs\`
   - Verify it's in your system PATH
3. **Restart your computer** if needed

### Quick Test:

After installation, test with:
```bash
node --version
npm --version
```

Both should return version numbers.

---

**Note**: The installation typically takes 2-3 minutes. After installation, you'll be able to run the React frontend!
