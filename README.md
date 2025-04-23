# NgTalkApp 🗨️

NgTalkApp is a real-time group chat application built with Angular. It features complete user authentication, a modular and scalable architecture, and real-time communication via WebSockets.

---

## Features

- 🔐 **Authentication** — User login and registration with token-based session handling.
- 💬 **Group Chat** — Join chat groups using a shared code and communicate in real time.
- 🌐 **WebSocket Communication** — Bidirectional messaging using RxJS-based WebSocket services.
- 🎨 **Modern UI** — Responsive and accessible design using PrimeNG component library.
- 🧩 **Scalable Structure** — Modular Angular architecture for easy maintenance and feature expansion.

---

## Tech Stack

- **Framework**: Angular
- **UI Library**: PrimeNG
- **Real-time Messaging**: WebSockets (RxJS)
- **Auth**: JWT-based authentication
- **Java API**: [GigaChat](https://github.com/Wojtur28/GigaChat)

---

## To-Do

- internationalization
- file sharing and media messages

---

## Installation

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```
