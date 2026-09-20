# StreamShelf

Take-home project for The Weather Channel.

## Architecture

Going for unidirectional data flow by separating presentation, domain, and data:

- The presentation layer should only have access to the domain layer.
- The domain layer should only have access to the data layer.
- Presentation should never touch files in the data layer directly.

In presentation, screens cover full views, and components are extracted wherever a view is reusable. Expo Router is used, and the `src/app` folder just holds routes that handle routing, and import from `presentation/screens` for the full views.

Given time constraints, no built-in tvOS/Fire TV testing, and a limited number of application screens, no tab bar navigation will be used. Instead, an inline link will exist on the home screen to navigate to My List. In a production environment, My List would live in a tab control, and we'd use native tabs for mobile platforms, JS tabs for web, and need more research for set-top devices (Fire TV, smart TVs, etc.).

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
