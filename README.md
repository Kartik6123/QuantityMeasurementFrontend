# 🚀 QuantaConvert – Smart Quantity Measurement App

QuantaConvert is a modern, lightweight, and intuitive **quantity measurement and conversion web app** designed with a clean modular architecture. It allows users to seamlessly convert between units, manage sessions, and interact with a responsive dashboard — all powered by pure frontend technologies.

---

## ✨ Features

* 🔐 **Authentication System**
  Secure login & signup using local storage simulation.

* 🔄 **Real-Time Unit Conversion**
  Fast and accurate conversions powered by a dedicated conversion engine.

* 📊 **Interactive Dashboard**
  Clean UI with dynamic switching between measurement types and modes.

* 💾 **Local Storage Integration**
  Stores users, sessions, and conversion history without backend dependency.

* ⚡ **SPA-like Navigation**
  Smooth routing experience without page reloads.

---

## 🧠 Project Architecture

```
quantaconvert/
├── index.html              # Entry point, loads and routes the app
├── css/
│   ├── variables.css       # Global styles, design tokens, animations
│   ├── auth.css            # Login & signup styling
│   └── dashboard.css       # Dashboard layout and components
├── js/
│   ├── storage.js          # Handles localStorage (users, session, history)
│   ├── converter.js        # Core conversion logic (pure functions)
│   ├── auth.js             # Authentication logic (login/signup/logout)
│   ├── dashboard.js        # UI logic and state management
│   └── router.js           # Handles navigation between pages
└── pages/
    ├── login.html          # Login UI markup
    ├── signup.html         # Signup UI markup
    └── dashboard.html      # Dashboard UI markup
```
## ⭐ Final Note

This project reflects strong fundamentals in **frontend architecture, state management, and modular JavaScript design** — making it a solid base for scaling into a full-stack production-ready application.

---

✨ *Convert smarter. Build better. Grow faster.*
