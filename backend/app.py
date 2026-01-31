from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pickle
import pandas as pd
from typing import Optional

# Cargar el modelo de ML entrenado
with open('modelo_final.pkl', 'rb') as file:
    modelo = pickle.load(file)

# Cargar el objeto de preprocesamiento
with open('preproceso.pkl', 'rb') as file:
    preproceso = pickle.load(file)

# Crear aplicación FastAPI
app = FastAPI(
    title="Housing Price Prediction API",
    description="API para predecir precios de viviendas en Madrid usando Machine Learning",
    version="2.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://rbooantt.github.io"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic para validación
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

# Endpoints
@app.get("/")
async def root():
    return {
        "mensaje": "API de Predicción de Precios de Viviendas",
        "version": "2.0.0",
        "tecnologia": "FastAPI"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "modelo_cargado": modelo is not None,
        "preproceso_cargado": preproceso is not None
    }

@app.post("/predecir_precio", response_model=PrecioResponse)
async def predecir_precio(vivienda: ViviendaInput):
    try:
        # Convertir a DataFrame
        entrada = pd.DataFrame([[
            vivienda.tipo_vivienda,
            vivienda.distrito,
            vivienda.zona,
            vivienda.piscina,
            vivienda.terraza,
            vivienda.jardin,
            vivienda.garaje,
            vivienda.trastero,
            vivienda.calefaccion,
            vivienda.aire_acondicionado,
            vivienda.ascensor,
            vivienda.superficie_construida,
            vivienda.habitaciones,
            vivienda.baños
        ]], columns=[
            'tipo_vivienda', 'distrito', 'zona', 'piscina', 'terraza',
            'jardin', 'garaje', 'trastero', 'calefaccion',
            'aire_acondicionado', 'ascensor', 'superficie_construida',
            'habitaciones', 'baños'
        ])
        
        # Preprocesar datos
        entrada_preprocesada = preproceso.transform(entrada)
        
        # Hacer predicción
        precio = modelo.predict(entrada_preprocesada)[0]
        precio_redondeado = round(float(precio))
        
        return PrecioResponse(
            precio_estimado=precio_redondeado,
            mensaje=f"Precio estimado para {vivienda.tipo_vivienda} en {vivienda.distrito}"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar la predicción: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
