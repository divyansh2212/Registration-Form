const express = require("express")
const path = require("path")
const app = express()
const hbs = require("hbs")

require("./db/connection")
const Register = require("./models/schema")

const port = process.env.PORT || 3000

app.set("view engine", "hbs")

const staticPath = path.join(__dirname, "../public")
app.use(express.static(staticPath))

const viewsPath = path.join(__dirname, "./templates/views")
app.set("views", viewsPath)

const partialsPath = path.join(__dirname, "./templates/partials")
hbs.registerPartials(partialsPath)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
    res.render('index')
})

app.get("/login", (req, res) => {
    res.render('login')
})

app.get("/signup", (req, res) => {
    res.render('signup')
})

app.post("/signup", async (req, res) => {
    try {
        // const data = req.body
        if (req.body.password !== req.body.cpassword) {
            return res.status(422).send("Passwords are not matching!")
        }
        if (!req.body.password || !req.body.cpassword || !req.body.email || !req.body.name) {
            return res.status(422).send("Please fill all the details!")
        }
        else {
            const isUserExist = await Register.findOne({ email: req.body.email })
            if (isUserExist) {
                return res.status(422).send("User Already Exists!")
            }
            const user = new Register({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                cpassword: req.body.cpassword
            })
            await user.save()
            res.status(201).render('login')
        }

    } catch (e) {
        res.status(422).send(e)
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(422).send("Incomplete Credentials")
        }
        const isUserExist = await Register.findOne({ email: email })
        if (!isUserExist) {
            return res.status(422).send("Invalid Credentials")
        }
        if (password !== isUserExist.password) {
            return res.status(422).send("Invalid Credentials")
        }
        res.status(201).render("index")
    } catch (e) {
        console.log(e);
    }
})




app.get("/", (req, res) => {
    res.send("INDEX PAGE")
})

app.get("/login", (req, res) => {
    res.send("This is login page")
})

app.get("/signup", (req, res) => {
    res.send("This is signup page")
})

app.listen(port, () => {
    console.log(`Listening at the port no ${port}`);
})