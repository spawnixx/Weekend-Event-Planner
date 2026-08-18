<a id="readme-top"></a>

<div align="center">
  <h1>Weekender</h1>

  <p>
    A collaborative event-planning platform that helps groups discover local events, vote on plans, and decide what to do together.
  </p>

  <p>
    <a href="https://github.com/spawnixx/Weekender"><strong>Explore the repository »</strong></a>
    <br />
    <br />
    <a href="https://github.com/spawnixx/Weekender/issues">Report a Bug</a>
    ·
    <a href="https://github.com/spawnixx/Weekender/issues">Request a Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About the Project</a>
      <ul>
        <li><a href="#key-features">Key Features</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#environment-variables">Environment Variables</a></li>
        <li><a href="#database-setup">Database Setup</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<h2>About the Project</h2>

Weekender makes planning group outings easier. Instead of juggling event links, group chats, and scattered opinions, users can organize everything in one place.

Users can create private groups, invite friends with a code or link, propose custom events, discover local events through Ticketmaster, and vote on which plans the group should attend. Event statuses help everyone see which ideas are still being considered, which have been confirmed, and which are closed.

Weekender was built as a full-stack capstone project to demonstrate secure authentication, relational database design, RESTful API development, third-party API integration, responsive interface design, and role-based authorization.

<h2>Key Features</h2>

Secure account registration, login, logout, and profile management

HTTP-only cookie authentication

Private groups with reusable invite codes and invite links

Owner and member roles with protected actions

Custom event proposals with date, location, image, and description details

Local event discovery through the Ticketmaster API

One vote per member per event, with support for yes and no votes

Proposed, confirmed, and closed event categories

Automatic handling of expired voting periods

Responsive UI built with Tailwind CSS and shadcn/ui

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<h2>Built With</h2>

<h3>Frontend</h3>

React

Vite

React Router

Tailwind CSS

shadcn/ui

React Hook Form

Zod

<h3>Backend</h3>

Node.js

Express

PostgreSQL

node-postgres

bcrypt

<h3>External Services</h3>

[Ticketmaster Discovery API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)

[Google Maps Platform](https://developers.google.com/maps/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<h2>Getting Started</h2>

Follow these steps to run Weekender locally.

<h3>Prerequisites</h3>

Install the following before continuing:

Node.js and npm

PostgreSQL

A Ticketmaster Developer API key

A Google Maps Platform API key

<h2>Installation</h2>

Clone the repository.

`git clone https://github.com/spawnixx/Weekender.git
cd Weekender`

Install the server dependencies.

`cd server
npm install`

Install the client dependencies.

`cd ../client
npm install`

<h3>Environment Variables</h3>

Create a .env file in the server directory and add the values required by your local configuration.

`DATABASE_URL=postgresql://username:password@localhost:5432/weekender
SESSION_SECRET=replace_with_a_secure_secret
TICKETMASTER_API_KEY=your_ticketmaster_api_key
CLIENT_URL=http://localhost:5173
PORT=3001`

Create a second .env file in the client directory for the Google Maps browser key.

`VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key`

Because Vite exposes variables prefixed with VITE_ to the browser, restrict the Google Maps key in Google Cloud by website domain and by the specific Maps APIs used by Weekender. Do not commit either .env file or expose unrestricted credentials in the repository.

<h2>Database Setup</h2>

Create a PostgreSQL database named weekender.

Run the project’s schema and seed files, if applicable.

Confirm that `DATABASE_URL` points to the correct local database.

<h3>Run the Application</h3>
Start the application concurrently with:

`npm run dev`

Open http://localhost:5173 in your browser. The Express API runs on http://localhost:3001 by default.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<h2>Usage</h2>

Create an account or log in.

Create a new planning group or join one with an invite code.

Propose a custom event or search for local events.

Review event details with the other group members.

Vote for or against proposed events.

Track proposals as they become confirmed or closed.

Group owners can manage membership and perform owner-only actions. Members can view group events and participate in voting.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<h2>Project Structure</h2>

```text
Weekender/
├── client/              # React frontend
│   └── src/
│       ├── components/  # Reusable UI and feature components
│       ├── context/     # Authentication state
│       ├── pages/       # Route-level views
│       └── schemas/     # Client-side validation
└── server/              # Express backend
    └── src/
        ├── controllers/ # Request handlers
        ├── middleware/  # Authentication and authorization
        ├── models/      # PostgreSQL queries and data access
        ├── routes/      # REST API routes
        └── schemas/     # Server-side validation
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

Roadmap

- [x] User registration and authentication

- [x] User profile management

- [x] Group creation and invite-code joining

- [x] Owner and member permissions

- [x] Custom event creation

- [x] Event voting

- [x] Event expiration handling

- [x] Complete Ticketmaster event-search experience

- [x] Add configurable group voting thresholds

- [x] Update event results in real time

- [x] Add event editing, cancellation, and deletion

- [X] Allow members to leave groups

- [x] Add map and calendar views

- [ ] Deploy the client, API, and database

See the [open issues](https://github.com/spawnixx/Weekender/issues) for proposed features and known issues.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

Contact

Gabriel Thornburgh

Email: Gabriel.thornburgh1@gmail.com

GitHub: github.com/spawnixx

LinkedIn: linkedin.com/in/gabrielthornburgh

Project: github.com/spawnixx/Weekender

<p align="right">(<a href="#readme-top">back to top</a>)</p>

Acknowledgments

[Ticketmaster Discovery API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)

shadcn/ui

Lucide

<p align="right">(<a href="#readme-top">back to top</a>)</p>
