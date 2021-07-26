const express = require('express')

const { RestaruntsModal } = require("../../db");

const router = express.Router()

router.get('/', async function (req, res) {

    try {
        const restaurants = await RestaruntsModal.find({})
        console.log(restaurants)
        res.status(200).json(restaurants)
    } catch (error) {
        res.status(404).send()
    }
})

module.exports = router