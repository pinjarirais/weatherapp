import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ Backend env check
if (!process.env.OPENWEATHER_API_KEY) {
  console.warn("⚠️ OPENWEATHER_API_KEY missing in .env");
}
if (!process.env.SUPABASE_URL) {
  console.warn("⚠️ SUPABASE_URL missing in .env");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY missing in .env");
}

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SERVICE KEY starts:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20));


// ✅ Supabase Admin Client (SERVICE ROLE KEY)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
    },
  }
);

// ✅ Health check (important)
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend is running ✅" });
});

// ✅ Fetch Weather + Save to DB
app.get("/api/weather", async (req, res) => {
  try {
    const city = (req.query.city || "").toString().trim();

    if (!city) {
      return res.status(400).json({ error: "city query parameter is required" });
    }

    if (!process.env.OPENWEATHER_API_KEY) {
      return res.status(500).json({ error: "OPENWEATHER_API_KEY not configured" });
    }

    // ✅ Call OpenWeather API
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )},IN&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;

    const apiRes = await fetch(weatherUrl);

    const apiData = await apiRes.json();

    // console.log("Weather URL:", weatherUrl);


    if (!apiRes.ok) {
      return res.status(apiRes.status).json({
        error: apiData?.message || "Failed to fetch weather",
      });
    }

    // ✅ Extract fields
    const payload = {
      city_name: apiData?.name || city,
      country: apiData?.sys?.country || "IN",
      description: apiData?.weather?.[0]?.description || "",
      temperature: apiData?.main?.temp ?? null,
      humidity: apiData?.main?.humidity ?? null,
      timezone: apiData?.timezone ?? null,
    };

    // ✅ Insert into DB
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("weather_logs")
      .insert(payload)
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({
        error: "DB insert failed",
        details: insertError.message,
      });
    }

    // ✅ Return response
    return res.json({
      success: true,
      weather: inserted,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

// ✅ Get last 10 weather logs by city
app.get("/api/history", async (req, res) => {
  try {
    const city = (req.query.city || "").toString().trim();

    if (!city) {
      return res.status(400).json({ error: "city query parameter is required" });
    }

    const { data, error } = await supabaseAdmin
      .from("weather_logs")
      .select("*")
      .ilike("city_name", city)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, history: data || [] });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
