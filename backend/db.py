import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Render inyectará DATABASE_URL como variable de entorno
DATABASE_URL = os.getenv("postgresql://root:zn8Wzoq0m8iQJvHBc1CsKsASiRkyvwVj@dpg-d8jj804m0tmc73fch5sg-a.oregon-postgres.render.com/cv_prueba")

engine = create_engine(DATABASE_URL, future=True, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
