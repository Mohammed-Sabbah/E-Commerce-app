### Project Overview:

*   **Name:** E-commerce App (Next.js)
*   **Purpose:** A full-stack e-commerce application.
*   **Frontend:** Next.js, React, TypeScript, Redux Toolkit, Tanstack Query, Tailwind CSS.
*   **Backend (Inferred):** The presence of `frontend/services/server` suggests a backend, likely Node.js or similar, exposing a RESTful API.
*   **Key Features (Inferred from file names):** User authentication (login, register, logout), product listing, cart management, wishlist, and checkout.

### Architectural Patterns/Conventions:

*   **Monorepo Structure (Potential):** The project root contains a `frontend` directory, which might imply a monorepo setup, though further investigation would be needed to confirm if a separate backend or other services exist in the same repository.
*   **State Management:** Redux Toolkit is used for global state management.
*   **Data Fetching:** Tanstack Query is used for server-side data fetching and caching.
*   **Styling:** Tailwind CSS is used for utility-first styling.
*   **API Interaction:** Services are separated for client-side (`frontend/services/client`) and server-side (`frontend/services/server`) interactions. `apiClient.ts` likely handles HTTP requests.
*   **Hooks:** Custom React hooks (e.g., `useLogin`, `useCart`) are used to encapsulate logic.