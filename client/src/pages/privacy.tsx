export default function Privacy() {
  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
            <i className="ri-shield-line text-2xl text-primary"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Your privacy is important to us
        </p>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Vehicle Diagnostic Data</h3>
                <p>
                  When you use our application, we collect diagnostic information from your vehicle through the OBD-II interface,
                  including but not limited to: diagnostic trouble codes (DTCs), sensor readings, engine performance metrics,
                  and system status information. This data is stored locally on your device and is used solely to provide
                  diagnostic services.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Usage Information</h3>
                <p>
                  We may collect information about how you interact with the application, including features accessed,
                  diagnostic scans performed, and session duration. This helps us improve the application and provide
                  better service.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Device Information</h3>
                <p>
                  We collect basic device information such as operating system version, browser type, and device model
                  to ensure compatibility and optimize performance.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
            <div className="text-gray-600 dark:text-gray-300 space-y-3">
              <p>We use the collected information to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide vehicle diagnostic services and display real-time data</li>
                <li>Maintain historical records of diagnostic scans for your reference</li>
                <li>Improve application performance and user experience</li>
                <li>Diagnose technical issues and provide customer support</li>
                <li>Analyze usage patterns to develop new features</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. Data Storage and Security</h2>
            <div className="text-gray-600 dark:text-gray-300 space-y-3">
              <p>
                Your vehicle diagnostic data is primarily stored locally on your device using browser storage mechanisms.
                We implement industry-standard security measures to protect your information, including:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Encrypted data transmission between your device and OBD-II adapter</li>
                <li>Local storage encryption where supported by your browser</li>
                <li>Regular security audits and updates</li>
                <li>Secure authentication mechanisms for account access</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4. Data Sharing and Disclosure</h2>
            <div className="text-gray-600 dark:text-gray-300 space-y-3">
              <p>
                We do not sell, trade, or rent your personal information or vehicle data to third parties. We may
                share information only in the following circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or respond to lawful requests</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>With service providers who assist in operating our application (under strict confidentiality agreements)</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5. Your Rights and Choices</h2>
            <div className="text-gray-600 dark:text-gray-300 space-y-3">
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access your stored vehicle data through the History page</li>
                <li>Delete your diagnostic history at any time through the Settings page</li>
                <li>Opt-out of usage analytics through the Settings page</li>
                <li>Request a copy of your data by contacting our support team</li>
                <li>Request deletion of all your data from our systems</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6. Cookies and Tracking Technologies</h2>
            <div className="text-gray-600 dark:text-gray-300">
              <p>
                We use local storage and session storage to maintain your preferences (such as theme selection and
                disclaimer acceptance) and to provide a seamless user experience. These technologies do not track you
                across other websites.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">7. Children's Privacy</h2>
            <div className="text-gray-600 dark:text-gray-300">
              <p>
                Our service is not intended for use by individuals under the age of 18. We do not knowingly collect
                personal information from children. If you believe we have collected information from a child, please
                contact us immediately.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">8. Changes to This Privacy Policy</h2>
            <div className="text-gray-600 dark:text-gray-300">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal
                requirements. We will notify you of any material changes by posting the new Privacy Policy on this
                page and updating the "Last updated" date. Your continued use of the application after such changes
                constitutes acceptance of the updated policy.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">9. Contact Us</h2>
            <div className="text-gray-600 dark:text-gray-300">
              <p className="mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices,
                please contact us through the Report Issue page or visit our partner website.
              </p>
              <div className="flex gap-4">
                <a 
                  href="/report-issue" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <i className="ri-file-list-line"></i>
                  Report an Issue
                </a>
                <a 
                  href="https://www.s-tecm.com/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <i className="ri-external-link-line"></i>
                  Visit Novarisai
                </a>
              </div>
            </div>
          </div>

          <div className="card bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <i className="ri-information-line text-2xl text-amber-600 dark:text-amber-400"></i>
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Important Notice</h3>
                <p className="text-amber-800 dark:text-amber-200 text-sm">
                  This application is designed for informational and diagnostic purposes only. Vehicle diagnostic data
                  should not be used as the sole basis for maintenance or repair decisions. Always consult with a
                  qualified automotive technician for professional advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
