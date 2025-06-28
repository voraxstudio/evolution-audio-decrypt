import express, { Request, Response } from 'express';
import axios from 'axios';
import { decryptMedia } from '@open-wa/wa-decrypt';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/decrypt-audio', async (req: Request, res: Response) => {
  try {
    const { url, mediaKey } = req.body;

    if (!url || !mediaKey) {
      return res.status(400).json({ error: 'URL and mediaKey are required' });
    }

    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const encryptedBuffer = Buffer.from(response.data);

    const decrypted = await decryptMedia(encryptedBuffer, mediaKey);

    const base64Audio = decrypted.toString('base64');

    res.json({ base64: base64Audio });
  } catch (error) {
    console.error('Error decrypting audio:', error);
    res.status(500).json({
      error: 'Failed to decrypt audio',
      details: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : null,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
