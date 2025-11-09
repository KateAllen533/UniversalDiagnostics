export default function Help() {
  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
            <i className="ri-question-line text-2xl text-primary"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Find answers to common questions and get support
        </p>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="ri-plug-line text-primary"></i>
              Getting Started
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How do I connect to my vehicle?</h3>
                <p>
                  Connect an OBD-II adapter to your vehicle's diagnostic port (usually located under the dashboard).
                  The app will automatically detect and connect to your vehicle once the adapter is powered on.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What adapters are supported?</h3>
                <p>
                  The application supports most ELM327-based OBD-II adapters, including Bluetooth, WiFi, and USB variants.
                  For best results, we recommend adapters that support OBD-II protocol version 2.0 or higher.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="ri-settings-line text-primary"></i>
              Using the App
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How do I run diagnostics?</h3>
                <p>
                  Navigate to the Diagnostics page and click "Start Scan". The app will perform a comprehensive check
                  of your vehicle's systems and display any diagnostic trouble codes (DTCs) found.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How do I clear error codes?</h3>
                <p>
                  Go to the Advanced Diagnostics page where you can view detailed information about error codes
                  and clear them using the "Clear Codes" button. Note that clearing codes does not fix underlying issues.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Can I view historical data?</h3>
                <p>
                  Yes! The History page maintains a log of all diagnostic scans, sensor readings, and error codes
                  detected during your sessions. You can filter and search through this data.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="ri-alert-line text-primary"></i>
              Troubleshooting
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">App won't connect to my vehicle</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Ensure your OBD-II adapter is properly plugged in and powered on</li>
                  <li>Check that your vehicle's ignition is in the "ON" position</li>
                  <li>Verify Bluetooth/WiFi is enabled on your device</li>
                  <li>Try disconnecting and reconnecting the adapter</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sensor data not updating</h3>
                <p>
                  If sensor data appears frozen, try refreshing the connection by navigating to Settings and
                  using the "Reconnect" option. Some vehicles may have limited sensor availability depending
                  on the make, model, and year.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Error reading diagnostic codes</h3>
                <p>
                  Not all vehicles support all OBD-II features. If you're unable to read codes, verify your
                  vehicle is OBD-II compliant (typically 1996 or newer for US vehicles) and try using a
                  different adapter if problems persist.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="ri-mail-line text-primary"></i>
              Additional Support
            </h2>
            <div className="text-gray-600 dark:text-gray-300">
              <p className="mb-4">
                Need more help? You can report issues or request features through our Report Issue page.
                We monitor all submissions and aim to respond within 24-48 hours.
              </p>
              <a 
                href="/report-issue" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <i className="ri-file-list-line"></i>
                Report an Issue
              </a>
            </div>
          </div>

          <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <i className="ri-information-line text-2xl text-blue-600 dark:text-blue-400"></i>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Safety Notice</h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Always perform vehicle diagnostics in a safe environment. Never attempt to diagnose or 
                  repair vehicle issues while driving. If you encounter serious issues, consult a qualified 
                  automotive technician.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
