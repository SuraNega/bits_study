# Project Overview

This project is a web application called "Study Crew", designed to connect students with teaching assistants. It consists of a Ruby on Rails backend and a React frontend.

## Backend (study_crew-main)

*   **Technology:** Ruby on Rails 8
*   **Database:** SQLite3
*   **API:** RESTful JSON API
*   **Authentication:** `bcrypt` for password hashing.
*   **Testing:** RSpec, Capybara, FactoryBot, Faker, and Shoulda-matchers.

### Building and Running

**1. Install Dependencies:**

```bash
bundle install
```

**2. Database Setup:**

```bash
rails db:migrate
rails db:seed
```

**3. Run the Server:**

```bash
rails server
```

### Development Conventions

*   The project uses `rubocop-rails-omakase` for code styling.
*   Tests are written with RSpec and are located in the `spec` directory.
*   The project uses `dotenv-rails` for managing environment variables. A `.env` file is needed in the root of the backend project.

## Frontend (study-crew-frontend-main)

*   **Technology:** React, TypeScript, Vite
*   **Styling:** Tailwind CSS with `@shadcn/ui` components.
*   **Routing:** `react-router-dom`

### Building and Running

**1. Install Dependencies:**

```bash
npm install
```

**2. Run the Development Server:**

```bash
npm run dev
```

**3. Build for Production:**

```bash
npm run build
```

### Development Conventions

*   The project uses `eslint` for code linting.
*   Components are located in the `src/components` directory.
*   Pages are located in the `src/pages` directory.
