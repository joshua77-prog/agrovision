import onnxruntime as ort

MODEL_PATH = "plantvillage_efficientnet.onnx"

print("Loading model...")

session = ort.InferenceSession(
    MODEL_PATH,
    providers=["CPUExecutionProvider"]
)

print("✅ Model loaded!")

print("\nMODEL METADATA")
metadata = session.get_modelmeta()

print("Description:", metadata.description)
print("Graph name:", metadata.graph_name)
print("Producer:", metadata.producer_name)
print("Version:", metadata.version)

print("\nCUSTOM METADATA")
if metadata.custom_metadata_map:
    for key, value in metadata.custom_metadata_map.items():
        print(f"{key}: {value}")
else:
    print("No custom metadata found.")