import type { Metadata } from "next";
import StudioLegalPage from "@/components/StudioLegalPage";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Main Character LLP handles information when you contact us or use our website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <StudioLegalPage
      title="Privacy Policy"
      summary="This policy explains how Main Character LLP handles information when you visit maincharacter.one or contact us about services and products."
    >
      <section>
        <h2>Who we are</h2>
        <p>
          Main Character LLP (“Main Character”, “we”, “us”) operates the website
          at{" "}
          <a href="https://maincharacter.one">maincharacter.one</a> and related
          studio communications. Contact:{" "}
          <a href="mailto:hello@maincharacter.one">hello@maincharacter.one</a>.
        </p>
      </section>

      <section>
        <h2>Information we collect</h2>
        <p>We may receive:</p>
        <ul>
          <li>
            Contact details and project information you send by email or through
            forms that open your mail client
          </li>
          <li>
            Basic technical data from hosting and network logs (such as IP
            address, browser type, and request timing)
          </li>
          <li>
            Theme preference stored locally in your browser if you use the site
            theme toggle
          </li>
        </ul>
        <p>
          We do not run third-party advertising trackers on this site. Product
          experiences we link to (for example Luna or Scooty) may have their own
          policies.
        </p>
      </section>

      <section>
        <h2>How we use information</h2>
        <p>We use information to:</p>
        <ul>
          <li>Respond to inquiries and discuss potential projects</li>
          <li>Operate, secure, and improve the website</li>
          <li>Meet legal or compliance obligations when required</li>
        </ul>
      </section>

      <section>
        <h2>Sharing</h2>
        <p>
          We do not sell personal information. We may share information with
          service providers who help us host email or infrastructure, or when
          required by law.
        </p>
      </section>

      <section>
        <h2>Retention</h2>
        <p>
          Inquiry emails and related notes are kept as long as needed to manage
          the conversation and our business records, then deleted or archived
          according to our internal practices.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          You can email{" "}
          <a href="mailto:hello@maincharacter.one">hello@maincharacter.one</a>{" "}
          to ask questions about this policy or request deletion of inquiry
          correspondence where applicable.
        </p>
      </section>

      <section>
        <h2>Updates</h2>
        <p>
          We may update this policy from time to time. The effective date above
          reflects the latest version published on this site.
        </p>
      </section>
    </StudioLegalPage>
  );
}
