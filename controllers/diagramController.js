const model = require('../models/diagram');

module.exports.deleteDiagram = function(req, res){
    model.deleteDiagram(req.query.did);
    res.redirect(req.get('referer'));
}

module.exports.addDiagramRelation = function(req, res){
    diagram1Id = req.get('diagram1Id');
    diagram2Id = req.get('diagram2Id'); 
    realtionName = req.get('relationName');
    projectId = req.get('pid');
    model.addDiagramRelation(diagram1Id, diagram2Id, realtionName, projectId);
}

module.exports.projectRelations = function(req, res){
    model.getProjectRelations(req.query.pid, function(results){
        res.send(results)
  })
}

module.exports.deleteDiagramRelation = function(req, res){
    model.deleteDiagramRelation(req.query.id, function(results){
        res.send("deleted")
  })
}

module.exports.createDiagram = function (req, res) {
    var name = req.get('name');
    var description = req.get('description');
    var projectId = req.get('pid');
    model.addDiagram(name, description, projectId);
}