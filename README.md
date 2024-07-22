# CarePulse

CarePulse is a comprehensive patient management application that allows users to register as patients, book appointments with doctors, and receive real-time SMS notifications about updates. The backend admin system provides functionalities to monitor, schedule, and cancel appointments. This project leverages Next.js, Tailwind CSS, TypeScript, and Firebase for a robust and scalable solution.

## Table of Contents

- [CarePulse](#carepulse)
	- [Table of Contents](#table-of-contents)
	- [Features](#features)
	- [Tech Stack](#tech-stack)
	- [Installation](#installation)
		- [Prerequisites](#prerequisites)
		- [Setup](#setup)
	- [Usage](#usage)
	- [Environment Variables](#environment-variables)
		- [Contributing](#contributing)
		- [License](#license)
			- [Made with ❤️ by (Gaurav Jha)](#made-with-️-by-gaurav-jha)

## Features

- **User Registration**: Patients can register and manage their profiles.
- **Appointment Booking**: Book appointments with doctors easily.
- **Admin Dashboard**: Backend system for admins to monitor, schedule, and cancel appointments.
- **Real-time SMS Notifications**: Get updates about appointments through Twilio SMS notifications.
- **Responsive Design**: Optimized for all devices using Tailwind CSS.

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, TypeScript
- **Backend**: Firebase
- **Notifications**: Twilio

## Installation

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js
- Firebase account
- Twilio account

### Setup

1. #### Clone the repository:

   ```sh
   git clone https://github.com/yourusername/carepulse.git
   cd carepulse
   ```

2. #### Install dependencies

   ```sh
   npm install
   ```

3. #### Set up Firebase:

   - Create a Firebase project.
   - Add a new web app to your Firebase project.
   - Copy the Firebase config and add it to your environment variables.

4. #### Set up Twilio:

   - Create a Twilio account and get your Account SID and Auth Token.
   - Purchase a Twilio phone number for sending SMS.

## Usage

First, run the development server:

```sh
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Environment Variables

Create a .env.local file in the root directory and add the following variables:

```dotenv
	NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
	NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
	NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
	NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
	NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
	NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

	TWILIO_ACCOUNT_SID=your_twilio_account_sid
	TWILIO_AUTH_TOKEN=your_twilio_auth_token
	TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

### License

Distributed under the MIT License. See LICENSE for more information.

#### Made with ❤️ by ([Gaurav Jha](https://www.linkedin.com/in/grvx/))
