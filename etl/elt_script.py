import pandas as pd

# Leer los datos
df = pd.read_csv('../data/sample_data.csv')

# Limpieza simple
df.dropna(inplace=True)
df.columns = [col.strip().lower().replace(' ', '_') for col in df.columns]

# Transformación ejemplo
df['total'] = df['cantidad'] * df['precio_unitario']

# Guardar resultado
df.to_json('../data/data_procesada.json', orient='records')

print("✅ ETL completado. Archivo guardado en /data/data_procesada.json")
