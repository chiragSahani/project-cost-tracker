
# 💰 Project Cost Tracker

A modern web application to manage and track project-related expenses — including items and other costs — built with **React**, **Redux**, **Chakra UI**, and **Supabase**.


[![GitHub Repo](https://img.shields.io/github/stars/chiragSahani/project-cost-tracker?style=social)](https://github.com/chiragSahani/project-cost-tracker)

🔗 **Live Demo**: [project-cost-tracker0.netlify.app](https://project-cost-tracker0.netlify.app/)  
📦 **GitHub Repo**: [github.com/chiragSahani/project-cost-tracker](https://github.com/chiragSahani/project-cost-tracker)

---

## 🚀 Features

- 🔐 Supabase Authentication (Sign up / Login)
- ➕ Add / 🗑️ Delete Items and Costs
- 📊 Live Total Project Cost
- 🗂️ Redux Toolkit for state
- 🎨 Chakra UI theming
- ☁️ Supabase backend (PostgreSQL)
- 💾 LocalStorage (auth persistence)
- 🧪 TypeScript support
- 📱 Fully responsive design

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TypeScript
- **Styling**: Chakra UI
- **State Management**: Redux Toolkit
- **Backend**: Supabase (Auth + DB)
- **Build Tool**: Vite
- **Deployment**: Netlify

---

## 📁 Folder Structure

```bash
project-cost-tracker/
│
├── public/
│
├── src/
│   ├── components/
│   │   └── Layout.tsx
│   ├── lib/
│   │   └── supabaseClient.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Items.tsx
│   │   ├── OtherCosts.tsx
│   │   ├── Login.tsx
│   │   ├── SignUp.tsx
│   │   └── NotFound.tsx
│   ├── store/
│   │   └── authSlice.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── theme.ts
│   └── index.css
│
├── supabase/
│   └── migrations/
│       ├── 20250521091003_shiny_tower.sql
│       └── 20250521091144_fierce_feather.sql
│
├── package.json
├── postcss.config.js
├── vite-env.d.ts
└── index.html
````

---

## 🧪 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/chiragSahani/project-cost-tracker.git
cd project-cost-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Supabase

Replace the credentials in:

```ts
// src/lib/supabaseClient.ts
export const supabase = createClient(
  'https://your-project-id.supabase.co',
  'your-anon-public-key'
);
```

### 4. Run Locally

```bash
npm run dev
```

---

## 🧾 Supabase SQL Schema

Here are the SQL schemas from your `supabase/migrations`:

```sql
-- Items Table
CREATE TABLE items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  cost numeric NOT NULL,
  created_at timestamp DEFAULT now()
);

-- Other Costs Table
CREATE TABLE other_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  label text NOT NULL,
  amount numeric NOT NULL,
  created_at timestamp DEFAULT now()
);
```

You can find these in:

```
supabase/migrations/
├── 20250521091003_shiny_tower.sql
├── 20250521091144_fierce_feather.sql
```

---





