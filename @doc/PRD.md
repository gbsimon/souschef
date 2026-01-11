# PRD - Nori (SousChef) v0

## Overview
Nori is a cozy, voice-first cooking assistant that helps people cook with what they have. It asks friendly follow-up questions, remembers pantry essentials, and adapts to allergies and preferences.

## Goals
- Suggest 3-5 viable recipes from minimal input.
- Keep the dialog short and helpful (no more than 2 follow-up questions).
- Remember pantry and preferences across devices.

## Non-Goals (v0)
- Offline mode.
- Meal planning or grocery delivery.
- Sponsored content.

## Target Users
Home cooks who want quick, low-friction recipe ideas and guidance.

## Core User Flows
1) Onboarding: account creation, allergy/intolerance capture, and pantry essentials confirmation.
2) Ask: tap to talk, Nori asks missing-ingredient questions, then returns 3-5 recipes.
3) Review: edit pantry/preferences and confirm inferred items.
4) Recipe detail: full steps with a clear Save button.

## Functional Requirements
- Voice-first chat with text fallback.
- Missing-ingredient follow-up questions (max two).
- Pantry inference with confirm/deny.
- Dietary/allergy filtering (hard filter) and preferences with substitutions.
- 3-5 recipe suggestions with full in-app steps.
- Save button and saved recipes list.
- Accounts and cross-device sync.

## AI Behavior
- Ask targeted follow-ups; avoid long interrogations.
- Use pantry essentials by default; propose missing items only with user consent.
- Allergies are hard filters; preferences can suggest substitutions.

## Data & Privacy
- Store profile, pantry, preferences, saved recipes.
- Store raw transcripts only in staging/dev environments.

## Success Metrics
- <5 seconds to first response after speech ends.
- >60% sessions end with a recipe viewed or saved.
- >50% inferred pantry items confirmed.
