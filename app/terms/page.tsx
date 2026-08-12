import type { Metadata } from "next";
import StudioLegalPage from "@/components/StudioLegalPage";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms governing use of the Main Character website and studio communications.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <StudioLegalPage
      title="Terms of Use"
      summary="These terms govern your use of the Main Character website and general studio communications. Project work is covered by a separate agreement."
    >
      <section>
        <h2>Acceptance</h2>
        <p>
          By using{" "}
          <a href="https://maincharacter.one">maincharacter.one</a>, you agree
          to these terms. If you do not agree, do not use the site.
        </p>
      </section>

      <section>
        <h2>What this site is</h2>
        <p>
          This website describes Main Character LLP’s product and service
          offerings. Content is for general information. It is not a binding
          offer, proposal, or professional advice unless we confirm otherwise in
          writing.
        </p>
      </section>

      <section>
        <h2>Projects and products</h2>
        <p>
          Client engagements, deliverables, fees, and timelines are defined in a
          separate statement of work or contract. Linked products (including
          Luna and Scooty) may have their own terms.
        </p>
      </section>

      <section>
        <h2>Intellectual property</h2>
        <p>
          Site design, copy, branding, and interactive experiences are owned by
          Main Character LLP or its licensors. You may not copy or reuse them
          commercially without permission.
        </p>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <p>You agree not to misuse the site, including attempts to disrupt
          availability, scrape content at abusive scale, or send harmful or
          unlawful communications.
        </p>
      </section>

      <section>
        <h2>Disclaimer</h2>
        <p>
          The site is provided “as is.” To the maximum extent permitted by law,
          Main Character LLP disclaims warranties of merchantability, fitness
          for a particular purpose, and non-infringement.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, Main Character LLP is not
          liable for indirect, incidental, special, consequential, or punitive
          damages arising from use of the site.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms:{" "}
          <a href="mailto:hello@maincharacter.one">hello@maincharacter.one</a>.
        </p>
      </section>
    </StudioLegalPage>
  );
}
