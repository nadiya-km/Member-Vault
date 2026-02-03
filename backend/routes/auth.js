const express = require('express');
const router = express.Router();
const Member = require('../model/Member');
const jwt = requie('jsonwebtoken');
const bcrypt = require('bcryptjs');
