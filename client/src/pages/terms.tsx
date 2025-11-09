export default function Terms() {
  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
            <i className="ri-file-text-line text-2xl text-primary"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Please read these terms carefully before using our service
        </p>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <div className="text-gray-600 dark:text-gray-300">
              <p>
                By accessing and using the Universal Vehicle Diagnostics application ("the Service"), you accept and
                agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms
                of Service, please do not use the Service.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. Description of Service</h2>
            <div className="text-gray-600 dark:text-gray-300 space-y-3">
              <p>
                Universal Vehicle Diagnostics provides an interface for reading and interpreting vehicle diagnostic
                information through OBD-II compatible adapters. The Service includes:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Real-time vehicle sensor data monitoring</li>
                <li>Diagnostic trouble code (DTC) reading and interpretation</li>
                <li>Historical data logging and analysis</li>
                <li>Vehicle performance metrics tracking</li>
                <li>Advanced diagnostic features</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. User Responsibilities</h2>
            <div className="text-gray-600 dark:text-gray-300 space-y-3">
              <p>As a user of this Service, you agree to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use the Service only for lawful purposes and in accordance with these Terms</li>
                <li>Ensure you have the legal right to access and diagnose the vehicle you are connecting to</li>
                <li>Not use the Service while operating a vehicle</li>
                <li>Maintain the security of your device and OBD-II adapter</li>
                <li>Not attempt to reverse engineer, decompile, or disassemble any part of the Service</li>
                <li>Not use the Service to harm, disable, or impair any vehicle systems</li>
                <li>Comply with all applicable local, state, national, and international laws and regulations</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4. Disclaimer of Warranties</h2>
            <div className="text-gray-600 dark:text-gray-300 space-y-3">
              <p>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
                OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                <li>Accuracy, reliability, or completeness of diagnostic information</li>
                <li>Uninterrupted or error-free operation of the Service</li>
                <li>Compatibility with all vehicles, adapters, or device configurations</li>
              </ul>
              <p className="mt-4">
                We do not warrant that the Service will meet your requirements or that any defects will be corrected.
                The diagnostic information provided is for informational purposes only and should not be used as the
                sole basis for vehicle maintenance or repair decisions.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5. Limitation of Liability</h2>
            <div className="text-gray-600 dark:text-gray-300 space-y-3">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR
                INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Your use or inability to use the Service</li>
                <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
                <li>Any interruption or cessation of transmission to or from the Service</li>
                <li>Any bugs, viruses, or similar issues transmitted through the Service by any third party</li>
                <li>Any errors or omissions in any content or for any loss or damage incurred as a result of your use of any content</li>
                <li>Vehicle damage or malfunction resulting from use of the Service</li>
                <li>Incorrect diagnostic information or interpretation</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6. Professional Advice Disclaimer</h2>
            <div className="text-gray-600 dark:text-gray-300">
              <p>
                The information provided through this Service is for informational and educational purposes only and
                does not constitute professional automotive advice. You should always consult with a qualified
                automotive technician or mechanic before making any decisions regarding vehicle maintenance, repair,
                or operation. We are not responsible for any actions taken based on information provided by the Service.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">7. Intellectual Property Rights</h2>
            <div className="text-gray-600 dark:text-gray-300">
              <p>
                The Service and its original content, features, and functionality are owned by Universal Vehicle
                Diagnostics and are protected by international copyright, trademark, patent, trade secret, and other
                intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of the
                Service without our prior written consent.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">8. Third-Party Services and Links</h2>
            <div className="text-gray-600 dark:text-gray-300">
              <p>
                The Service may contain links to third-party websites, services, or resources that are not owned or
                controlled by us. We have no control over and assume no responsibility for the content, privacy
                policies, or practices of any third-party websites or services. You acknowledge and agree that we
                shall not be responsible or liable for any damage or loss caused by your use of any such third-party
                content or services.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">9. Indemnification</h2>
            <div className="text-gray-600 dark:text-gray-300">
              <p>
                You agree to defend, indemnify, and hold harmless Universal Vehicle Diagnostics, its affiliates,
                licensors, and service providers from and against any claims, liabilities, damages, judgments, awards,
                losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to
                your violation of these Terms or your use of the Service.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">10. Termination</h2>
            <div className="text-gray-600 dark:text-gray-300">
              <p>
                We may terminate or suspend your access to the Service immediately, without prior notice or liability,
                for any reason, including without limitation if you breach these Terms. Upon termination, your right
                to use the Service will immediately cease. All provisions of these Terms which by their nature should
                survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations
                of liability.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">11. Changes to Terms</h2>
            <div className="text-gray-600 dark:text-gray-300">
              <p>
                We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision
                is material, we will provide at least 30 days' notice prior to any new terms taking effect. What
                constitutes a material change will be determined at our sole discretion. By continuing to access or
                use the Service after revisions become effective, you agree to be bound by the revised terms.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">12. Governing Law</h2>
            <div className="text-gray-600 dark:text-gray-300">
              <p>
                These Terms shall be governed and construed in accordance with applicable laws, without regard to its
                conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be
                considered a waiver of those rights.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">13. Severability</h2>
            <div className="text-gray-600 dark:text-gray-300">
              <p>
                If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed
                and interpreted to accomplish the objectives of such provision to the greatest extent possible under
                applicable law, and the remaining provisions will continue in full force and effect.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">14. Contact Information</h2>
            <div className="text-gray-600 dark:text-gray-300">
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us through the Report Issue
                page or visit our partner website for additional information.
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

          <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <i className="ri-alert-line text-2xl text-red-600 dark:text-red-400"></i>
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">Safety Warning</h3>
                <p className="text-red-800 dark:text-red-200 text-sm">
                  Never use this application while operating a vehicle. Always perform diagnostics in a safe, stationary
                  environment. Improper use of diagnostic tools can result in vehicle damage or personal injury. Consult
                  a qualified automotive professional for any repairs or maintenance decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
