import pymongo
import random
from datetime import datetime
from tqdm import tqdm  # Barra de progreso

# === Conexión a MongoDB ===
client = pymongo.MongoClient('mongodb://172.31.23.127:27017/')  # Cambiar IP según entorno
db = client['lab_exams_db']  # Base de datos
examenes_collection = db['examenes']  # Colección de exámenes

# === Tipos de examen ===
tipos_examen = [
    "Sangre", "Radiografía", "Tomografía", "Ultrasonido", "Electrocardiograma",
    "COVID", "Orina", "Biopsia", "Colesterol", "Hígado"
]

# === Generación de resultados según tipo de examen ===
def generar_resultado(tipo):
    match tipo:
        case "Sangre":
            return {
                "Hemoglobina": f"{round(random.uniform(12, 17), 1)} g/dL",
                "Glóbulos blancos": f"{random.randint(4000, 11000)} /µL",
                "Plaquetas": f"{random.randint(150000, 450000)} /µL"
            }
        case "Radiografía":
            return {
                "Observación": random.choice(["Sin fracturas", "Lesión detectada", "Neumonía sospechosa"])
            }
        case "Tomografía":
            return {
                "Área analizada": random.choice(["Craneo", "Tórax", "Abdomen"]),
                "Resultado": random.choice(["Normal", "Anomalía detectada"])
            }
        case "Ultrasonido":
            return {
                "Hígado": random.choice(["Normal", "Inflamado"]),
                "Riñones": random.choice(["Normal", "Piedras detectadas"])
            }
        case "Electrocardiograma":
            return {
                "Ritmo": random.choice(["Normal", "Arritmia"]),
                "Frecuencia": f"{random.randint(60, 100)} bpm"
            }
        case "COVID":
            return {
                "Resultado": random.choice(["Positivo", "Negativo"]),
                "Carga viral": f"{random.randint(1000, 100000)} copias/mL"
            }
        case "Orina":
            return {
                "Color": random.choice(["Amarillo", "Ámbar", "Claro"]),
                "Proteínas": random.choice(["Negativo", "Traza", "Positivo"]),
                "Glucosa": random.choice(["Negativo", "Positivo"])
            }
        case "Biopsia":
            return {
                "Diagnóstico": random.choice(["Benigno", "Maligno"]),
                "Inflamación": random.choice(["Presente", "Ausente"])
            }
        case "Colesterol":
            return {
                "LDL": f"{random.randint(70, 190)} mg/dL",
                "HDL": f"{random.randint(40, 90)} mg/dL",
                "Triglicéridos": f"{random.randint(100, 250)} mg/dL"
            }
        case "Hígado":
            return {
                "ALT": f"{random.randint(10, 50)} U/L",
                "AST": f"{random.randint(10, 40)} U/L",
                "Bilirrubina": f"{round(random.uniform(0.3, 1.2), 1)} mg/dL"
            }
        case _:
            return {"Observación": "Sin resultados"}

# === Generador de un examen único ===
def crear_examen(id_examen):
    tipo_examen = random.choice(tipos_examen)
    return {
        "pacienteId": str(random.randint(1, 200000)),
        "medicoId": str(random.randint(1, 100)),
        "tipoExamen": tipo_examen,
        "fecha": datetime.now().isoformat(),
        "estado": random.choice(["pendiente", "completado", "cancelado"]),
        "resultado": generar_resultado(tipo_examen),
        "comentarios": f"Observación general del examen {id_examen}" if random.random() > 0.2 else None
    }

# === Inserción masiva con barra de progreso ===
errores = []

for i in tqdm(range(1, 20001), desc="Insertando exámenes"):
    examen = crear_examen(i)
    try:
        result = examenes_collection.insert_one(examen)
        if not result.inserted_id:
            errores.append((i, "InsertError", "No se insertó el examen"))
    except pymongo.errors.PyMongoError as e:
        errores.append((i, "MongoDBError", str(e)))

# === Reporte final ===
print(f"\n✅ Finalizado. Total de errores: {len(errores)}")
if errores:
    with open("errores_insert.txt", "w", encoding="utf-8") as f:
        for e in errores:
            f.write(f"Examen {e[0]} - Error: {e[1]} - {e[2]}\n")
    print("❌ Errores guardados en 'errores_insert.txt'")

