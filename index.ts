import express from 'express';
import axios from 'axios';
import { decryptMedia } from '@open-wa/wa-decrypt';

const app = express();
app.use(express.json());

// Usa a porta do Railway ou 3000 como fallback
const PORT = process.env.PORT || 3000;

app.post('/decrypt-audio', async (req, res) => {
  try {
    const { url, mediaKey } = req.body;

    if (!url || !mediaKey) {
      return res.status(400).json({ error: 'URL and mediaKey are required' });
    }

    // Faz o download do arquivo .enc
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const encryptedBuffer = Buffer.from(response.data);

    // Descriptografa o buffer usando o mediaKey
    const decrypted = await decryptMedia(encryptedBuffer, mediaKey);

    // Converte o buffer descriptografado para base64
    const base64Audio = decrypted.toString('base64');

    // Retorna o base64 em JSON
    res.json({ base64: base64Audio });
  } catch (error) {
    console.error('Error decrypting audio:', error);
    res.status(500).json({ error: 'Failed to decrypt audio' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
