from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import pytest
import models
import schemas

SQLALCHEMY_DATABASE_URL = "sqlite:///./back-end/sql_app/test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionTest = sessionmaker(autocommit=False, autoflush=False, bind=engine)

db = SessionTest()
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)


def test_user_creation():