import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Lakon",
  description: "Lakon's privacy policy. We compress your prompts, not your privacy.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-20">
      <div className="mb-10">
        <p className="text-xs font-mono text-accent uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-3xl font-bold text-white mb-3">Privacy Policy</h1>
        <p className="text-[#555] text-sm font-mono">Last Updated: April 24, 2026</p>
      </div>

      <div className="space-y-10 text-[#888] text-[15px] leading-relaxed">

        <section>
          <p>
            Lakon (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we handle data when you use the Lakon web application
            and its companion browser extension.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">1. Data Transmission & Processing</h2>
          <p>
            Lakon&apos;s core feature is prompt compression. To perform this, the text you submit is
            transmitted to our secure servers for processing.
          </p>
          <ul className="list-disc list-inside mt-3 space-y-2">
            <li>Your prompt is processed in real-time to generate a compressed version.</li>
            <li><span className="text-white font-medium">We do not store your prompts.</span> Once the compressed result is returned to your browser, the data is not retained on our servers.</li>
            <li>No account or login is required, so we never associate your prompts with any identity.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">2. Information We Do Not Collect</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Your name, email address, or any contact information.</li>
            <li>Browsing history outside of the supported AI platforms.</li>
            <li>Any information from websites other than Claude, ChatGPT, and Gemini.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">3. Browser Extension Permissions</h2>
          <p>
            The Lakon browser extension requests the following permissions:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-2">
            <li><span className="text-white font-mono text-sm">storage</span> — Used only to save your local compression statistics (tokens saved). This data never leaves your device.</li>
            <li><span className="text-white font-mono text-sm">activeTab</span> — Used to read the prompt text from the active AI chat tab. We only read the text at the moment you click the Lakon button.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">4. Data Security</h2>
          <p>
            All data transmitted between the extension and our servers is encrypted using
            industry-standard HTTPS/TLS protocols.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">5. Third-Party Sharing</h2>
          <p>
            We never sell, trade, or share your data with third parties for any reason.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-lg mb-3">6. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be reflected
            on this page with an updated &quot;Last Updated&quot; date.
          </p>
        </section>

        <section className="border-t border-[#1A1A1A] pt-8">
          <h2 className="text-white font-semibold text-lg mb-3">7. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, please reach out to us at{" "}
            <a href="mailto:sumitagar4@gmail.com" className="text-accent hover:underline">
              sumitagar4@gmail.com
            </a>.
          </p>
        </section>

      </div>
    </main>
  );
}
