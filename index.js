const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

// ** METODO GET API **
app.get("/api", (req,res) => {
    res.json({
        mensaje: "API DE EMPLEOS"
    })
});

// **  LOGIN Y JSON WEB TOKEN ** 
app.post("/api/login", (req, res) => {
    const user = {
        id: 1,
        nombre: "pablo",
        email: "pablo@email.com"
    }
    
    jwt.sign({user: user}, 'secretKey', {expiresIn: '60s'}, (err, token) => {
        res.json({
            token: token
        })
    })
});

app.post("/api/posts", verifyToken, (req,res) => {
    jwt.verify(req.token, 'secretKey', (error, authData) =>{
        if(error){
            res.sendStatus(403);
        } else {
            res.json({
                mensaje: "Post fue creado",
                authData: authData
            })
        }
    })
});

// Authorization: Bearer <token>
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
        if(typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.listen(3000, function(){
    console.log("Corriendo app NodeJs...");
});

app.use(express.json());

// ** DATOS USUARIO Y EMPLEOS **
const usuarios = [
    {id: 1, nombre: 'Nicolas', cargo: 'Desarrollador Web', tecnologia: 'JAVA', experiencia: true},
    {id: 2, nombre: 'Pablo', cargo: 'Data Analist', tecnologia: 'SQL', experiencia: true},
    {id: 3, nombre: 'Juan', cargo: 'Desarrollador Trainee', tecnologia: 'PYTHON', experiencia: false},

];

let empleos = [
    {id: 1, cargo: 'Desarrollador Web Full Stack', tecnologias: ['HTML','CSS','JavaScript','React','SQL','Python','Flask']},
    {id: 2, cargo: 'Front End Developer', tecnologias: ['HTML','CSS','JavaScript','Angular']},
    {id: 3, cargo: 'Desarrollador BackEnd',tecnologias:['Java','SpringBoot','MySQL']},
]


// ** METODOS GET **
app.get('/',(req,res) =>{
    res.send('Bienvenido!');
});

app.get('/api/usuarios', (req,res) => {
    res.send(usuarios);
});

app.get('/api/usuarios/:id', (req,res) =>{
    const usuario = usuarios.find(c => c.id === parseInt(req.params.id));
    if(!usuario) return res.status(404).send('No se ha encontrado el usuario');
    else res.send(usuario);
});

app.get('/api/empleos', (req,res) => {
    res.send(empleos);
});

app.get('/api/empleos/:id', (req,res) =>{
    const empleo = empleos.find(c => c.id === parseInt(req.params.id));
    if(!empleo) return res.status(404).send('No se ha encontrado el empleo');
    else res.send(empleo);
});

// ** METODOS POST **
app.post('/api/usuarios', (req, res) => {
    const usuario = {
        id: usuarios.length + 1,
        nombre: req.body.nombre,
        cargo: req.body.cargo,
        tecnologia: req.body.tecnologia,
        experiencia: (req.body.experiencia === 'true')
    };

    usuarios.push(usuario);
    res.send(usuario);
})

app.post('/api/empleos', (req, res) => {
    const empleo = {
        id: empleos.length + 1,
        cargo: req.body.cargo,
        tecnologia: req.body.tecnologia,
    };

    empleos.push(empleo);
    res.send(empleo);
})


// ** METODO DELETE**
app.delete('/api/usuarios/:id', (req, res) => {
    const usuario = usuarios.find(c => c.id === parseInt(req.params.id));
    if(!usuario) return res.status(404).send('Usuario no encontrado');

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.send(usuario);
})

app.delete('/api/empleos/:id', (req, res) => {
    const empleo = empleos.find(c => c.id === parseInt(req.params.id));
    if(!empleo) return res.status(404).send('Empleo no encontrado');

    const index = empleos.indexOf(empleo);
    empleos.splice(index, 1);
    res.send(empleo);
})


// ** PUERTO **
const port = process.env.port || 80;
app.listen(port, () => console.log(`Escuchando en el puerto ${port}...`));