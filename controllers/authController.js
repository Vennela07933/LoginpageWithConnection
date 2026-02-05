const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../models/user");

exports.register = async (req, res) => {
    const { email, password } = req.body;

    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: users.length + 1, email, password: hashedPassword };
    users.push(user);

    res.status(201).json({
        message: "User Registered Successfully",
        user: { id: user.id, email: user.email }
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) return res.status(400).json({ message: "Invalid Email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ message: "Login Successful", token });
};

exports.profile = (req, res) => {
    res.json({
        message: "Welcome to the profile page",
        user: req.user
    });
};