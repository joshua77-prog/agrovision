import io
import json
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware


# ============================================================
# AGROVISION ML API
# ============================================================

app = FastAPI(
    title="AgroVision ML API",
    description="Crop disease detection using EfficientNetV2-B0",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# FILE PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "plantvillage_efficientnet.onnx"
CLASS_NAMES_PATH = BASE_DIR / "class_names.json"


# ============================================================
# LOAD MODEL
# ============================================================

print("Loading AgroVision model...")

session = ort.InferenceSession(
    str(MODEL_PATH),
    providers=["CPUExecutionProvider"],
)

input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name

print("✅ Model loaded successfully")
print("Input:", input_name)
print("Output:", output_name)


# ============================================================
# LOAD CLASS NAMES
# ============================================================

with open(
    CLASS_NAMES_PATH,
    "r",
    encoding="utf-8",
) as file:
    class_names = json.load(file)


# ============================================================
# MODEL CLASS GROUPS
# ============================================================

# These are the class indexes verified from your
# PlantVillage dataset against this exact ONNX model.

CROP_CLASSES = {
    "Pepper": [0, 1],

    "Potato": [2, 3, 4],

    "Tomato": [
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
    ],
}


# ============================================================
# FRIENDLY DISPLAY NAMES
# ============================================================

DISPLAY_NAMES = {
    "Pepper__bell___Bacterial_spot":
        "Bacterial Spot",

    "Pepper__bell___healthy":
        "Healthy",

    "Potato___Early_blight":
        "Early Blight",

    "Potato___Late_blight":
        "Late Blight",

    "Potato___healthy":
        "Healthy",

    "Tomato_Bacterial_spot":
        "Bacterial Spot",

    "Tomato_Early_blight":
        "Early Blight",

    "Tomato_Late_blight":
        "Late Blight",

    "Tomato_Leaf_Mold":
        "Leaf Mold",

    "Tomato_Septoria_leaf_spot":
        "Septoria Leaf Spot",

    "Tomato_Spider_mites_Two_spotted_spider_mite":
        "Spider Mites",

    "Tomato__Target_Spot":
        "Target Spot",

    "Tomato__Tomato_YellowLeaf__Curl_Virus":
        "Tomato Yellow Leaf Curl Virus",

    "Tomato__Tomato_mosaic_virus":
        "Tomato Mosaic Virus",

    "Tomato_healthy":
        "Healthy",
}


# ============================================================
# NORMALIZE CROP
# ============================================================

def normalize_crop(crop: str):

    if not crop:
        return None

    value = crop.strip().lower()

    if value == "tomato":
        return "Tomato"

    if value == "potato":
        return "Potato"

    if value in {
        "pepper",
        "bell pepper",
        "pepper bell",
        "capsicum",
    }:
        return "Pepper"

    return None


# ============================================================
# GET FRIENDLY NAME
# ============================================================

def get_display_name(class_name):

    return DISPLAY_NAMES.get(
        class_name,
        class_name,
    )


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def home():

    return {
        "message": "AgroVision ML API is running",
        "model": "EfficientNetV2-B0",
        "classes": 15,
    }


# ============================================================
# PREDICTION ENDPOINT
# ============================================================

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    crop: str = Form(...),
):

    print("\n-----------------------------------")
    print("New AgroVision prediction request")
    print("Filename:", file.filename)
    print("Content type:", file.content_type)
    print("Crop received:", repr(crop))


    # ========================================================
    # 1. VALIDATE CROP
    # ========================================================

    selected_crop = normalize_crop(crop)

    print("Normalized crop:", selected_crop)

    if selected_crop is None:

        return {
            "success": False,
            "error": (
                "Unsupported crop. "
                "Please select Tomato, Potato, or Pepper."
            ),
        }


    # ========================================================
    # 2. VALIDATE IMAGE TYPE
    # ========================================================

    if (
        not file.content_type
        or not file.content_type.startswith("image/")
    ):

        return {
            "success": False,
            "error": (
                "Please upload a valid JPG, PNG, "
                "or WEBP image."
            ),
        }


    # ========================================================
    # 3. READ IMAGE BYTES
    # ========================================================

    image_bytes = await file.read()

    if not image_bytes:

        return {
            "success": False,
            "error": "The uploaded image is empty.",
        }


    # ========================================================
    # 4. DECODE IMAGE USING PILLOW
    # ========================================================

    try:

        pil_image = Image.open(
            io.BytesIO(image_bytes)
        )

        pil_image = pil_image.convert("RGB")

    except Exception as error:

        print("Image decoding error:", error)

        return {
            "success": False,
            "error": (
                "The uploaded file could not be read "
                "as an image. Please upload a valid "
                "JPG, PNG, or WEBP image."
            ),
        }


    # ========================================================
    # 5. RESIZE TO MODEL INPUT
    # ========================================================

    pil_image = pil_image.resize(
        (224, 224),
        Image.Resampling.LANCZOS,
    )


    # ========================================================
    # 6. CONVERT TO NUMPY
    # ========================================================

    image = np.array(
        pil_image,
        dtype=np.float32,
    )


    # ========================================================
    # 7. ADD BATCH DIMENSION
    # ========================================================

    image = np.expand_dims(
        image,
        axis=0,
    )


    print("Image shape:", image.shape)


    # ========================================================
    # 8. MODEL INFERENCE
    # ========================================================

    try:

        predictions = session.run(
            [output_name],
            {
                input_name: image
            },
        )[0][0]

    except Exception as error:

        print("Model inference error:", error)

        return {
            "success": False,
            "error": (
                "The disease detection model "
                "could not process this image."
            ),
        }


    # ========================================================
    # 9. GLOBAL MODEL PREDICTION
    # ========================================================

    global_index = int(
        np.argmax(predictions)
    )

    global_probability = float(
        predictions[global_index]
    )

    global_class = class_names[
        str(global_index)
    ]

    global_display_name = get_display_name(
        global_class
    )


    # ========================================================
    # 10. GET CLASSES FOR SELECTED CROP
    # ========================================================

    allowed_classes = CROP_CLASSES[
        selected_crop
    ]


    # ========================================================
    # 11. CROP-ONLY SCORES
    # ========================================================

    crop_scores = {
        index: float(predictions[index])
        for index in allowed_classes
    }


    # ========================================================
    # 12. BEST CLASS WITHIN SELECTED CROP
    # ========================================================

    selected_class_index = max(
        crop_scores,
        key=crop_scores.get,
    )

    selected_raw_probability = float(
        crop_scores[selected_class_index]
    )


    # ========================================================
    # 13. CROP PROBABILITY MASS
    # ========================================================

    crop_probability_mass = sum(
        crop_scores.values()
    )


    # ========================================================
    # 14. CROP-RELATIVE CONFIDENCE
    # ========================================================

    if crop_probability_mass > 0:

        crop_relative_confidence = (
            selected_raw_probability /
            crop_probability_mass
        )

    else:

        crop_relative_confidence = 0.0


    # ========================================================
    # 15. SELECTED DISEASE
    # ========================================================

    selected_class = class_names[
        str(selected_class_index)
    ]

    selected_display_name = get_display_name(
        selected_class
    )


    # ========================================================
    # 16. HEALTH CHECK
    # ========================================================

    is_healthy = (
        "healthy" in selected_class.lower()
    )


    # ========================================================
    # 17. CHECK GLOBAL VS SELECTED CROP
    # ========================================================

    global_matches_crop = (
        global_index in allowed_classes
    )


    # ========================================================
    # 18. RELIABILITY
    # ========================================================

    # This is deliberately conservative.
    #
    # A raw probability below 50% means we do NOT
    # want to present the prediction as highly certain.

    prediction_reliable = (
        selected_raw_probability >= 0.50
    )


    # ========================================================
    # 19. WARNING MESSAGE
    # ========================================================

    warning = None

    if not global_matches_crop:

        warning = (
            f"The model's strongest overall prediction "
            f"was {global_display_name}, but the selected "
            f"crop was {selected_crop}. "
            f"The result shown is restricted to "
            f"{selected_crop} disease classes."
        )

    elif not prediction_reliable:

        warning = (
            f"The model has low confidence for this "
            f"{selected_crop} image. "
            f"Please upload a clearer leaf image "
            f"for a more reliable prediction."
        )


    # ========================================================
    # 20. DISPLAY NAME FOR LOW-CONFIDENCE RESULT
    # ========================================================

    if prediction_reliable:

        final_display_name = (
            selected_display_name
        )

    else:

        final_display_name = (
            f"Possible {selected_display_name}"
        )


    # ========================================================
    # 21. LOG RESULT
    # ========================================================

    print("\n===================================")
    print("      AGROVISION ML PREDICTION")
    print("===================================")

    print(
        "File:",
        file.filename
    )

    print(
        "Selected Crop:",
        selected_crop
    )

    print(
        "Global Prediction:",
        global_display_name
    )

    print(
        "Global Probability:",
        f"{global_probability * 100:.2f}%"
    )

    print(
        "Selected Crop Prediction:",
        selected_display_name
    )

    print(
        "Selected Class Probability:",
        f"{selected_raw_probability * 100:.2f}%"
    )

    print(
        "Crop Relative Confidence:",
        f"{crop_relative_confidence * 100:.2f}%"
    )

    print(
        "Prediction Reliable:",
        prediction_reliable
    )

    print(
        "Crop Match:",
        global_matches_crop
    )

    if warning:
        print(
            "WARNING:",
            warning
        )

    print("===================================\n")


    # ========================================================
    # 22. RETURN RESPONSE
    # ========================================================

    return {

        "success": True,

        "disease":
            selected_class,

        "display_disease":
            final_display_name,

        "class_index":
            selected_class_index,

        # Raw model probability for selected class
        "confidence":
            round(
                selected_raw_probability * 100,
                2,
            ),

        # Probability after restricting to
        # the selected crop classes
        "crop_relative_confidence":
            round(
                crop_relative_confidence * 100,
                2,
            ),

        "crop":
            selected_crop,

        "is_healthy":
            is_healthy,

        "crop_match":
            global_matches_crop,

        "prediction_reliable":
            prediction_reliable,

        "warning":
            warning,

        "global_prediction":
            global_class,

        "global_display_prediction":
            global_display_name,

        "global_confidence":
            round(
                global_probability * 100,
                2,
            ),

        "id":
            f"det_{abs(hash(file.filename))}",
    }