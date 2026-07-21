import type { Metadata } from "next";
import LegalPage from "../LegalPage";

export const metadata: Metadata = {
  title: "Backstage Live Beta Terms",
  description:
    "Terms for evaluating the Backstage Live public TestFlight preview.",
  alternates: { canonical: "/backstage/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Beta Terms of Use"
      summary="These terms govern your evaluation of the Backstage Live public TestFlight preview provided by Main Character LLP."
    >
      <section>
        <h2>Beta purpose</h2>
        <p>
          Backstage Live is pre-release evaluation software. Build 2 uses
          fictional, device-local demo data and is not a production booking,
          ticketing, payment, emergency, or record-keeping service. Do not rely
          on it for a real event.
        </p>
      </section>

      <section>
        <h2>Permission to test</h2>
        <p>
          Main Character LLP grants you a limited, revocable, non-transferable
          right to install and evaluate the preview through TestFlight. You must
          follow Apple&apos;s TestFlight terms and applicable law, and must not
          interfere with, reverse engineer beyond rights granted by law, or
          misuse the preview.
        </p>
      </section>

      <section>
        <h2>Fictional content and feedback</h2>
        <p>
          Names, venues, shows, attendance figures, and other records in this
          preview are fictional. If you provide feedback, you allow Main
          Character LLP to use it without restriction or payment to improve
          Backstage Live, while you retain ownership of your original feedback
          content.
        </p>
      </section>

      <section>
        <h2>Ownership</h2>
        <p>
          Backstage Live, its software, design, and branding are owned by Main
          Character LLP or its licensors. These terms do not transfer
          intellectual property rights to you.
        </p>
      </section>

      <section>
        <h2>Availability and termination</h2>
        <p>
          The preview may change, stop working, expire, or be withdrawn at any
          time. Access ends when the TestFlight build expires, you remove it, or
          Main Character LLP ends the beta. Delete the preview when access ends.
        </p>
      </section>

      <section>
        <h2>No warranty</h2>
        <p>
          To the maximum extent permitted by law, the preview is provided “as
          is” and “as available,” without warranties of accuracy, reliability,
          availability, fitness for a particular purpose, or non-infringement.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, Main Character LLP is not
          liable for indirect, incidental, special, consequential, or
          lost-profit damages arising from the preview. Nothing in these terms
          excludes liability that cannot lawfully be excluded.
        </p>
      </section>

      <section>
        <h2>Governing law and contact</h2>
        <p>
          These terms are governed by the laws of India. Courts with
          jurisdiction in Maharashtra, India will have jurisdiction, subject to
          mandatory consumer protections. Questions may be sent to{" "}
          <a href="mailto:hello@maincharacter.one">hello@maincharacter.one</a>.
        </p>
      </section>
    </LegalPage>
  );
}
