from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import prices, lots, matches

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SIH26132 - Market Linkage & Price Discovery API")

# Wide-open CORS for the hackathon demo - tighten this if you ever deploy for real
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prices.router)
app.include_router(lots.router)
app.include_router(matches.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "SIH26132 backend"}
