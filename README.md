# **Gdrive Integration POC**

## **About the Project**  
**Gdrive Integration POC** is a project built with **Nest.js** for google drive integration

---

## **Getting Started**

### 1️⃣ Clone the Repository  

### 2️⃣ Configure GCP
 Create oauth client in gcp
 get the client secret and client id
 **Important** Give permission for drive api in gcp console

### 3️⃣ Configure .env
```bash
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 3️⃣ Docker
This will run both the api and processor services

### 4️⃣ Frontend
```bash
cd frontend
npm install
npm run dev
```

### P.S 
Install node modules separately for each service and frontend