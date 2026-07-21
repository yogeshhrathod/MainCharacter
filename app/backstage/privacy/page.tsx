import type { Metadata } from "next";
import LegalPage from "../LegalPage";

export const metadata: Metadata = {
  title: "Backstage Live Privacy Policy",
  description:
    "Privacy policy for the Backstage Live public TestFlight preview.",
  alternates: { canonical: "/backstage/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary="This policy describes the limited, device-local data handling in the Backstage Live public TestFlight preview operated by Main Character LLP."
    >
      <section>
        <h2>Preview scope</h2>
        <p>
          This policy applies to the isolated Backstage Live TestFlight preview,
          version 1.0.0 build 3. The preview opens with fictional demo data. It
          does not create a Backstage account, sign you into a backend, or
          upload your show, profile, photo, or location data to Main Character
          LLP.
        </p>
      </section>

      <section>
        <h2>Information used on your device</h2>
        <ul>
          <li>
            Fictional show, venue, artist, lineup, audience, and performance
            data is bundled with the app for evaluation.
          </li>
          <li>
            If you choose a photo, the preview uses it locally so you can
            evaluate profile and venue editing. It is not uploaded by this
            build.
          </li>
          <li>
            If you choose to use your current location, it is used on your
            device to position the venue map. You can instead tap the map
            manually.
          </li>
          <li>
            Appearance, haptic, and similar preview preferences may be stored on
            your device.
          </li>
        </ul>
      </section>

      <section>
        <h2>Apple services</h2>
        <p>
          Apple distributes the preview through TestFlight and may process
          install, diagnostics, crash, and feedback information under the{" "}
          <a href="https://www.apple.com/legal/privacy/">
            Apple Privacy Policy
          </a>
          . Apple Maps may process map and location interactions when you use
          the map. These Apple services are governed by Apple&apos;s terms and
          privacy practices.
        </p>
      </section>

      <section>
        <h2>Feedback and support</h2>
        <p>
          If you voluntarily email us or submit TestFlight feedback, we receive
          the information you include and use it to respond and improve the
          preview. We retain support correspondence only as long as reasonably
          needed for those purposes or legal obligations, and we do not sell it.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>
          The preview is intended for adult performers, producers, and beta
          testers. It is not directed to children, and Main Character LLP does
          not knowingly collect children&apos;s personal information through
          this build.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          Photo and location access are optional and controlled through iOS
          Settings. The binary includes an Apple-required motion purpose string
          because a bundled location component references Apple motion APIs, but
          this preview does not request motion permission or read motion data.
          Removing the app deletes its local preview data. You may ask us to
          delete support correspondence associated with your email, subject to
          any legal retention requirement.
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
