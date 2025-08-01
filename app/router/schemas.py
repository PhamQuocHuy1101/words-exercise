from pydantic import BaseModel
from typing import Optional

class TopicBase(BaseModel):
    name: str

class TopicCreate(TopicBase):
    pass

class TopicOut(TopicBase):
    id: int
    name: str
    class Config:
        from_attributes = True

class WordBase(BaseModel):
    english: str
    vietnamese: Optional[str] = None
    note: Optional[str] = None

class WordCreate(WordBase):
    topic_id: int

class WordOut(WordBase):
    id: int
    class Config:
        from_attributes = True

class WordUpdate(BaseModel):
    english: str
    vietnamese: Optional[str] = None
    note: Optional[str] = None
