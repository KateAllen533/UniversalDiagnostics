# Universal Vehicle Diagnostics

A comprehensive web application for universal vehicle diagnostics that supports both traditional combustion engine vehicles and electric vehicles through various connection methods (USB, USB-C, Bluetooth).

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

## Custom Deployment

To deploy to a custom domain instead of replit.dev:

1. Build the application:
   ```bash
   npm run build
   ```
2. The built files will be in the `dist` folder
3. Configure your web server (Nginx, Apache, etc.) to serve these static files
4. Set up a proxy for the API endpoints to the Express server
5. Create and configure the `.env` file with your production settings

## Running as a Local Server

To make the application accessible from other devices on your network:

1. Update `server/index.ts` to bind to all network interfaces:
   ```typescript
   const PORT = process.env.PORT || 3000;
   app.listen(PORT, '0.0.0.0', () => {
     console.log(`Server running at http://0.0.0.0:${PORT}`);
   });
   ```
2. Start the server as normal
3. Access the application from other devices using your computer's IP address

## Copyright & Ownership

This is a prototype developed by Global Technology Consulting LLC. Currently under NovarisAI testing. All rights reserved.

## License

This software is provided for educational and diagnostic purposes only. The user assumes all responsibility for its use and any consequences thereof. No warranty is expressed or implied.

## Resources

- [GitHub Repository](https://github.com/KateAllen533/UniversalDiagnostics)
- [Documentation](https://github.com/KateAllen533/UniversalDiagnostics/wiki)
- [Report an Issue](https://github.com/KateAllen533/UniversalDiagnostics/issues)