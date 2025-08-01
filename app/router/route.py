from sqlalchemy.orm import Session
from app.database import models
from app.router import schemas
import random

def create_topic(db: Session, topic: schemas.TopicCreate):
    db_topic = models.Topic(name=topic.name)
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    return db_topic

def delete_topic(db: Session, topic_id: int):
    db_topic = db.get(models.Topic, topic_id)
    if db_topic:
        db.delete(db_topic)
        db.commit()

def add_word(db: Session, word: schemas.WordCreate):
    db_word = models.Word(**word.dict())
    db.add(db_word)
    db.commit()
    db.refresh(db_word)
    return db_word

def delete_word(db: Session, word_id: int):
    db_word = db.get(models.Word, word_id)
    if db_word:
        db.delete(db_word)
        db.commit()

def update_word(db: Session, word_id, word):
    db_word = db.query(models.Word).filter(models.Word.id == word_id).first()
    if db_word:
        db_word.english = word.english
        db_word.vietnamese = word.vietnamese
        db_word.note = word.note

        db.commit()
        db.refresh(db_word)

def get_random_word(db: Session, topic_id: int = None):
    query = db.query(models.Word)
    if topic_id:
        query = query.filter(models.Word.topic_id == topic_id)
    words = query.all()
    return random.choice(words) if words else None
