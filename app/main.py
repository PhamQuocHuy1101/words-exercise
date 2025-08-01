import os
import sys
import random
from dotenv import load_dotenv
load_dotenv(override=True)

from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.router import schemas, route
from app.service import exercise
from app.database.connector import SessionLocal, engine, Base
from app.database import models

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.mount("/static", StaticFiles(directory="app/static"), name="static")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/topics/")
async def get_all_topic(db: Session = Depends(get_db)):
    return db.query(models.Topic).order_by(models.Topic.id.desc()).all()

@app.post("/topics/", response_model=schemas.TopicOut)
async def create_topic(topic: schemas.TopicCreate, db: Session = Depends(get_db)):
    return route.create_topic(db, topic)

@app.delete("/topics/{topic_id}")
async def delete_topic(topic_id: int, db: Session = Depends(get_db)):
    route.delete_topic(db, topic_id)
    return {"message": "Deleted"}

@app.get("/words/")
async def get_all_words(db: Session = Depends(get_db)):
    return db.query(models.Word).all()

@app.post("/words/", response_model=schemas.WordOut)
async def add_word(word: schemas.WordCreate, db: Session = Depends(get_db)):
    return route.add_word(db, word)

@app.delete("/words/{word_id}")
async def delete_word(word_id: int, db: Session = Depends(get_db)):
    route.delete_word(db, word_id)
    return {"message": "Deleted"}

@app.put("/words/{word_id}")
def update_word(word_id: int, word: schemas.WordUpdate, db: Session = Depends(get_db)):
    route.update_word(db, word_id, word)
    return {"message": "Updated"}


@app.post("/exercise/", response_model=schemas.WordOut)
def get_random_word(topic_ids: list[int], db: Session = Depends(get_db)):
    query = db.query(models.Word).filter(models.Word.topic_id.in_(topic_ids)).all()
    print(len(query))
    if not query:
        raise HTTPException(status_code=404, detail="No words found for selected topics")
    random.shuffle(query)
    return query[0]