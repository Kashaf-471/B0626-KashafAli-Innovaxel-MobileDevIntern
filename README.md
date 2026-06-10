# Innovaxel Expense Tracker

Innovaxel is a React Native app built with Expo Router for tracking personal expenses. It includes a dashboard, transaction list, settings screen, and a modal form for adding or editing expenses.

## Overview

The app is organized around a simple flow:

1. View your total spending and recent activity on the home screen.
2. Add, edit, or delete expense entries from the modal form and transaction list.
3. Review sync status, theme settings, and app stats in the settings screen.

The project uses file-based routing, so each screen is defined in `src/app`.

## Screens

### Home / Dashboard

File: `src/app/(tabs)/index.tsx`

This is the main landing screen. It shows:

- A welcome header
- Total outflow summary
- Analytics chart
- Recent transactions preview
- Floating action button for creating a new expense

The recent transactions cards are designed to give a quick scan of the latest spending without opening the full list.

### Expenses List

File: `src/app/(tabs)/list.tsx`

This screen shows the full transaction history. It is the place to browse, filter, edit, and delete expenses after they are created.

### Settings

File: `src/app/(tabs)/settings.tsx`

This screen shows app-level controls and account information:

- Theme toggle
- Sync status
- Firebase reference ID
- Total expense count and outflow summary
- Reset database action

### Add / Edit Expense Modal

File: `src/app/add-expense-modal.tsx`

This modal is used for both creating and editing an expense. It includes:

- Title / description
- Amount
- Category picker
- Date field
- Optional notes

If opened with an `id` parameter, it loads the existing expense and switches into edit mode.

### Explore

File: `src/app/explore.tsx`

This is an additional Expo Router screen that ships with the template. It is not part of the main expense-tracking flow, but it remains available in the app.

## Shared Components

The UI is built from reusable components in `src/components`:

- `ExpenseCard.tsx` renders each transaction row/card
- `AnalyticsChart.tsx` shows spending analytics on the dashboard
- `CategoryPicker.tsx` helps choose an expense category
- `CustomInput.tsx` and `CustomButton.tsx` standardize form controls
- `themed-text.tsx` and `themed-view.tsx` keep styling consistent

## Data Flow

Expense state lives in `src/hooks/useExpenses.tsx`.

That hook handles:

- Loading saved expenses
- Saving changes
- Theme persistence
- Firebase sync when available
- Derived totals and filters

The app falls back to local storage if Firebase is unavailable.

## Project Structure

```text
src/
   app/
      _layout.tsx
      add-expense-modal.tsx
      explore.tsx
      (tabs)/
         _layout.tsx
         index.tsx
         list.tsx
         settings.tsx
   components/
      AnalyticsChart.tsx
      ExpenseCard.tsx
      CategoryPicker.tsx
      CustomButton.tsx
      CustomInput.tsx
      themed-text.tsx
      themed-view.tsx
   hooks/
      useExpenses.tsx
   constants/
      theme.ts
   utils/
      firebase.ts
      storage.ts
```

## Tech Stack

- Expo SDK 54
- Expo Router
- React Native
- Firebase Realtime Database
- AsyncStorage for local persistence

## Getting Started

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npx expo start
```

Useful run targets:

```bash
npm run android
npm run ios
npm run web
```

## Notes

- Expo Go should work with this project when the installed app matches SDK 54.
- If Metro or the install gets out of sync, a clean reinstall is usually the fastest fix.
- The app keeps the main code in `src/`, so the repository root stays focused on config and tooling.

## Reset Starter Content

If you want to restore the default Expo starter layout, run:

```bash
npm run reset-project
```

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router documentation](https://docs.expo.dev/router/introduction/)
- [Expo Go](https://expo.dev/go)
