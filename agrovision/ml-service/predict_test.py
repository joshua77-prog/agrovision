import json
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort


MODEL_PATH = "plantvillage_efficientnet.onnx"
IMAGE_PATH = "test_leaf.jpg"
CLASS_NAMES_PATH = "class_names.json"


# --------------------------------------------------
# Load class names
# --------------------------------------------------

with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as file:
    class_names = json.load(file)


# --------------------------------------------------
# Load ONNX model
# --------------------------------------------------

print("Loading model...")

session = ort.InferenceSession(
    MODEL_PATH,
    providers=["CPUExecutionProvider"]
)

input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name

print("[OK] Model loaded")


# --------------------------------------------------
# Read image
# --------------------------------------------------

image = cv2.imread(IMAGE_PATH)

if image is None:
    raise FileNotFoundError(
        f"Could not find image: {IMAGE_PATH}"
    )

# BGR → RGB
image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Resize
image = cv2.resize(image, (224, 224))

# Convert to float32
image = image.astype(np.float32)

# Add batch dimension
image = np.expand_dims(image, axis=0)

print("Image shape:", image.shape)


# --------------------------------------------------
# Prediction
# --------------------------------------------------

result = session.run(
    [output_name],
    {input_name: image}
)

predictions = result[0][0]

predicted_index = int(np.argmax(predictions))
confidence = float(predictions[predicted_index])


# --------------------------------------------------
# Get disease name
# --------------------------------------------------

disease_name = class_names[str(predicted_index)]


# --------------------------------------------------
# Display result
# --------------------------------------------------

print("\n===================================")
print("AGROVISION PREDICTION")
print("===================================")

print("Disease:", disease_name)
print("Class:", predicted_index)
print("Confidence:", f"{confidence * 100:.2f}%")