import type { Metadata } from "next";
import LegalPage from "../LegalPage";

export const metadata: Metadata = {
  title: "Backstage Live Support",
  description: "Support information for the Backstage Live TestFlight beta.",
  alternates: { canonical: "/backstage/support" },
};

export default function SupportPage() {
  return (
    <LegalPage
      title="Support"
      summary="Help with the Backstage Live TestFlight beta."
    >
      <section>
        <h2>Contact</h2>
        <p>
          Email{" "}
          <a href="mailto:hello@maincharacter.one">hello@maincharacter.one</a>{" "}
          with your iPhone model, iOS version, build number, the screen you were
          on, what you expected, and what happened. You can also attach a
          screenshot through TestFlight feedback.
        </p>
      </section>

      <section>
        <h2>Using this beta</h2>
        <ul>
          <li>
            The internal beta signs in to a shared development backend. Use only
            the test phone number or invitation supplied by Main Character LLP.
          </li>
          <li>Use fictional test information only.</li>
          <li>Switch Artist and Producer roles from Profile.</li>
          <li>
            In Producer mode, open a show and update Tickets sold. Switch to
            Artist mode to confirm the same audience total is visible.
          </li>
          <li>
            Push notifications and remote address search are not included in
            this beta.
          </li>
        </ul>
      </section>

      <section>
        <h2>Signing out and resetting</h2>
        <p>
          Sign out from Profile. If the beta becomes stuck, close and reopen it
          or reinstall it from TestFlight. Deleting the app removes local data
          and permissions but does not delete your beta account or cloud test
          records. Email us to request deletion.
        </p>
      </section>

      <section>
        <h2>Privacy and terms</h2>
        <p>
          Read the <a href="/backstage/privacy">Privacy Policy</a> and{" "}
          <a href="/backstage/terms">Beta Terms of Use</a> for this preview.
        </p>
      </section>
    </LegalPage>
  );
}
