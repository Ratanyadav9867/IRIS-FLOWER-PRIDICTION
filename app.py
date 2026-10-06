"""
Iris Flower Classification - Interactive Web Application Backend
Serves the web UI and provides an inference API powered by the serialized best model.
"""

import os
import joblib
import pandas as pd
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Load serialized pipeline artifact
MODEL_PATH = os.path.join(os.path.dirname(__file__), "iris_best_model.joblib")
pipeline = joblib.load(MODEL_PATH)

SPECIES_METADATA = {
    "setosa": {
        "display_name": "Iris Setosa",
        "description": "Characterized by notably short and narrow petals, but broad sepals. Known for high botanical resilience and complete linear separability.",
        "badge_color": "#38bdf8",
        "accent_class": "badge-setosa",
        "icon": "🌸",
        "typical_range": "Petal Length: 1.0 - 1.9 cm | Petal Width: 0.1 - 0.6 cm"
    },
    "versicolor": {
        "display_name": "Iris Versicolor",
        "description": "Known as the Blue Flag iris. Possesses intermediate petal and sepal dimensions, exhibiting subtle morphological transition into Virginica.",
        "badge_color": "#a855f7",
        "accent_class": "badge-versicolor",
        "icon": "🌺",
        "typical_range": "Petal Length: 3.0 - 5.1 cm | Petal Width: 1.0 - 1.8 cm"
    },
    "virginica": {
        "display_name": "Iris Virginica",
        "description": "The largest of the three species with elongated, wide petals and sepals. Distinguished by deep violet blooms and commanding stature.",
        "badge_color": "#f43f5e",
        "accent_class": "badge-virginica",
        "icon": "🪻",
        "typical_range": "Petal Length: 4.5 - 6.9 cm | Petal Width: 1.4 - 2.5 cm"
    }
}

PRESETS = {
    "setosa": {
        "label": "Typical Setosa",
        "sepal_length": 5.1,
        "sepal_width": 3.5,
        "petal_length": 1.4,
        "petal_width": 0.2
    },
    "versicolor": {
        "label": "Typical Versicolor",
        "sepal_length": 5.9,
        "sepal_width": 3.0,
        "petal_length": 4.2,
        "petal_width": 1.5
    },
    "virginica": {
        "label": "Typical Virginica",
        "sepal_length": 6.9,
        "sepal_width": 3.1,
        "petal_length": 5.4,
        "petal_width": 2.1
    }
}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/presets", methods=["GET"])
def get_presets():
    return jsonify(PRESETS)

@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)
        sepal_length = float(data.get("sepal_length", 5.8))
        sepal_width = float(data.get("sepal_width", 3.0))
        petal_length = float(data.get("petal_length", 3.8))
        petal_width = float(data.get("petal_width", 1.2))

        # Build feature DataFrame matching model training column schema
        sample_df = pd.DataFrame([{
            "sepal_length": sepal_length,
            "sepal_width": sepal_width,
            "petal_length": petal_length,
            "petal_width": petal_width
        }])

        prediction = str(pipeline.predict(sample_df)[0]).lower()
        prob_array = pipeline.predict_proba(sample_df)[0]
        classes = [str(c).lower() for c in pipeline.classes_]

        probabilities = {}
        for c, p in zip(classes, prob_array):
            probabilities[c] = round(float(p) * 100, 1)

        winning_confidence = probabilities.get(prediction, 0.0)

        return jsonify({
            "success": True,
            "predicted_species": prediction,
            "display_name": SPECIES_METADATA.get(prediction, {}).get("display_name", prediction.title()),
            "confidence": winning_confidence,
            "probabilities": probabilities,
            "metadata": SPECIES_METADATA.get(prediction, {}),
            "inputs": {
                "sepal_length": sepal_length,
                "sepal_width": sepal_width,
                "petal_length": petal_length,
                "petal_width": petal_width
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
