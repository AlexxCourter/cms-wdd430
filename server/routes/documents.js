var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Document = require('../models/document');


// to be completed
router.get('/', (req, res, next) => {
    Document.find({},{_id:0}).then(documents => {
        res.status(200).json({
            message: "Documents retrieved from database",
            documentList: documents
        });
    })
});

router.post('/', (req, res, next) => {
    const maxDocumentId = sequenceGenerator.nextId("documents");
  
    const document = new Document({
      id: maxDocumentId,
      name: req.body.name,
      description: req.body.description,
      url: req.body.url
    });
  
    document.save()
      .then(createdDocument => {
        res.status(201).json({
          message: 'Document added successfully',
          document: createdDocument
        });
      })
      .catch(error => {
         res.status(500).json({
            message: 'An error occurred',
            error: error
          });
      });
});

router.put('/:id', (req, res, next) => {
Document.findOne({ id: req.params.id },{_id:0})
    .then(document => {
    document.name = req.body.name;
    document.description = req.body.description;
    document.url = req.body.url;

    Document.updateOne({ id: req.params.id }, document)
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
        error: { document: 'Document not found'}
        });
    });
});

router.delete("/:id", (req, res, next) => {
    Document.findOne({ id: req.params.id })
      .then(document => {
        Document.deleteOne({ id: req.params.id })
          .then(result => {
            res.status(204).json({
              message: "Document deleted successfully"
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
          message: 'Document not found.',
          error: { document: 'Document not found'}
        });
      });
  });

module.exports = router;