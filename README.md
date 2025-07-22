# CalTrack CRM: Next.js & Genkit Sales Pipeline Manager

Welcome to CalTrack CRM! This is a comprehensive Customer Relationship Management (CRM) application designed to manage the entire sales lifecycle, from lead generation and opportunity tracking to contract and invoice management. It's built on a modern tech stack including Next.js, Tailwind CSS, ShadCN for UI components, and Google's Genkit for powerful AI-driven features like lead scoring.

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **Generative AI**: [Genkit (Google)](https://firebase.google.com/docs/genkit)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

*   **Node.js**: Version 18.x or later is recommended. You can download it from [nodejs.org](https://nodejs.org/).
*   **NPM** or **Yarn**: These package managers come bundled with Node.js.

## Getting Started

Follow these steps to get your local development environment up and running.

### 1. Install Dependencies

Once you have downloaded the project files, navigate to the root directory of the project in your terminal and run the following command to install all the required packages:

```bash
npm install
```

### 2. Set Up Environment Variables

This project uses Google's Generative AI for its AI-powered features. To use them, you'll need a Gemini API key.

1.  Create a new file named `.env.local` in the root of your project directory.
2.  Obtain a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).
3.  Add the key to your `.env.local` file like this:

    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```

    Replace `YOUR_GEMINI_API_KEY_HERE` with the actual key you obtained.

### 3. Run the Development Servers

This project requires two separate development servers to run concurrently: one for the Next.js web application and another for the Genkit AI flows.

*   **To start the Next.js application:**
    Open a terminal and run:
    ```bash
    npm run dev
    ```
    Your application will be available at `http://localhost:9002`.

*   **To start the Genkit development server:**
    Open a *second* terminal and run:
    ```bash
    npm run genkit:dev
    ```
    This server manages the AI flows and tools. You can view the Genkit developer UI at `http://localhost:4000`.

### 4. Build for Production

When you are ready to create a production build of the application, run the following command:

```bash
npm run build
```

This will create an optimized build of your Next.js application in the `.next` directory. To run the production server, use `npm start`.

---

Congratulations on completing the prototype! I hope this guide is helpful for your next steps. If you have any more questions, feel free to ask.