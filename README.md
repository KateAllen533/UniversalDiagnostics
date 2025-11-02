# Universal Vehicle Diagnostics

A comprehensive web application for universal vehicle diagnostics that supports both traditional combustion engine vehicles and electric vehicles through various connection methods (USB, USB-C, Bluetooth).

🌐 **Live Demo**: [https://universal-diagnotistics-tool.netlify.app/](https://universal-diagnotistics-tool.netlify.app/)

## Features

- **Universal Compatibility**: Works with both ICE and EV vehicles
- **Multiple Connection Methods**: USB, USB-C, and Bluetooth support
- **Real-time Data**: Live monitoring of vehicle parameters
- **Comprehensive Diagnostics**: Read and clear trouble codes
- **Advanced G2 Turbo Functions**: Advanced diagnostic capabilities using AutoProPAD G2 Turbo specifications
- **AI-Powered Analytics**: Integration with Ollama AI models for diagnostic data analysis
- **Responsive UI**: Mobile-friendly design that works on any device
- **Data Logging**: Session history and data visualization
- **Customizable Settings**: Configure connection preferences and defaults

## System Requirements

- Node.js 16.x or later
- PostgreSQL 12.x or later
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Quick Installation

### Automated Installation

#### On Linux/macOS:

```bash
# Clone the repository
git clone https://github.com/KateAllen533/UniversalDiagnostics.git

# Navigate to the project directory
cd UniversalDiagnostics

# Make the build script executable
chmod +x build.sh

# Run the build script
./build.sh
```

#### On Windows:

```cmd
# Clone the repository
git clone https://github.com/KateAllen533/UniversalDiagnostics.git

# Navigate to the project directory
cd UniversalDiagnostics

# Run the build script
build.bat
```

### Manual Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KateAllen533/UniversalDiagnostics.git
   cd UniversalDiagnostics
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the following content:
   ```
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=postgresql://[username]:[password]@[host]:[port]/[database]
   PGUSER=[username]
   PGHOST=[host]
   PGPASSWORD=[password]
   PGDATABASE=[database]
   PGPORT=[port]
   ```

4. Set up the database:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5000`

## Development

```bash
# Run the development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Advanced Analytics with Ollama

Universal Vehicle Diagnostics can integrate with local Ollama AI models to provide advanced analytics for your diagnostic data:

1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull a model (quantized INT4 or INT8 models are supported for lower resource usage):
   ```bash
   # For INT4 model (smaller file size)
   ollama pull llama2:7b-q4_K_M

   # For INT8 model (better quality)
   ollama pull llama2:7b-q8_0
   ```
3. Start the Ollama server:
   ```bash
   ollama serve
   ```
4. Configure the AI Analytics settings in the application

## GitHub Pages Deployment

This application includes automated GitHub Pages deployment. The static web UI will be automatically deployed to GitHub Pages when you push to the `main` branch.

### Automatic Deployment

1. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Under "Source", select "GitHub Actions"

2. Push to the `main` branch or manually trigger the workflow:
   - The workflow will automatically build and deploy the static client to GitHub Pages
   - The site will be available at `https://[username].github.io/UniversalDiagnostics/`

3. The workflow (`deploy-gh-pages.yml`) will:
   - Build the client application with the correct base path
   - Deploy the static files to GitHub Pages

 

- 🌐 [Live Demo on Netlify](https://universal-diagnotistics-tool.netlify.app/)
- [GitHub Repository](https://github.com/KateAllen533/UniversalDiagnostics)
- [Documentation](https://github.com/KateAllen533/UniversalDiagnostics/wiki)
- [Report an Issue](https://github.com/KateAllen533/UniversalDiagnostics/issues)
