const express = require('express');
const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;

// Permitir que tu página de Netlify se comunique con este servidor
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Ruta para recibir el número y mandar el WhatsApp
app.post('/enviar', (req, res) => {
    let numeroUsuario = req.body.telefono;

    if (!numeroUsuario) {
        return res.status(400).json({ error: 'Falta el número de teléfono' });
    }

    if (!numeroUsuario.startsWith('whatsapp:')) {
        numeroUsuario = `whatsapp:${numeroUsuario}`;
    }

    client.messages.create({
        body: '¡Hola! Este es el mensaje automático enviado desde Sinergia Bot.',
        from: 'whatsapp:+14155238886',
        to: numeroUsuario
    })
    .then(message => {
        res.json({ success: true, message: '¡Mensaje enviado con éxito!' });
    })
    .catch(err => {
        console.error('Error al enviar:', err);
        res.status(500).json({ success: false, error: err.message });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
