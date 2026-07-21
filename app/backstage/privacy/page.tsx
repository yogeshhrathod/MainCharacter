import type { Metadata } from "next";
import LegalPage from "../LegalPage";

export const metadata: Metadata = {
  title: "Backstage Live Privacy Policy",
  description: "Privacy policy for the Backstage Live TestFlight beta.",
  alternates: { canonical: "/backstage/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary="This policy explains how Main Character LLP handles information in the Backstage Live TestFlight beta."
    >
      <section>
        <h2>Beta scope</h2>
        <p>
          Backstage Live is pre-release software. TestFlight builds may connect
          to our development Supabase project so testers can evaluate shared
          artist, producer, venue, show, lineup, audience, and live-show flows.
          Use fictional test information only. Information you enter may persist
          and may be visible to other authorised beta testers.
        </p>
      </section>

      <section>
        <h2>Information we process</h2>
        <ul>
          <li>
            Account and authentication information, including your phone number
            and internal account identifier.
          </li>
          <li>
            Profile and role information, such as stage name, username, city,
            biography, experience, and style tags.
          </li>
          <li>
            Test venue, show, registration, lineup, live-session, attendance,
            ticket-sales, and performance information created in the beta.
          </li>
          <li>
            Photos you choose for profiles or venues. These may be uploaded to
            our development storage project.
          </li>
          <li>
            A venue location you select. Current-device location is optional and
            is used to help choose a venue position when you request it.
          </li>
          <li>
            App preferences stored on your device, plus diagnostics and feedback
            supplied through TestFlight or support email.
          </li>
        </ul>
      </section>

      <section>
        <h2>How we use and share information</h2>
        <p>
          We use beta information to provide, secure, troubleshoot, and improve
          Backstage Live. Shared show and venue information is available to
          other authorised testers where needed for collaborative beta flows.
          Supabase processes hosted database, authentication, and storage data
          for us. Apple processes TestFlight distribution, diagnostics, crash,
          and feedback information. We do not sell beta tester information.
        </p>
      </section>

      <section>
        <h2>Apple services</h2>
        <p>
          Apple distributes the beta through TestFlight and may process install,
          diagnostics, crash, and feedback information under the{" "}
          <a href="https://www.apple.com/legal/privacy/">
            Apple Privacy Policy
          </a>
          . Apple Maps may process map and location interactions when you use
          the map. Push alerts and remote address search are disabled in the
          current internal beta. Apple services are governed by Apple&apos;s
          terms and privacy practices.
        </p>
      </section>

      <section>
        <h2>Feedback and support</h2>
        <p>
          If you voluntarily email us or submit TestFlight feedback, we receive
          the information you include and use it to respond and improve the
          beta. We retain support correspondence only as long as reasonably
          needed for those purposes or legal obligations.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>
          The beta is intended for adult performers, producers, and beta
          testers. It is not directed to children, and Main Character LLP does
          not knowingly collect children&apos;s personal information through
          this build.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          Photo and location access are optional and controlled through iOS
          Settings. The binary includes a motion purpose string because a
          bundled location component references Apple motion APIs, but the
          current beta does not request motion permission or read motion data.
          Deleting the app removes local data but does not delete cloud beta
          records. To request deletion of your beta account, cloud records, or
          support correspondence, email us from the contact address associated
          with the request. We may retain information where required by law or
          needed for security and abuse prevention.
        </p>
      </section>

      <section>
        <h2>Contact and changes</h2>
        <p>
          Main Character LLP operates Backstage Live. Contact us at{" "}
          <a href="mailto:hello@maincharacter.one">hello@maincharacter.one</a>.
          Material changes to this policy will be posted on this page with a new
          effective date.
        </p>
      </section>
    </LegalPage>
  );
}
