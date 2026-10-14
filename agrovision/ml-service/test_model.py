import tensorflow as tf

MODEL_PATH = "plantvillage_efficientnet.keras"

print("Loading AgroVision disease detection model...")

model = tf.keras.models.load_model(MODEL_PATH)

print("✅ Model loaded successfully!")
print("Input shape:", model.input_shape)
print("Output shape:", model.output_shape)