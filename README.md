# Real-Time Communication Web Application

> A web application for real-time communication with friends, allowing users to connect through text messages and photo sharing. Built with a stack of Next.js, PostgreSQL, React, and Tailwind CSS, this app provides messaging experience, supporting both individual and group conversations. The platform uses WebSockets for live communication, ensuring instant message delivery and notifications.

![](https://res.cloudinary.com/dusxlxctj/image/upload/v1731336046/ig5ydz92irbhsb0d20bs.png)

## Features

- **User Registration and Authentication:** Users can sign up and securely log in to the platform with unique credentials.
- **Friend Management:** Add and manage friends and view the status of friends (online/offline/ do not disturb).
- **Private and Group Conversations:** Create individual chats or group conversations, enabling text and photo exchange among friends.
- **Real-Time Messaging:** Messages and photos are delivered instantly using WebSocket technology, allowing for a smooth and live communication experience.

### Installation

1. **Clone the repository**:

```bash
https://github.com/Matl3us/Messaging-App
cd Messaging-App
```

2.  **Install NPM packages**

```bash
npm install
```

3. **Set up environment variables**

```bash
DATABASE_URL = <database connection string>
SECRET = <secret for password hashing>
```

4. **Create database migration with Prisma**

```bash
npx prisma migrate deploy
```

5. **Start the app**

```bash
npm run dev
```
