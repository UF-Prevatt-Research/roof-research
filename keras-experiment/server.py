from typing import Union

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

import numpy as np
import keras
from keras._tf_keras.keras.applications.resnet50 import (
    preprocess_input,
    decode_predictions,
)

model = keras.applications.resnet50.ResNet50(weights="imagenet")
app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins="*")


def formulate_response(predictions):
    str = ""
    for prediction in predictions:
        template = "<p>{name} - confidence: {confidence}%</p>"
        str += template.format(
            name=prediction[1], confidence=round(float(prediction[2]) * 100, 2)
        )

    return str


@app.post("/classify")
async def classify(file: UploadFile):
    bytes_content = await file.read()
    image = Image.open(io.BytesIO(bytes_content))
    image = image.resize((224, 224))
    x = keras.utils.img_to_array(image)
    x = np.expand_dims(x, axis=0)  # what does this even do?
    x = preprocess_input(x)
    preds = decode_predictions(model.predict(x), top=3)[0]

    return formulate_response(preds)
