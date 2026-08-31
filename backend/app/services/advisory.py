"""
Turns a raw price trend into a short, farmer-friendly natural-language
advisory message using an LLM. Falls back to a templated message if no
API key is set or the call fails — NEVER let this crash the demo.
"""
import os

USE_LLM = bool(os.getenv("GEMINI_API_KEY"))

if USE_LLM:
    import google.generativeai as genai
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


def _fallback_message(commodity: str, direction: str, pct: float) -> str:
    if direction == "up":
        return (
            f"{commodity} prices are trending up ({pct}% over the last week). "
            f"If you have storage available, consider holding for a few more days."
        )
    elif direction == "down":
        return (
            f"{commodity} prices are trending down ({abs(pct)}% over the last week). "
            f"Consider selling soon to avoid further price drops."
        )
    return (
        f"{commodity} prices are stable this week. "
        f"Selling now or in the next few days should give a similar return."
    )


def generate_advisory(commodity: str, direction: str, pct: float) -> str:
    if not USE_LLM:
        return _fallback_message(commodity, direction, pct)

    prompt = (
        f"You are an agricultural market advisor for Indian farmers. "
        f"The commodity '{commodity}' has a price trend of {pct}% ({direction}) "
        f"over the last 7 days compared to the previous 7 days. "
        f"Write ONE short, plain-language, encouraging sentence (max 30 words) "
        f"telling the farmer whether to sell now or consider waiting. "
        f"No jargon, no disclaimers, just direct practical advice."
    )
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        text = response.text.strip()
        return text if text else _fallback_message(commodity, direction, pct)
    except Exception:
        # Live demo safety net: never let an API hiccup break the screen
        return _fallback_message(commodity, direction, pct)
