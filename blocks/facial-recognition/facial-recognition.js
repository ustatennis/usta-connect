import { htmlTemplate } from './facial-recognition-html.js';
import { findCredentialByFace } from '../../scripts/s3script.js';

export default async function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = htmlTemplate;

  // Set background image via JS so Franklin's codeBasePath resolves correctly
  const hero = wrapper.querySelector('.fr-hero');
  const bgPath = `${window.hlx.codeBasePath}/blocks/facial-recognition/bg.jpg`;
  hero.style.backgroundImage = `url('${bgPath}')`;

  const browseBtn = wrapper.querySelector('#fr-browse-btn');
  const fileInput = wrapper.querySelector('#fr-file-input');
  const textInput = wrapper.querySelector('#fr-photo-input');
  const selectionPanel = wrapper.querySelector('#fr-selection-panel');
  const previewImg = wrapper.querySelector('#fr-preview-img');
  const findBtn = wrapper.querySelector('#fr-find-btn');

  // Browse button opens hidden file picker
  browseBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    // Validate .jpg only
    const isJpg =
      file.type === 'image/jpeg' ||
      file.name.toLowerCase().endsWith('.jpg') ||
      file.name.toLowerCase().endsWith('.jpeg');

    if (!isJpg) {
      // eslint-disable-next-line no-alert
      alert('Only .jpg files are accepted. Please select a valid image.');
      fileInput.value = '';
      return;
    }

    // Show filename in the bottom bar text field
    textInput.value = file.name;

    // Generate preview and reveal the panel
    const reader = new FileReader();
    reader.onload = e => {
      previewImg.src = e.target.result;
      // Reset visibility
      wrapper.querySelector('.fr-selection-panel__controls').style.display =
        'flex';
      wrapper.querySelector('.fr-selection-panel__results').style.display =
        'none';
      selectionPanel.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  });

  // Find Credential # button — calls Lambda via s3script
  findBtn.addEventListener('click', async () => {
    const cutoff = wrapper.querySelector('#fr-cutoff-input').value;
    const file = fileInput.files[0];
    if (!file) return;
    try {
      const response = await findCredentialByFace(file, cutoff);

      let resultData = response;
      if (response && response.body) {
        resultData =
          typeof response.body === 'string'
            ? JSON.parse(response.body)
            : response.body;
      }

      if (resultData && resultData.matches) {
        // hide controls
        wrapper.querySelector('.fr-selection-panel__controls').style.display =
          'none';

        // create or show table
        const resultsContainer = wrapper.querySelector(
          '.fr-selection-panel__results',
        );
        let tableHtml = `
                    <table class="fr-results-table">
                        <thead>
                            <tr>
                                <th>Credential ID</th>
                                <th>Similarity</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
        resultData.matches.forEach(match => {
          // Truncate to 2 decimal places if number, else leave as is
          const sim =
            typeof match.similarity === 'number'
              ? `${match.similarity.toFixed(2)}%`
              : match.similarity;
          tableHtml += `
                        <tr>
                            <td>${match.credential_id}</td>
                            <td>${sim}</td>
                        </tr>
                    `;
        });
        tableHtml += `
                        </tbody>
                    </table>
                `;
        resultsContainer.innerHTML = tableHtml;
        resultsContainer.style.display = 'block';
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('findCredentialByFace error:', error);
    }
  });

  block.innerHTML = '';
  block.append(wrapper);
}
