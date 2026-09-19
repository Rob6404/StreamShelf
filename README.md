# StreamShelf

Take-home project for The Weather Channel.

## Architecture

Going for unidirectional data flow by separating presentation, domain, and data:

- The presentation layer should only have access to the domain layer.
- The domain layer should only have access to the data layer.
- Presentation should never touch files in the data layer directly.

In presentation, screens cover full views, and components are extracted wherever a view is reusable.

Given time constraints, no built in tvOS/Fire TV, and limited number of application screens, no tab bar navigation will be used. Instead an inline link will exist on homescreen to navigate to the MyList. In a production environment, MyList would live in a tab control, and we'd use native-tabs for the mobile platforms, JS tabs for web, and need more research for table top devices (Fire TV, smart TV etc).

## AsyncStateView

`AsyncStateView` is a view that renders the states needed during async calls: loading, loaded, empty, and error.

This centralizes the states that all the full views go through, since they're pretending to fetch data and should handle errors the same way across screens. Props are exposed to override the default loading, empty, or error state where a screen needs something other than what `AsyncStateView` provides out of the box.

## AsyncStorageProvider

`AsyncStorageProvider` keeps the dependency on a persistence library out of the domain layer and inside the data layer. That way, if the underlying storage library ever changes, the change is centralized in one place instead of touching every hook in the domain layer that reads or writes persisted data.

## Data source

`catalogDataSource` is hardcoded for now.

If the goal of this take-home were to show full-stack work, I'd have made this a REST API call instead — potentially with Docker Compose spinning up a relational database (e.g. Postgres) and a Node.js REST API with a formal contract. The model from that contract could then be shared with the frontend as shared code, which is one of the real benefits of a Node.js backend. That's a direction I'd genuinely enjoy building out, but I know it's beside the point of a project geared toward CTV + React Native. :)
