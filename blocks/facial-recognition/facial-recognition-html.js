export const htmlTemplate = `
<div class="fr-hero">
  <div class="fr-hero__overlay"></div>
  <div class="fr-hero__content">
    <h1 class="fr-hero__title">Security Recognition</h1>

    <!-- shown after file selection -->
    <div id="fr-selection-panel" class="fr-selection-panel" style="display:none;">
      <div class="fr-selection-panel__preview">
        <img id="fr-preview-img" class="fr-preview-img" src="" alt="Selected photo preview" />
      </div>
      <div class="fr-selection-panel__controls">
        <label for="fr-cutoff-input" class="fr-cutoff-label">Similarity Cutoff</label>
        <input id="fr-cutoff-input" class="fr-cutoff-input" type="number" min="0" max="100" step="1" />
        <button type="button" id="fr-find-btn" class="fr-find-btn">Find<br>Credential #</button>
      </div>
      <div class="fr-selection-panel__results" style="display:none;"></div>
    </div>
  </div>
</div>

<div class="fr-upload-bar">
  <label for="fr-photo-input" class="fr-upload-bar__label">
    Upload Photo<br><span class="fr-upload-bar__sub">(.jpg ONLY)</span>
  </label>
  <div class="fr-upload-bar__input-wrap">
    <input
      id="fr-photo-input"
      name="photo"
      type="text"
      class="fr-upload-bar__input"
      placeholder="Upload .jpg File"
      readonly
    />
  </div>
  <button type="button" id="fr-browse-btn" class="fr-upload-bar__browse">Browse...</button>
  <input id="fr-file-input" type="file" accept=".jpg,image/jpeg" style="display:none;" />
</div>

`;
