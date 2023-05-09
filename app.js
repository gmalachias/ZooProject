const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

const app = express();


dotenv.config({ path: './config.env' })

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_ROOT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("Mysql connected")
    }
})

app.set('view engine', 'hbs')

const path = require("path")
const publicDir = path.join(__dirname, './public')

app.use(express.static(publicDir))

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/loggedin", (req, res, next) => {
    var query = "SELECT * FROM zoo.animals ORDER BY name DESC";
    db.query(query, (error, data) => {
        if (error) {
            throw error;
        } else {
            res.render("loggedin", {
                action: 'list', hasData: true, dbdata: data,
            })
        }
    })
})


app.use(express.urlencoded({ extended: 'false' }))
app.use(express.json())


app.post("/auth/login", (req, res) => {
    const { name, password } = req.body
    db.query('SELECT usertype FROM users WHERE username = ? and password = ?', [name, password], async (error, result) => {
        if (error) {
            console.log(error)
        }
        if (result.length == 0) {
            return res.render('login', {
                message: 'Username and Password do not match'
            })
        }
        var query = "SELECT * FROM zoo.animals ORDER BY name ASC";
        db.query(query, (error, data) => {
            if (error) {
                throw error;
            } else {
                if (result[0].usertype === "admin") {

                    return res.render('loggedin', {
                        action: 'list',
                        hasData: true,
                        dbdata: data,
                        isAdmin: true,
                        isCaretaker: false,
                        isSanitor: false
                    })
                } else if (result[0].usertype === "sanitor") {
                    return res.render('loggedin', {
                        action: 'list',
                        hasData: true,
                        dbdata: data,
                        isAdmin: false,
                        isCaretaker: false,
                        isSanitor: true
                    })
                } else {
                    return res.render('loggedin', {
                        action: 'list',
                        hasData: true,
                        dbdata: data,
                        isAdmin: false,
                        isCaretaker: true,
                        isSanitor: false
                    })
                }
            }
        })

    })

})

app.post("/auth/register", (req, res) => {
    const { name, type, password, password_confirm } = req.body
    db.query('SELECT username FROM users WHERE username = ?', [name], async (error, result) => {
        console.log("here")
        if (error) {
            console.log(error)
        }
        if (result.length > 0) {
            console.log("over here")
            return res.render('register', {
                message: 'This username is already in use'
            })
        } else if (password !== password_confirm) {
            return res.render('register', {
                message: 'Passwords do not match'
            })
        }
        db.query('INSERT INTO users SET?', { username: name, usertype: type, password: password }, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                console.log(result)
                return res.render('register', {
                    message: 'User registered!'
                })
            }
        })
    })
})

app.get("/add", (req, res) => {
    res.render("loggedin", { title: 'Insert Animal Data', add: true })
})

app.post("/add_data", (req, res, next) => {
    var name = req.body.name;
    var hair = req.body.hair;
    var feathers = req.body.feathers;
    var eggs = req.body.eggs;
    var milk = req.body.milk;
    var airborne = req.body.airborne;
    var aquatic = req.body.aquatic;
    var predator = req.body.predator;
    var toothed = req.body.toothed;
    var backbone = req.body.backbone;
    var breathes = req.body.breathes;
    var venomous = req.body.venomous;
    var fins = req.body.fins;
    var legs = req.body.legs;
    var tail = req.body.tail;
    var domestic = req.body.domestic;
    var catsize = req.body.catsize;
    var type = req.body.type;

    var query = `INSERT INTO animals (name, hair, feathers, eggs, milk, airborne, aquatic, predator, toothed, backbone, breathes, venomous, fins, legs, tail, domestic, catsize, type)
    VALUES ("${name}","${hair}","${feathers}","${eggs}","${milk}","${airborne}","${aquatic}","${predator}","${toothed}","${backbone}","${breathes}","${venomous}","${fins}","${legs}","${tail}","${domestic}","${catsize}","${type}")`

    db.query(query, (error,data)=>{
        if(error){
            throw error
        } else {
            res.redirect("/loggedin")
        }
    })
})

app.get('/edit/:name', (req,res,next)=>{
    var name = req.params.name;
    var query = `SELECT * FROM animals WHERE name = "${name}"`;
    db.query(query, (error,data)=>{
        res.render("loggedin", {title: 'Edit animal Data', edit:true, animalData:data[0]});
    })
})

app.post('/edit_data/:name', (req,res,next)=>{
    var sname = req.params.name
    var name = req.body.name;
    var hair = req.body.hair;
    var feathers = req.body.feathers;
    var eggs = req.body.eggs;
    var milk = req.body.milk;
    var airborne = req.body.airborne;
    var aquatic = req.body.aquatic;
    var predator = req.body.predator;
    var toothed = req.body.toothed;
    var backbone = req.body.backbone;
    var breathes = req.body.breathes;
    var venomous = req.body.venomous;
    var fins = req.body.fins;
    var legs = req.body.legs;
    var tail = req.body.tail;
    var domestic = req.body.domestic;
    var catsize = req.body.catsize;
    var type = req.body.type;

    var query = `
    UPDATE animals
    SET name = "${name}",
    hair = "${hair}",
    feathers = "${feathers}",
    eggs = "${eggs}",
    milk = "${milk}",
    airborne = "${airborne}",
    aquatic = "${aquatic}",
    predator = "${predator}",
    toothed = "${toothed}",
    backbone = "${backbone}",
    breathes = "${breathes}",
    venomous = "${venomous}",
    fins = "${fins}",
    legs = "${legs}",
    tail = "${tail}",
    domestic = "${domestic}",
    catsize = "${catsize}",
    type = "${type}"
    WHERE name = "${sname}"
    `;

    db.query(query, (error,data)=>{
        if(error){
            throw error;
        } else {
            res.redirect("/loggedin")
        }
    })
})

app.get('/delete/:name', (req,res,next)=>{
    var name = req.params.name
    var query = `DELETE FROM animals WHERE name = "${name}"`

    db.query(query, (error,data)=>{
        if(error){
            throw error;
        } else {
            res.redirect('/loggedin');
        }
    })
})

app.listen(5000, () => {
    console.log("server started on port 5000")
})