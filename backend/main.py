from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from db import SessionLocal, Base, engine
from models import Contact
from schemas import ContactCreate, ContactUpdate, ContactOut

# Crea las tablas si aún no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CV‑CRUD API",
    description="Endpoints para crear, leer, actualizar y borrar contactos.",
    version="1.0.0"
)

# ---------- CORS ----------
origins = ["https://ingeniuridev.github.io"]   # solo permite tu sitio
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Dependencia de DB ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------- CREATE ----------
@app.post("/contacts", response_model=ContactOut)
def create_contact(payload: ContactCreate, db: Session = Depends(get_db)):
    db_contact = Contact(**payload.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

# ---------- READ ----------
@app.get("/contacts", response_model=list[ContactOut])
def list_contacts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Contact).offset(skip).limit(limit).all()

# ---------- UPDATE ----------
@app.put("/contacts/{contact_id}", response_model=ContactOut)
def update_contact(contact_id: int, payload: ContactUpdate, db: Session = Depends(get_db)):
    contact = db.get(Contact, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contacto no encontrado")
    for key, value in payload.dict(exclude_unset=True).items():
        setattr(contact, key, value)
    db.commit()
    db.refresh(contact)
    return contact

# ---------- DELETE ----------
@app.delete("/contacts/{contact_id}", status_code=204)
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.get(Contact, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contacto no encontrado")
    db.delete(contact)
    db.commit()
    return None
