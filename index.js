const express = require('express');
const cron = require('node-cron');
const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Programar la tarea automática: Todos los días a las 18:00 hs (6 PM)
cron.schedule('0 18 * * *', () => {
    console.log('Ejecutando el bot automático de Sinergia Escolar...');
    client.messages.create({
        body: 'Hola, Sinergia Bot te recuerda: ¿Cómo vas con tu tarea asignada?',
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+549381XXXXXXXX'
    })
    .then(message => console.log('Mensaje enviado con ID: ' + message.sid))
    .catch(err => console.error('Error al enviar:', err));
});

app.get('/', (req, res) => {
    res.send('Sinergia Bot Server está activo y operando 24/7.');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
