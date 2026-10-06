# Iris Flower Classification

An end-to-end Machine Learning pipeline and real-time interactive web application that predicts the species of Iris flowers (**Setosa**, **Versicolor**, or **Virginica**) based on four continuous physical measurements: sepal length, sepal width, petal length, and petal width.

---

## 🌐 Application Access & URLs

- **Local Application URL**: **[http://localhost:5000](http://localhost:5000)** (or **[http://127.0.0.1:5000](http://127.0.0.1:5000)**)
- **GitHub Repository**: **[https://github.com/Ratanyadav9867/IRIS-FLOWER-PRIDICTION](https://github.com/Ratanyadav9867/IRIS-FLOWER-PRIDICTION)**

---

## Table of Contents
- [Application Access & URLs](#-application-access--urls)
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How to Set Up and Run](#how-to-set-up-and-run)
  - [1. Launching the Interactive Web Application](#1-launching-the-interactive-web-application)
  - [2. Launching the Jupyter Notebook](#2-launching-the-jupyter-notebook)
- [REST API Reference](#rest-api-reference)
- [Exploratory Data Analysis & Visualizations](#exploratory-data-analysis--visualizations)
- [Modeling & Results Summary](#modeling--results-summary)
- [Inference Demo](#inference-demo)
- [Key Learnings & Limitations](#key-learnings--limitations)

---

## Project Overview

The Iris Flower Classification dataset is a foundational benchmark in botanical classification and pattern recognition, originally introduced by statistician and biologist Ronald Fisher in 1936. The objective of this project is to explore the underlying distribution of morphological measurements, determine feature discriminative power, train multiple supervised machine learning models, evaluate them without data leakage, select the optimal model for inference, and deliver a production-ready, interactive web interface.

---

## Tech Stack

- **Language**: Python 3.13+
- **Web Backend & REST API**: [Flask](https://flask.palletsprojects.com/)
- **Frontend & UI**: Vanilla HTML5, Vanilla CSS3 (Dark Glassmorphic Theme), Vanilla JavaScript (Real-time live inference)
- **Data Manipulation**: [NumPy](https://numpy.org/), [Pandas](https://pandas.pydata.org/)
- **Data Visualization**: [Matplotlib](https://matplotlib.org/), [Seaborn](https://seaborn.pydata.org/)
- **Machine Learning**: [Scikit-Learn](https://scikit-learn.org/) (Data preprocessing, feature selection, classifiers, cross-validation pipelines, evaluation metrics)
- **Model Serialization**: [Joblib](https://joblib.readthedocs.io/)
- **Notebook Environment**: Jupyter Notebook, IPykernel, nbformat

---

## Project Structure

```text
IRIS FLOWER CLASSIFICATION/
├── .venv/                      # Local Python virtual environment
├── requirements.txt            # Pinned package dependencies
├── app.py                      # Flask web server & prediction REST API
├── templates/
│   └── index.html              # Modern interactive dashboard template
├── static/
│   ├── style.css               # Dark glassmorphic design system
│   └── app.js                  # Real-time slider events and API integration
├── iris_classification.ipynb   # Complete analysis, visualization, and modeling notebook
├── iris_best_model.joblib      # Serialized inference pipeline (StandardScaler + KNN)
├── .gitignore                  # Git exclusion rules
└── README.md                   # Comprehensive project documentation
```

---

## How to Set Up and Run

### 1. Prerequisites
Ensure Python 3.10+ is installed on your operating system.

### 2. Virtual Environment Setup
Clone the repository and create an isolated virtual environment:

```bash
git clone https://github.com/Ratanyadav9867/IRIS-FLOWER-PRIDICTION.git
cd IRIS-FLOWER-PRIDICTION
```

**Windows (PowerShell):**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies
Install all required libraries specified in `requirements.txt`:
```bash
pip install -r requirements.txt
```

---

### 1. Launching the Interactive Web Application

Run the Flask server:
```bash
python app.py
```

Once started, open your web browser and navigate to:
👉 **[http://localhost:5000](http://localhost:5000)** (or `http://127.0.0.1:5000`)

**Interactive Features**:
- 🎚️ **Live Sliders**: Slide Sepal Length, Sepal Width, Petal Length, or Petal Width to trigger real-time predictions.
- 🌸 **Quick Presets**: One-click test buttons for typical *Setosa*, *Versicolor*, and *Virginica* profiles.
- 📊 **Animated Meters**: Visual probability progress bars and species glow themes.

---

### 2. Launching the Jupyter Notebook

Register the kernel and open Jupyter:
```bash
python -m ipykernel install --user --name iris-env --display-name "iris-env"
jupyter notebook iris_classification.ipynb
```
Select the **`iris-env`** kernel when prompted.

---

## REST API Reference

The web application exposes a high-performance REST endpoint for programmatic inference:

### `POST /api/predict`

**Request Headers**:
```http
Content-Type: application/json
```

**Request Body Example**:
```json
{
  "sepal_length": 5.1,
  "sepal_width": 3.5,
  "petal_length": 1.4,
  "petal_width": 0.2
}
```

**Response Example**:
```json
{
  "confidence": 100.0,
  "display_name": "Iris Setosa",
  "predicted_species": "setosa",
  "probabilities": {
    "setosa": 100.0,
    "versicolor": 0.0,
    "virginica": 0.0
  },
  "success": true
}
```

---

## Exploratory Data Analysis & Visualizations

The notebook guides through eight structured sections:
1. **Data Quality Verification**: Confirmed zero missing values across all 150 instances and perfectly balanced classes (50 samples per species).
2. **Pairplot with KDE Marginals**: Illustrated that *Setosa* is completely isolated in feature space, while *Versicolor* and *Virginica* show close adjacency.
3. **Box Plots & Violin Plots (2x2 Grids)**: Revealed tight distributions for *Setosa* petal measurements, contrasted with wider, continuous spreads for sepal dimensions.
4. **Correlation Analysis**: Discovered high collinearity between `petal_length` and `petal_width` ($r = 0.96$).
5. **Feature Importance & Selection**: Both univariate ANOVA F-tests ($F \approx 1180$) and Random Forest Gini Importance ($>87\%$ combined) confirm that **petal length and petal width are the primary discriminative drivers**.

---

## Modeling & Results Summary

Data was split using a stratified 80% train / 20% test partition (30 test samples). Distance-based and regularized models were scaled using `StandardScaler` fitted strictly on training data to prevent data leakage. In addition to the holdout test set, **5-Fold Stratified Cross-Validation** was executed across the full dataset:

| Model | Holdout Test Accuracy (20%) | 5-Fold CV Mean Accuracy | CV Std Dev (±) | Individual Fold Scores |
| :--- | :---: | :---: | :---: | :--- |
| **K-Nearest Neighbors ($k=5$)** *(Best)* | **93.33%** | **97.33%** | **± 2.49%** | $[1.000, 0.967, 0.933, 1.000, 0.967]$ |
| **Logistic Regression** | 93.33% | 95.33% | ± 4.52% | $[1.000, 0.967, 0.900, 1.000, 0.900]$ |
| **Decision Tree** | 93.33% | 95.33% | ± 3.40% | $[1.000, 0.967, 0.933, 0.967, 0.900]$ |
| **Random Forest** | 90.00% | 94.67% | ± 2.67% | $[0.967, 0.967, 0.933, 0.967, 0.900]$ |

### Why K-Nearest Neighbors Was Selected:
- **Highest Generalization Accuracy**: Led all models with **97.33%** mean CV accuracy, achieving 100% accuracy on two separate folds.
- **Superior Stability**: Tightest variance across folds ($\sigma = 2.49\%$), proving resilience to dataset partitioning.
- **Flawless Setosa Classification**: 100% precision and recall ($1.0000$) on test data.
- **Inference Simplicity**: Instantaneous $O(N \cdot D)$ distance lookup and fully explainable decision logic.

---

## Inference Demo

You can load the serialized pipeline artifact (`iris_best_model.joblib`) directly in Python to classify new flower measurements:

```python
import joblib
import pandas as pd

# Load serialized pipeline (StandardScaler + KNeighborsClassifier)
pipeline = joblib.load("iris_best_model.joblib")

# Example sample: Sepal L=5.1, Sepal W=3.5, Petal L=1.4, Petal W=0.2
new_sample = pd.DataFrame([{
    'sepal_length': 5.1,
    'sepal_width': 3.5,
    'petal_length': 1.4,
    'petal_width': 0.2
}])

prediction = pipeline.predict(new_sample)[0]
probabilities = dict(zip(pipeline.classes_, pipeline.predict_proba(new_sample)[0]))

print(f"Predicted Species: {prediction}")
print(f"Class Probabilities: {probabilities}")
# Output: Predicted Species: setosa, Probabilities: {'setosa': 1.0, 'versicolor': 0.0, 'virginica': 0.0}
```

---

## Key Learnings & Limitations

### Key Learnings
1. **Petals vs. Sepals**: In angiosperms, petals evolve rapidly to attract specific insect pollinators, leading to pronounced inter-species morphological divergence. Sepals primarily shield developing buds and remain biologically conserved across species, explaining why sepal measurements overlap heavily.
2. **Preventing Data Leakage**: Preprocessing transformations (such as feature standardizers) must strictly learn parameters from the training partition and be encapsulated within scikit-learn `Pipeline` objects during cross-validation.
3. **Cross-Validation Necessity**: In small datasets ($N=150$), single test partitions exhibit high variance (one sample shifts accuracy by 3.33%). 5-fold cross-validation is essential for truthful model comparison.

### Limitations
- **Small Sample Size ($N=150$)**: Limited statistical power for training deep learning or high-parameter architectures.
- **Irreducible Bayes Error**: Natural physical overlap between *Versicolor* and *Virginica* at petal lengths around 4.8–5.1 cm imposes a baseline classification error rate without genetic or biochemical testing.
- **Geographic Generalization**: Data was collected from a single localized Canadian population in 1935 and does not reflect modern global morphological drift or phenotypic plasticity.