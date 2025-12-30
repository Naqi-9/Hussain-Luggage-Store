# Supabase Setup Guide for Hussain Luggage Store

This guide will help you set up Supabase to manage your products database instead of using `productdata.js`.

## 📋 Table of Contents
1. [Create Supabase Account](#1-create-supabase-account)
2. [Create Database Table](#2-create-database-table)
3. [Configure Your Project](#3-configure-your-project)
4. [Upload Your Products](#4-upload-your-products)
5. [Testing](#5-testing)
6. [Adding New Products](#6-adding-new-products)

---

## 1. Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" (it's free!)
3. Sign up with GitHub, Google, or email
4. Create a new project:
   - **Name**: Hussain Luggage Store (or any name you prefer)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free tier is sufficient

5. Wait 2-3 minutes for project to be created

---

## 2. Create Database Table

### Step 1: Open SQL Editor

1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**

### Step 2: Create Products Table

Copy and paste this SQL code into the SQL Editor:

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  base_price INTEGER NOT NULL DEFAULT 0,
  brand TEXT,
  category TEXT,
  description TEXT,
  colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  sizes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read products (public access)
CREATE POLICY "Allow public read access" ON products
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert/update/delete (for admin panel later)
CREATE POLICY "Allow authenticated insert" ON products
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON products
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON products
  FOR DELETE
  USING (auth.role() = 'authenticated');
```

3. Click **"Run"** (or press Ctrl/Cmd + Enter)
4. You should see "Success. No rows returned"

---

## 3. Configure Your Project

### Step 1: Get Your API Credentials

1. In Supabase dashboard, go to **"Settings"** (gear icon)
2. Click **"API"** in the left sidebar
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

### Step 2: Update Configuration File

1. Open `supabase-config.js` in your project
2. Replace the placeholder values:

```javascript
const SUPABASE_CONFIG = {
  url: 'https://xxxxx.supabase.co', // Paste your Project URL here
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Paste your anon key here
};
```

3. Save the file

---

## 4. Upload Your Products

### Method 1: Using Supabase Dashboard (Easiest)

1. Go to **"Table Editor"** in Supabase dashboard
2. Click on **"products"** table
3. Click **"Insert row"** button
4. Fill in the fields:

**Example Product Entry:**

- **name**: `American Tourister Backpack`
- **base_price**: `7000`
- **brand**: `American Tourister`
- **category**: `null` (or leave empty)
- **description**: `Durable, scratch-resistant hard-shell luggage with 360-degree spinner wheels.`
- **colors**: Click the JSON editor and paste:
```json
[
  {
    "name": "Black",
    "code": "#000000",
    "available": true,
    "image": "assets/product images/American Tourister/Backpack Black.webp"
  }
]
```

- **sizes**: (Optional) Click JSON editor and paste:
```json
[
  { "label": "Small (20\")", "price": 7000 },
  { "label": "Medium (24\")", "price": 18000 },
  { "label": "Large (28\")", "price": 22000 },
  { "label": "Set of 3", "price": 48000 }
]
```

5. Click **"Save"**
6. Repeat for all your products

### Method 2: Using SQL (Faster for bulk import)

1. Go to **"SQL Editor"**
2. Use this template for each product:

```sql
INSERT INTO products (name, base_price, brand, category, description, colors, sizes)
VALUES (
  'American Tourister Backpack',
  7000,
  'American Tourister',
  NULL,
  'Durable, scratch-resistant hard-shell luggage with 360-degree spinner wheels.',
  '[
    {
      "name": "Black",
      "code": "#000000",
      "available": true,
      "image": "assets/product images/American Tourister/Backpack Black.webp"
    }
  ]'::jsonb,
  '[
    {"label": "Small (20\")", "price": 7000},
    {"label": "Medium (24\")", "price": 18000},
    {"label": "Large (28\")", "price": 22000},
    {"label": "Set of 3", "price": 48000}
  ]'::jsonb
);
```

### Method 3: Export from Current productdata.js (Recommended)

I'll create a migration script for you. Run this in browser console on your current site:

1. Open your website
2. Press F12 (open DevTools)
3. Go to Console tab
4. Paste this migration script (I'll provide it separately)

---

## 5. Testing

1. Open `index.html` in your browser
2. Open DevTools (F12) → Console tab
3. You should see products loading
4. If you see errors:
   - Check `supabase-config.js` has correct credentials
   - Check products exist in Supabase table
   - Check browser console for specific error messages

---

## 6. Adding New Products

### Through Supabase Dashboard:

1. Go to Supabase → **Table Editor** → **products**
2. Click **"Insert row"**
3. Fill in all fields (see format above)
4. Click **Save**

**That's it!** Your website will automatically show the new product (refresh the page).

### Product Data Format:

**Colors JSON Format:**
- **Single image**: `{"name": "Red", "code": "#DC143C", "available": true, "image": "path/to/image.jpg"}`
- **Multiple images**: `{"name": "Red", "code": "#DC143C", "available": true, "images": ["img1.jpg", "img2.jpg", "img3.jpg"]}`

**Sizes JSON Format (Optional):**
```json
[
  {"label": "Small (20\")", "price": 7000},
  {"label": "Medium (24\")", "price": 18000}
]
```

---

## 🔒 Security Notes

- The `anon key` is safe to use in frontend code (it's public)
- Row Level Security (RLS) is enabled - only public can read, authenticated users can modify
- Never share your `service_role` key (it has admin access)

---

## 📸 Uploading Product Images

Currently, images are stored in your project's `assets/product images/` folder.

**Options for future:**
1. **Supabase Storage** (free tier: 1GB)
   - Upload images to Supabase Storage
   - Get public URLs
   - Use URLs in product colors

2. **Cloudinary/ImgBB** (external image hosting)
   - Free tiers available
   - Upload images there
   - Use URLs in product colors

3. **Keep current setup** (images in project folder)
   - Works fine for now
   - Just ensure image paths in database match your file structure

---

## 🆘 Troubleshooting

**Products not loading?**
- Check browser console for errors
- Verify Supabase credentials in `supabase-config.js`
- Check products exist in Supabase table
- Ensure RLS policies are correct (public read access enabled)

**CORS errors?**
- Supabase handles CORS automatically, but check if your Supabase URL is correct

**Need help?**
- Supabase Discord: https://discord.supabase.com
- Supabase Docs: https://supabase.com/docs

---

## ✅ Next Steps

1. ✅ Set up Supabase account
2. ✅ Create products table
3. ✅ Add your products
4. ⏭️ Set up image storage (optional)
5. ⏭️ Create admin panel for easy product management (future enhancement)

