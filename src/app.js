const express = require("express")
const path = require("path")
const app = express()
const hbs = require("hbs")
const port = process.env.PORT || 3000;

require("./db/connection")
const Register = require("./models/schema")

const staticPath = path.join(__dirname, "../public")
app.use(express.static(staticPath));

app.set("view engine", "hbs")
const viewsPath = path.join(__dirname, "../templates/views")
app.set("views", viewsPath)

const partialPath = path.join(__dirname, "../templates/partials")
hbs.registerPartials(partialPath)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
    res.render('index')
})

app.get("/login", (req, res) => {
    res.render('login')
})

app.get("/register", (req, res) => {
    res.render('register')
})

app.post("/register", async (req, res) => {
    try {
        const password = req.body.password
        const cpassword = req.body.cpassword

        if (password === cpassword) {
            const registerStudent = new Register({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                motherName: req.body.motherName,
                fatherName: req.body.fatherName,
                address: req.body.address,
                gender: req.body.gender,
                dob: req.body.dob,
                email: req.body.email,
                password: req.body.password,
                cpassword: req.body.cpassword
            })

            const registered = await registerStudent.save()
            res.status(201).render(index)

        } else {
            res.send("Passwords are not matching.")
        }

    } catch (e) {
        res.status(400).send(e)
    }
})

app.get("/", (req, res) => {
    res.status(404).send('404 NOT FOUND');
})

app.listen(port, () => {
    console.log(`server is running at port ${port}`);
})