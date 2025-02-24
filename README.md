# Email & PDF Ingestion with Simple UI

## Overview

This is a Next.js application that allows users to configure email accounts via IMAP for automatic retrieval of emails with PDF attachments. The application downloads PDFs to a local folder (`./pdfs/`) and stores metadata in a PostgreSQL database using Prisma.

## Features

- Configure email accounts using IMAP.
- Automatically fetch emails containing PDF attachments.
- Download PDFs to a local directory (`./pdfs/`).
- Store metadata (sender, subject, date, filename) in PostgreSQL.
- Simple UI for managing email configurations.

## Tech Stack

- **Frontend**: Next.js (React, TypeScript, TailwindCSS)
- **Backend**: Bun, Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Email Retrieval**: IMAP

## Installation & Setup

### 1. Clone the Repository

```sh
git clone https://github.com/HarbingerOfTheEnd/Ingestify.git
cd Ingestify/
```

### 2. Install Dependencies

```sh
bun i
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root with the following:

```ini
DATABASE_URL=postgresql://user:password@localhost:5432/ingestify?schema=public
```

### 4. Set Up the Database

Upload Prisma models to database:

```sh
bunx prisma db push
```

### 5. Start the Development Server

```sh
bun --bun dev
```

Access the UI at: [http://localhost:3000](http://localhost:3000)

## Usage

### 1. Configure an IMAP Email Account

- Enter your IMAP server details, email, and password in the UI.
- Save the configuration to start fetching emails.

### 2. Check inbox

- Click `check inbox` button
- This will automatically load any new emails since the start of the server.
- After confirming the existence of PDFs in a mail, it will automatically download it.

### 3. Verify Downloads

- PDFs are saved in `./pdfs/`
- Metadata is stored in PostgreSQL.

## API Endpoints

### **Email Configuration Endpoints**

- `POST /api/email-ingestify/config` → Save IMAP email configuration.
- `GET /api/email-ingestify/config` → Retrieve stored email configurations.

### **Email Fetching**

- `GET /api/email-ingestify/fetch` → Trigger email fetching.

## Error Handling

- Logs errors for invalid credentials.
- Skips corrupt attachments but continues processing.

## Future Enhancements

- Add UI for manual email fetching.
- Encrypt stored credentials for better security.
- Implement background email polling.

## License

MIT License

## Author

R Sai Kumar
