import onnxruntime as ort

MODEL_PATH = "plantvillage_efficientnet.onnx"

print("Loading ONNX model...")

session = ort.InferenceSession(
    MODEL_PATH,
    providers=["CPUExecutionProvider"]
)

print("✅ Model loaded successfully!")

print("\nINPUT INFORMATION")
for inp in session.get_inputs():
    print("Name:", inp.name)
    print("Shape:", inp.shape)
    print("Type:", inp.type)

print("\nOUTPUT INFORMATION")
for out in session.get_outputs():
    print("Name:", out.name)
    print("Shape:", out.shape)
    print("Type:", out.type)