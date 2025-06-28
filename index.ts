import express from 'express';
import axios from 'axios';
import { decryptMedia } from '@open-wa/wa-decrypt';

const app = express();
app.use(express.json());

const PORT = 3000;

app.post('/decrypt-audio', async (req, res) => {
  try {
    const { url, mediaKey } = req.body;

    if (!url || !mediaKey) {
      return res.status(400).json({ error: 'URL and mediaKey are required' });
    }

    // Baixa o arquivo .enc como buffer
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const encBuffer = Buffer.from(response.data);

    // Descriptografa o buffer usando mediaKey
    const decrypted = await decryptMedia(encBuffer, mediaKey);

    // Converte para base64
    const base64Audio = decrypted.toString('base64');

    res.json({ base64: base64Audio });
  } catch (error) {
    console.error('Erro ao descriptografar áudio:', error);
    res.status(500).json({ error: 'Failed to decrypt audio' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
