var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');

// to be completed
router.get('/', (req, res, next) => {
    Message.find({},{_id:0}).then(messages => {
        res.status(200).json({
            message: "Messages retrieved from database",
            messageList: messages
        });
    })
});

router.post('/', (req, res, next) => {
    const maxMessageId = sequenceGenerator.nextId("messages");
  
    const message = new Message({
      id: maxMessageId,
      subject: req.body.subject,
      msgText: req.body.msgText,
      sender: "101"
    });
  
    message.save()
      .then(createdMessage => {
        res.status(201).json({
          message: 'Message added successfully',
          newMessage: createdMessage
        });
      })
      .catch(error => {
         res.status(500).json({
            message: 'An error occurred: failed to save',
            error: error
          });
      });
});

router.put('/:id', (req, res, next) => {
Message.findOne({ id: req.params.id },{_id:0})
    .then(message => {
      message.subject = req.body.subject;
      message.msgText = req.body.message;

    Message.updateOne({ id: req.params.id }, message)
        .then(result => {
        res.status(204).json({
            message: 'Document updated successfully'
        })
        })
        .catch(error => {
            res.status(500).json({
            message: 'An error occurred',
            error: error
        });
        });
    })
    .catch(error => {
    res.status(500).json({
        message: 'Document not found.',
        error: { message: 'Document not found'}
        });
    });
});

router.delete("/:id", (req, res, next) => {
    Message.findOne({ id: req.params.id })
      .then(document => {
        Message.deleteOne({ id: req.params.id })
          .then(result => {
            res.status(204).json({
              message: "Message deleted successfully"
            });
          })
          .catch(error => {
             res.status(500).json({
             message: 'An error occurred',
             error: error
           });
          })
      })
      .catch(error => {
        res.status(500).json({
          message: 'Message not found.',
          error: { message: 'Document not found'}
        });
      });
  });


module.exports = router;