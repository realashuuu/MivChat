MivChat 💬

A full-stack real-time chat application built using the MERN stack and Socket.IO. MivChat allows users to communicate instantly, share images, see online users, and manage their profiles through a clean and responsive interface.

🚀 Features
* User Authentication: Secure signup and login using JWT and bcrypt.
* Real-Time Messaging: Instant communication using Socket.IO.
* Online Status: See which users are currently online.
* Image Sharing: Send and receive images through Cloudinary.
* User Profiles: View and update profile information.
* Message Status: Track seen and unseen messages.
* Responsive Interface: Clean and user-friendly chat experience.

🛠️ Tech Stack

Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router
* Socket.IO Client
* React Hot Toast

Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* JSON Web Token (JWT)
* bcryptjs
* Cloudinary

📁 Project Structure

MivChat/
│
├── client/          # React frontend
│
├── server/          # Node.js and Express backend
│
├── .gitignore
└── README.md

Getting Started

Clone the repository:

git clone https://github.com/realashuuu/MivChat.git
cd MivChat

Install dependencies:

cd server && npm install
cd ../client && npm install

Configure the required environment variables in the server/.env and client/.env files.

Start the backend:

cd server
npx nodemon server.js

Start the frontend in a separate terminal:

cd client
npm run dev


🔐 Environment Variables

Configure the following services before running the application:

* MongoDB Atlas – Database connection.
* JWT – Authentication secret.
* Cloudinary – Image upload and storage.
* Backend port – Application server configuration.

Important: Never upload your .env files or expose private API keys and credentials on GitHub.

👨‍💻 Author

Aashiq Khan

GitHub: @realashuuu

⸻

⭐ If you like this project, consider giving it a star!
