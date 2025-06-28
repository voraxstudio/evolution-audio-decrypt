import express from 'express';
import { decryptMedia } from '@open-wa/wa-decrypt';

const app = express();
app.use(express.json());

// Usa a porta do Railway ou 3000 como fallback
const PORT = process.env.PORT || 3000;

app.post('/decrypt-audio', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.mediaKey || !message.url) {
      return res.status(400).json({ error: 'Message with url and mediaKey is required' });
    }

    // Descriptografa o áudio usando o objeto completo da mensagem e a mediaKey
    const decrypted = await decryptMedia(message, message.mediaKey);

    // Converte o buffer descriptografado para base64
    const base64Audio = decrypted.toString('base64');

    // Retorna o base64 em JSON
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
