# TestFlight First Upload Checklist

## 1. Account and access
- [ ] Apple Developer Program membership is active (paid account).
- [ ] You have access to App Store Connect for this app.
- [ ] Your app has a unique Bundle Identifier.

## 2. App setup in App Store Connect
- [ ] App record is created in App Store Connect.
- [ ] App name, primary language, and bundle ID match your project.
- [ ] Version and build numbers are set correctly.

## 3. Xcode project readiness
- [ ] `Signing & Capabilities` uses the correct Team.
- [ ] Automatic signing works (or profiles/certificates are valid if manual).
- [ ] `iOS Deployment Target` is correct.
- [ ] `Version` and `Build` are incremented.
- [ ] App icons and launch assets are in place.

## 4. Privacy and compliance
- [ ] `Privacy Policy URL` is added (if required for your features).
- [ ] App Privacy questionnaire is completed in App Store Connect.
- [ ] Export compliance is answered (encryption questions).
- [ ] Any required usage descriptions are in `Info.plist` (camera, mic, photos, location, etc.).

## 5. Archive and upload
- [ ] Select a physical iOS device or Any iOS Device (arm64) in Xcode.
- [ ] Run `Product > Archive`.
- [ ] In Organizer, choose `Distribute App > App Store Connect > Upload`.
- [ ] Confirm upload succeeds and build appears in App Store Connect.

## 6. TestFlight configuration
- [ ] In App Store Connect, open `TestFlight` tab.
- [ ] Add Beta App Description and Feedback Email.
- [ ] Create at least one Internal Testing group.
- [ ] Add uploaded build to internal group and verify install.

## 7. External testing (friends)
- [ ] Create an External Testing group.
- [ ] Add build to external group.
- [ ] Complete `What to Test` notes.
- [ ] Submit the build for TestFlight App Review.
- [ ] After approval, invite testers by email or public link.

## 8. Friend tester instructions
- [ ] Friend installs Apple TestFlight app from the App Store.
- [ ] Friend accepts invite link/email.
- [ ] Friend installs beta build and sends feedback/screenshots from TestFlight.

## 9. Common rejection/setup pitfalls
- [ ] Build has obvious crashes on launch.
- [ ] Missing permissions purpose strings in `Info.plist`.
- [ ] Login required with no test account provided (if review needs login).
- [ ] Broken links in app (privacy/support URLs).
- [ ] Metadata does not match app behavior.

## 10. Ongoing beta cadence
- [ ] Increment build number for every new upload.
- [ ] Note that each TestFlight build expires after 90 days.
- [ ] Track tester feedback and crash reports before App Store release.
