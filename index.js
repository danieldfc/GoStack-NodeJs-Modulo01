const express = require("express");

const server = express();

server.use(express.json());

let projects = [];

// Verifica se colocou algum título ao projeto
function checkProjectExist(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({ error: "Poject title is required" });
  }
  return next();
}

// Verifica se existe algum projeto com o id
function checkProjectInArray(req, res, next) {
  const project = projects.find(project => project.id == req.params.index);

  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  req.project = project;

  return next();
}

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Method: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

// listar projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// Criar projeto
server.post("/projects", checkProjectExist, (req, res) => {
  // solução com id incrementável
  const { title } = req.body;

  projects.push({ id: projects.length + 1, title, task: [] });

  return res.json(projects);
  // solução com id estático
  // const { id, title } = req.body;

  // projects.push({ id, title, task: [] });

  // return res.json(projects);
});

server.put(
  "/projects/:index",
  checkProjectInArray,
  checkProjectExist,
  (req, res) => {
    const { title } = req.body;

    projects.find(project => project.id === req.project.id).title = title;

    return res.json(projects);
  }
);

server.delete("/projects/:index", checkProjectInArray, (req, res) => {
  const projectIndex = projects.findIndex(
    project => project.id === req.project.id
  );

  projects.splice(projectIndex, 1);

  return res.send();
});

server.listen(3000);
