# Candidate Tracking System

A Next.js application that automates the processing of job candidate emails from Wellfound (formerly AngelList Talent). The system automatically processes emails, extracts candidate information, scores candidates based on predefined criteria, and stores the data in Airtable.

## Features

- 🔄 Automatic email processing from Gmail using Pica AI SDK
- 📊 Intelligent candidate scoring system (0-100) based on predefined criteria:
  - AI/LLM Experience (30 points)
  - Python Experience (20 points)
  - Additional Programming Languages (20 points)
  - TypeScript Experience (10 points)
  - Years of Experience (20 points)
- 📝 Extracts candidate details including:
  - Name, Email, Location
  - LinkedIn Profile Link
  - Resume Link
  - Current Company and Title
  - Education details (School, Degree)
  - Skills
  - Job Search Status
- 🏷️ Automatic email labeling with "Wellfound Candidate found"
- 📋 Airtable integration for candidate data storage
- ⚡ Real-time processing status updates
- 📱 Responsive UI with progress tracking
- 🔍 Smart parsing of HTML/CSS content from email templates

## Tech Stack

- Next.js 14
- TypeScript
- OpenAI GPT-4
- Pica AI SDK
- Gmail API (via Pica)
- Airtable API
- TailwindCSS

## Environment Variables

The following environment variables are required:

```env
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_GMAIL_CONNECTION_KEY=your_gmail_connection_key
NEXT_PUBLIC_PICA_SECRET_KEY=your_public_pica_key
AIRTABLE_BASE_ID=your_airtable_base_id
AIRTABLE_TABLE_ID=your_airtable_table_id
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables in `.env`
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Click "Load Emails" to fetch unprocessed candidate emails from Gmail
2. The system will automatically process each email:
   - Extract candidate information from email content
   - Parse HTML/CSS content to find relevant details
   - Score the candidate based on predefined criteria
   - Label the email as "Wellfound Candidate found"
   - Store candidate data in Airtable
3. Use the "Next Email" button to manually trigger processing of the next email
4. Monitor progress through the status bar at the top of the page

## Email Processing Details

The system specifically looks for emails with the subject line "is interested in Software Engineer (Integrations) at Pica" that haven't been labeled as "Wellfound Candidate found". It extracts:

- LinkedIn Profile Link: Looks for URLs starting with "https://url" and containing "wellfound.com/ls/click"
- Resume Link: Similar URL pattern for resume/CV links
- Work Experience: Extracts current company and title from the "Work" section
- Location: Parsed from the email body
- Education: School and degree information
- Skills: Technical skills and experience

## Scoring System

Candidates are scored out of 100 points based on the following criteria:

1. AI/LLM Experience (30 points):
   - Experience with LLM, LangChain, CrewAI, Generative AI, or similar technologies

2. Python Experience (20 points):
   - Core requirement for the role

3. Additional Programming Languages (20 points):
   - Experience with Rust or Scala

4. TypeScript Experience (10 points):
   - Secondary requirement for the role

5. Years of Experience (20 points):
   - More than 3 years of software development experience

## License

MIT License
