from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.connector import Base

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    name = Column(String(255), unique=True, nullable=False)
    words = relationship("Word", back_populates="topic", cascade="all, delete")

class Word(Base):
    __tablename__ = "words"

    id = Column(Integer, primary_key=True, autoincrement=True)
    english = Column(String(255), nullable=False)
    vietnamese = Column(String(255))
    note = Column(Text)
    topic_id = Column(Integer, ForeignKey("topics.id"))

    topic = relationship("Topic", back_populates="words")
