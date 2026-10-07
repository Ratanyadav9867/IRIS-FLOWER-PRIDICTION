/**
 * Iris Flower Classification - Real-Time Inference Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Slider input elements
  const inputs = {
    sepal_length: document.getElementById('sepal_length'),
    sepal_width: document.getElementById('sepal_width'),
    petal_length: document.getElementById('petal_length'),
    petal_width: document.getElementById('petal_width')
  };

  // Value display chips
  const chips = {
    sepal_length: document.getElementById('val-sepal_length'),
    sepal_width: document.getElementById('val-sepal_width'),
    petal_length: document.getElementById('val-petal_length'),
    petal_width: document.getElementById('val-petal_width')
  };

  // UI Result Elements
  const resultCard = document.getElementById('result-card');
  const speciesHeadline = document.getElementById('species-name');
  const speciesDesc = document.getElementById('species-desc');
  const speciesIcon = document.getElementById('species-icon');
  const speciesRange = document.getElementById('species-range');
  const confidenceBadge = document.getElementById('confidence-badge');
  const vectorText = document.getElementById('feature-vector-text');

  // Probability Meter Elements
  const probBars = {
    setosa: document.getElementById('bar-setosa'),
    versicolor: document.getElementById('bar-versicolor'),
    virginica: document.getElementById('bar-virginica')
  };
  const probTexts = {
    setosa: document.getElementById('pct-setosa'),
    versicolor: document.getElementById('pct-versicolor'),
    virginica: document.getElementById('pct-virginica')
  };
  const probItems = {
    setosa: document.getElementById('item-setosa'),
    versicolor: document.getElementById('item-versicolor'),
    virginica: document.getElementById('item-virginica')
  };

  // Preset Definitions
  const PRESET_VALUES = {
    setosa: { sepal_length: 5.1, sepal_width: 3.5, petal_length: 1.4, petal_width: 0.2 },
    versicolor: { sepal_length: 5.9, sepal_width: 3.0, petal_length: 4.2, petal_width: 1.5 },
    virginica: { sepal_length: 6.9, sepal_width: 3.1, petal_length: 5.4, petal_width: 2.1 },
    reset: { sepal_length: 5.8, sepal_width: 3.0, petal_length: 3.8, petal_width: 1.2 }
  };

  let debounceTimer = null;

  // Update value chips and vector summary
  function updateInputDisplays() {
    const sl = parseFloat(inputs.sepal_length.value).toFixed(1);
    const sw = parseFloat(inputs.sepal_width.value).toFixed(1);
    const pl = parseFloat(inputs.petal_length.value).toFixed(1);
    const pw = parseFloat(inputs.petal_width.value).toFixed(1);

    chips.sepal_length.textContent = `${sl} cm`;
    chips.sepal_width.textContent = `${sw} cm`;
    chips.petal_length.textContent = `${pl} cm`;
    chips.petal_width.textContent = `${pw} cm`;

    vectorText.textContent = `[${sl}, ${sw}, ${pl}, ${pw}]`;
  }

  // Perform inference API call
  async function performInference() {
    const payload = {
      sepal_length: parseFloat(inputs.sepal_length.value),
      sepal_width: parseFloat(inputs.sepal_width.value),
      petal_length: parseFloat(inputs.petal_length.value),
      petal_width: parseFloat(inputs.petal_width.value)
    };

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Prediction API failed');
      const data = await response.json();

      if (data.success) {
        renderPrediction(data);
      }
    } catch (err) {
      console.error('Error during prediction:', err);
    }
  }

  // Render prediction to DOM
  function renderPrediction(data) {
    const species = data.predicted_species;
    const meta = data.metadata || {};
    const probs = data.probabilities || {};

    // 1. Update Card Theme Glow
    resultCard.className = `card glass-card result-hero-card theme-${species}`;

    // 2. Update Headline & Description
    speciesHeadline.textContent = meta.display_name || species.toUpperCase();
    speciesDesc.textContent = meta.description || '';
    speciesIcon.textContent = meta.icon || '🌸';
    speciesRange.textContent = meta.typical_range || '';

    // 3. Update Confidence Badge
    const confVal = data.confidence !== undefined ? data.confidence : 100.0;
    confidenceBadge.textContent = `${confVal}% Confidence`;

    // 4. Update Probability Meters
    ['setosa', 'versicolor', 'virginica'].forEach(sp => {
      const p = probs[sp] !== undefined ? probs[sp] : 0.0;
      if (probBars[sp]) probBars[sp].style.width = `${p}%`;
      if (probTexts[sp]) probTexts[sp].textContent = `${p.toFixed(1)}%`;

      if (probItems[sp]) {
        if (sp === species) {
          probItems[sp].classList.add('active-species');
        } else {
          probItems[sp].classList.remove('active-species');
        }
      }
    });
  }

  // Handle Input Changes with Smooth Debounce
  function handleInputChange() {
    updateInputDisplays();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performInference();
    }, 80);
  }

  // Bind Input Listeners
  Object.values(inputs).forEach(input => {
    input.addEventListener('input', handleInputChange);
  });

  // Bind Preset Buttons
  document.querySelectorAll('[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-preset');
      applyPreset(presetKey);
    });
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    applyPreset('reset');
  });

  function applyPreset(key) {
    const values = PRESET_VALUES[key];
    if (!values) return;

    inputs.sepal_length.value = values.sepal_length;
    inputs.sepal_width.value = values.sepal_width;
    inputs.petal_length.value = values.petal_length;
    inputs.petal_width.value = values.petal_width;

    handleInputChange();
  }

  // Background Video Performance, Autoplay & Accessibility Controller
  function initBackgroundVideo() {
    const videoContainer = document.querySelector('[data-component="background-video"]');
    if (!videoContainer) return;

    const video = videoContainer.querySelector('.bg-video-element');
    if (!video) return;

    // Respect user's OS preference for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotion = (e) => {
      if (e.matches) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    if (motionQuery.matches) {
      video.pause();
    } else {
      // Check for Network Data-Saver header/mode
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const isDataSaver = connection && (connection.saveData || /2g/.test(connection.effectiveType));

      if (isDataSaver && videoContainer.getAttribute('data-mobile-poster-only') === 'true') {
        video.pause();
      } else {
        // Enforce muted property programmatically for strict browser policies (iOS Safari, Chrome)
        video.muted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            // Autoplay rejected or video file deferred; poster image remains visible
            console.info('Background video autoplay deferred:', err.message || err);
          });
        }
      }
    }

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotion);
    }

    // If video fails or isn't loaded yet, keep poster background visible
    video.addEventListener('error', () => {
      video.style.display = 'none';
    });
  }

  // Initial Run
  initBackgroundVideo();
  updateInputDisplays();
  performInference();
});
