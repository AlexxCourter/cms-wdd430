const express = require('express');

const app = express();

app.use('/api/contacts', (req, res, next)=> {
    const contact = [
        {
            id: '1',
            name: 'Rex Barzee',
            email: 'barzeer@byui.edu',
            phone: '208-496-3768',
            imageUrl: '../../assets/images/barzeer.jpg',
            group: null
          }
        ]
    res.status(200).json({
        message: 'contact retrieved successfully',
        contacts: contact
    });
});

module.exports = app;