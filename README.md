# StreamShelf

Take-home project for The Weather Channel.

## Getting Started

Assumptions are you are using NPM + NPX, if using PNPM, or other dependency, replace the commands as fit.
To run the app, you must first install the dependencies `npm install`. afterwards you can start the expo server with `npx expo start`. if you intend to use an android tv simulator, you must `set EXPO_TV=1` on windows, followed by a prebuild with `npx expo prebuild --clean`, then you can run with `npx expo run:android` if you have an android tv emulator running.

To run unit tests in the root directory run `npm run test`.

## Architecture

Going for unidirectional data flow by separating presentation, domain, and data:

- The presentation layer should only have access to the domain layer.
- The domain layer should only have access to the data layer.
- Presentation should never touch files in the data layer directly.

In presentation, screens cover full views, and components are extracted wherever a view is reusable. Expo Router is used, and the `src/app` folder just holds routes that handle routing, and import from `presentation/screens` for the full views.

Given time constraints, no physical tvOS/Android TV testing, and a limited number of application screens, no tab bar navigation will be used. Instead, an button will exist on the home screen to navigate to My List. In a production environment, My List would live in a tab control, and we'd use native tabs for mobile platforms, JS tabs for web, and need more research for set-top devices (Fire TV, smart TVs, etc.). 

I added focus styling to show what `Title` is focused in the `Rail`, which can easily be tested with android TV emulators.

My list just shows all the images of the `Title`'s added to my list. It has no other functionality.

## AsyncStateView

`AsyncStateView` is a view that renders the states needed during async calls: loading, loaded, empty, and error.

This centralizes the states that all the full views go through, since they're pretending to fetch data and should handle errors the same way across screens. Props are exposed to override the default loading, empty, or error state where a screen needs something other than what `AsyncStateView` provides out of the box.

## AsyncStorageProvider

`AsyncStorageProvider` keeps the dependency on a persistence library out of the domain layer and inside the data layer. That way, if the underlying storage library ever changes, the change is centralized in one place instead of touching every hook in the domain layer that reads or writes persisted data.

## Data source

`CatalogDataSource` simulates a quarter-second network delay with `setTimeout`. It also simulates a 1-in-4 chance of a network failure using `Math.random()` to get a number from 1 to 4 — if it lands on 4, the call is treated as a failure and the promise is rejected; otherwise, it resolves. It's used as a singleton, exporting an instance of the class rather than the class itself, since this is meant to be static data. In production, the underlying data could change, so caching would have a much shorter lifecycle if used at all, as opposed to living for the whole session the way it does here.

If the goal of this take-home were to show full-stack work, I'd have made this a REST API call instead — potentially with Docker Compose spinning up a relational database (e.g. Postgres) and a Node.js REST API with a formal contract. The model from that contract could then be shared with the frontend as shared code, which is one of the real benefits of a Node.js backend. That's a direction I'd genuinely enjoy building out, but I know it's beside the point of a project geared toward CTV + React Native. :)

## Where AI is leveraged in this project

Since the goal of this project is to show what I can do, the patterns I rely on, and my code style, I intentionally limited how much I leaned on AI. Where I did use it:

- **Sanity-checking my own architecture decisions.** I initially planned this in three phases — Phase 1 being Docker Compose, a Node.js server with Prisma-modeled REST APIs, and Postgres for real data, with Docker as a hard requirement of the project. I asked AI for its honest opinion on that plan, and its answer confirmed something I already suspected in the back of my mind: that a full backend build-out isn't the focus of this take-home.
- **Talking through architecture abstractly, without generating code.** I described the general architecture I had in mind and explicitly asked it to stay abstract rather than write code — a unidirectional data flow, layers separated by responsibility, and reusable components extracted where it made sense.
- **Cleaning up this README.** Technical writing is something I felt comfortable automating, so I used AI to help clean up formatting and wording here.
- **Quick syntax and documentation lookups.** Occasionally I used it in place of drilling into official docs for quick, low-stakes questions — e.g., when to use camelCase versus PascalCase — where a quick AI summary answered the question without needing to dig through the full documentation.
- **Final pass for outstanding issues, and requirements met** I fed the requirements to claude cowork, my git commit logs, as well as my project, and asked it to catch any gotchas, and verify requirments were completed. It found half a dozen minor issues that I cleaned up, which will show in the last set of commits I made on 9/21/2026.

## Unit Testing

- **Smoke testing** Need to give the full round on devices I have available (ios, android, and tvOS simulator)
- **Remote control navigation/focus** Need to make reusable component for focusable title cards, and add/remove button on home screen, and title details
- **Unit tests** Need to add unit tests. I can add around presentation layer easily. Tests for finding my list items, test for add/remove my list, and test for loading of home page
- **Unit testing** To show how the test suite would look, I made tests on the presentation layer for UI logic with asyncstateview. I also made a unit test on the domain layer with useTitleDetails to test business logic was firing as expected. If I had more time, I would add more tests, and I would move the string literals I'm using in unit tests to a constants file, instead of duplicate strings in unit test files, and the implementation classes.

## TODO's
- **Clean up linter errors, then warnings** Linter points out some clear issues with the `useEffect` and `loadData` approach I took. I'd look into solutions to lower re-renders if possible, extracting the sync from async part of load data. Not entirely sure, just need more time to be sure.
- **More device testing** I only had access to web, physical android, and virtual android tv. Setting the rest up was not something I had time for, so testing on multiple devices is limited.
- **UI** The UI is pretty bare bones. I would have liked to have centralized some colors, and typography like with material design. no in line styling if possible. I didn't have time to review this either.
- **Code per platform** It really would have been nice to have mobile controls vs tv controls. That just wasn't something I was able to get to, or even begin digging into.  