from pathlib import Path
from collections import Counter, defaultdict

import numpy as np
import onnxruntime as ort
from PIL import Image


# ============================================================
# 1. Find the dataset
# ============================================================

DATASET_DIR = Path("../../plant_dataset/PlantVillage")

if not DATASET_DIR.exists():
    raise FileNotFoundError(
        f"Dataset not found at: {DATASET_DIR.resolve()}"
    )

print("Dataset found at:")
print(DATASET_DIR.resolve())


# ============================================================
# 2. Load ONNX model
# ============================================================

MODEL_PATH = Path("plantvillage_efficientnet.onnx")

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Model not found at: {MODEL_PATH.resolve()}"
    )

print("\nLoading ONNX model...")

session = ort.InferenceSession(
    str(MODEL_PATH),
    providers=["CPUExecutionProvider"]
)

input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name

print("✅ Model loaded")
print("Input:", input_name)
print("Output:", output_name)


# ============================================================
# 3. Find the 15 class folders
# ============================================================

class_folders = sorted(
    [
        folder
        for folder in DATASET_DIR.iterdir()
        if folder.is_dir()
        and folder.name != "PlantVillage"
    ]
)

print("\nNumber of class folders found:", len(class_folders))

for i, folder in enumerate(class_folders, start=1):
    print(f"{i}. {folder.name}")


if len(class_folders) != 15:
    print("\n⚠️ WARNING: Expected 15 class folders.")
    print("Please check the dataset structure before continuing.")


# ============================================================
# 4. Prepare image
# ============================================================

def prepare_image(image_path):
    image = Image.open(image_path).convert("RGB")

    # Model input is 224 x 224 x 3
    image = image.resize((224, 224))

    image = np.array(image, dtype=np.float32)

    # Add batch dimension
    image = np.expand_dims(image, axis=0)

    return image


# ============================================================
# 5. Predict one image
# ============================================================

def predict_image(image_path):

    image = prepare_image(image_path)

    prediction = session.run(
        [output_name],
        {
            input_name: image
        }
    )[0][0]

    predicted_class = int(np.argmax(prediction))

    confidence = float(
        prediction[predicted_class]
    )

    return predicted_class, confidence


# ============================================================
# 6. Test images from each folder
# ============================================================

results = defaultdict(list)

IMAGES_PER_CLASS = 5

print("\n")
print("=" * 70)
print("TESTING MODEL AGAINST KNOWN PLANTVILLAGE CLASSES")
print("=" * 70)

for folder in class_folders:

    image_files = sorted(
        [
            file
            for file in folder.iterdir()
            if file.suffix.lower()
            in [".jpg", ".jpeg", ".png"]
        ]
    )

    image_files = image_files[:IMAGES_PER_CLASS]

    print(f"\n📁 {folder.name}")

    for image_path in image_files:

        try:

            predicted_class, confidence = predict_image(
                image_path
            )

            results[folder.name].append(
                (predicted_class, confidence)
            )

            print(
                f"   {image_path.name}"
                f" → Class {predicted_class}"
                f" ({confidence * 100:.2f}%)"
            )

        except Exception as error:

            print(
                f"   ❌ Error with {image_path.name}:"
                f" {error}"
            )


# ============================================================
# 7. Find dominant class for each known folder
# ============================================================

print("\n")
print("=" * 70)
print("RESULTS")
print("=" * 70)

mapping = {}

for folder_name, predictions in results.items():

    if not predictions:
        continue

    class_counts = Counter(
        prediction[0]
        for prediction in predictions
    )

    dominant_class, count = (
        class_counts.most_common(1)[0]
    )

    average_confidence = (
        sum(
            confidence
            for _, confidence in predictions
        )
        / len(predictions)
    )

    mapping[dominant_class] = folder_name

    print(
        f"Class {dominant_class:2d}"
        f" → {folder_name}"
        f" | {count}/{len(predictions)}"
        f" images"
        f" | Avg confidence:"
        f" {average_confidence * 100:.2f}%"
    )


# ============================================================
# 8. Final mapping
# ============================================================

print("\n")
print("=" * 70)
print("MODEL CLASS → DISEASE MAPPING")
print("=" * 70)

for class_number in range(15):

    disease = mapping.get(
        class_number,
        "NOT VERIFIED"
    )

    print(
        f"{class_number:2d} → {disease}"
    )


print("\n✅ Mapping test finished.")