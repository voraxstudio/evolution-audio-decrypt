import express from 'express';
import { decryptMedia } from '@open-wa/wa-decrypt';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/decrypt-audio', async (req, res) => {
  try {
    const message = req.body;

    if (!message || !message.url || !message.mediaKey) {
      return res.status(400).json({ error: 'Message with url and mediaKey is required' });
    }

    // Aqui passa o objeto inteiro para decryptMedia
    const decrypted = await decryptMedia(message, message.mediaKey);

    const base64Audio = decrypted.toString('base64');

    return res.json({ base64: base64Audio });
  } catch (error) {
    console.error('Error decrypting audio:', error);
    return res.status(500).json({
      error: 'Failed to decrypt audio',
      details: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : null,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
