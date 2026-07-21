import type { Metadata } from "next";
import LegalPage from "../LegalPage";

export const metadata: Metadata = {
  title: "Backstage Live Support",
  description:
    "Support information for the Backstage Live public TestFlight preview.",
  alternates: { canonical: "/backstage/support" },
};

export default function SupportPage() {
  return (
    <LegalPage
      title="Support"
      summary="Help with the isolated Backstage Live public TestFlight preview."
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
        <h2>Using this preview</h2>
        <ul>
          <li>
            No sign-in is required; the preview opens with fictional local data.
          </li>
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
        <h2>Resetting the preview</h2>
        <p>
          If the local preview becomes stuck, close and reopen it. To remove all
          local preview data and permissions, delete the app and reinstall it
          from TestFlight. There is no Backstage account or cloud data to delete
          in this build.
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
