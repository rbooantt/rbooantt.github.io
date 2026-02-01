from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pickle
import numpy as np
import pandas as pd
from typing import Optional

# Cargar el modelo de ML entrenado
with open("modelo_final.pkl", "rb") as file:
    modelo = pickle.load(file)

# Cargar el objeto de preprocesamiento
with open("preproceso.pkl", "rb") as file:
    preproceso = pickle.load(file)

app = FastAPI(
    title="Housing Price Prediction API",
    description="API para predecir precios de viviendas en Madrid usando Machine Learning",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://rbooantt.github.io",
        "https://rbooantt-github-io.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ViviendaInput(BaseModel):
    tipo_vivienda: str
    distrito: str
    zona: str
    superficie_construida: float = Field(ge=20, le=1000)
    habitaciones: int = Field(ge=0, le=10)
    baños: int = Field(ge=1, le=10)
    piscina: int = Field(0, ge=0, le=1)
    terraza: int = Field(0, ge=0, le=1)
    jardin: int = Field(0, ge=0, le=1)
    garaje: int = Field(0, ge=0, le=1)
    trastero: int = Field(0, ge=0, le=1)
    calefaccion: int = Field(0, ge=0, le=1)
    aire_acondicionado: int = Field(0, ge=0, le=1)
    ascensor: int = Field(0, ge=0, le=1)

class PrecioResponse(BaseModel):
    precio_estimado: float
    moneda: str = "EUR"
    success: bool = True
    mensaje: Optional[str] = None

@app.get("/")
async def root():
    return {
        "mensaje": "API de Predicción de Precios de Viviendas",
        "version": "2.0.0",
        "tecnologia": "FastAPI",
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "modelo_cargado": modelo is not None,
        "preproceso_cargado": preproceso is not None,
    }

@app.post("/predecir_precio", response_model=PrecioResponse)
async def predecir_precio(vivienda: ViviendaInput):
    try:
        # Convertir a DataFrame para que ColumnTransformer funcione
        entrada = pd.DataFrame([{
            "tipo_vivienda": vivienda.tipo_vivienda,
            "distrito": vivienda.distrito,
            "zona": vivienda.zona,
            "piscina": vivienda.piscina,
            "terraza": vivienda.terraza,
            "jardin": vivienda.jardin,
            "garaje": vivienda.garaje,
            "trastero": vivienda.trastero,
            "calefaccion": vivienda.calefaccion,
            "aire_acondicionado": vivienda.aire_acondicionado,
            "ascensor": vivienda.ascensor,
            "superficie_construida": vivienda.superficie_construida,
            "habitaciones": vivienda.habitaciones,
            "baños": vivienda.baños,
        }])

        entrada_preprocesada = preproceso.transform(entrada)
        precio = modelo.predict(entrada_preprocesada)[0]

        return PrecioResponse(
            precio_estimado=round(float(precio)),
            mensaje=f"Precio estimado para {vivienda.tipo_vivienda} en {vivienda.distrito}",
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar la predicción: {str(e)}",
        )
